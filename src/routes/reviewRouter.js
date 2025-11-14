import express from "express";
import { auth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createReview,
  approveReview,
  getMyReviews,
  getReviewsForAll,
} from "../controllers/reviewControllers.js";
//IMPORT FROM REVIEWCONTROLLER.JS

const router = express.Router();

//create review
//TODO: add validation
router.post("/:borrowId", auth, createReview);

//admin approve review - status: active
router.patch("/:reviewId", auth, isAdmin, approveReview);

//get my reviews
router.get("/", auth, getMyReviews);

//admin get all reviews
router.get("/all", auth, isAdmin, getReviewsForAll);

//Modify Reviews
// router.patch("/status/:reviewId", auth, isAdmin, updateStatus);

export default router;
