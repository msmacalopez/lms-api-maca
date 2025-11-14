// router.post("/", auth, createReview);

import {
  getABorrowById,
  updateABorrowById,
} from "../models/borrowHistory/BorrowModel.js";
import {
  getAllReviews,
  insertReview,
  updateAReviewById,
} from "../models/reviews/ReviewModel.js";

// router.get("/", auth, getMyReviews);

// router.patch("/status/:reviewId", auth, isAdmin, updateStatus);

export const createReview = async (req, res, next) => {
  try {
    // get user
    const userId = req.userInfo._id;

    // get borrow Id
    const { borrowId } = req.params;

    // get review body
    const { title, description, rating } = req.body;

    // get borrow data
    const borrow = await getABorrowById(borrowId);

    if (String(borrow.userId) == String(req.userInfo._id)) {
      const review = await insertReview({
        userId,
        borrowId,
        bookId: borrow.bookId,
        title,
        description,
        rating,
      });

      // update borrow status
      const updateBorrow = await updateABorrowById(borrowId, {
        status: "reviewed",
      });

      return res.json({
        status: "success",
        message: "Review created!",
        review,
      });
    } else {
      const error = {
        message: "User not authorized to review",
      };
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const approveReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const { status } = req.body;
    const userId = req.userInfo._id;

    const updatedReviewObj = await updateAReviewById(reviewId, { status });
    return res.json({
      status: "success",
      message: "Review active",
      updatedReviewObj,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyReviews = async (req, res, next) => {
  try {
    //userId:<id>
    const filter = {
      userId: req.userInfo._id,
    };
    const reviews = await getAllReviews(filter);

    return res.json({
      status: "success",
      message: "My Reviews Listed!",
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsForAll = async (req, res, next) => {
  try {
    const reviewsAll = await getAllReviews({});

    return res.json({
      status: "success",
      message: "All Reviews Listed!",
      reviewsAll,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const reviewId = req.params;
    const { status } = req.body;
    const updatedReview = await updateAReviewById(reviewId, { status });
  } catch (error) {
    next(error);
  }
};
