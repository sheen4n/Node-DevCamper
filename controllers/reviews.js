const Review = require("../models/Review");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");


// @desc    Get all reviews for bootcamp
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @route   GET /api/v1/reviews
// @access  Public   
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } else {
        return res.status(200).json(res.advancedResults);
    }
});

// @desc    Get single reviews
// @route   GET /api/v1/reviews/:id
// @access  Public   
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await (await Review.findById(req.params.id)).populate({
        path: "bootcamp",
        select: "name description"
    });
    if (!review) return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));

    return res.status(200).json({ success: true, data: review });
});


// @desc    Create new review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404));

    req.body.bootcamp = req.params.bootcampId;

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin")
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add this course`, 401));

    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);
    if (!review) return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));

    // Make sure user is review owner
    if (review.user.toString() !== req.user.id && req.user.role !== "admin")
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this review`, 401));

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: review });
});


// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));

    // Make sure user is review owner
    if (review.user.toString() !== req.user.id && req.user.role !== "admin")
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this review`, 401));

    await review.remove();
    res.status(200).json({ success: true, data: {} });
});
