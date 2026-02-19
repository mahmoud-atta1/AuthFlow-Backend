const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/protect.middleware");

const { updateMeValidator } = require("../validators/updateMe.validator");
const {
  changePasswordValidator,
} = require("../validators/changePassword.validator");

const {
  uploadUserImage,
  resizeUserImage,
} = require("../middlewares/uploadImage.middleware");

const {
  getMe,
  updateMe,
  deleteMe,
  changePassword,
} = require("../services/user.service");

router.get("/me", protect, getMe);

router.patch(
  "/update-me",
  protect,
  uploadUserImage,
  resizeUserImage,
  updateMeValidator,
  updateMe,
);

router.patch(
  "/change-password",
  protect,
  changePasswordValidator,
  changePassword,
);

router.delete("/delete-me", protect, deleteMe);

module.exports = router;
