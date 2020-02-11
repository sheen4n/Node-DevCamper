const express = require("express");
const { createUser, getUsers, getUser, updateUser, deleteUser } = require("../controllers/users");

const User = require("../models/User");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.route("/")
    .post(createUser)
    .get(advancedResults(User), getUsers);


router.route("/:id")
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;