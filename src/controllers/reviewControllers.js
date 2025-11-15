// router.post("/", auth, createReview);

import { updateABookById } from "../models/books/BookModel.js";
import {
  getABorrowById,
  updateABorrowById,
} from "../models/borrowHistory/BorrowModel.js";
import {
  getAllReviews,
  getAReviewById,
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

    //check that the user logged in is the ony one able to create its review
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

    // to check if review actually exist:
    const reviewObj = await getAReviewById(reviewId);

    // only if the review exist:
    if (reviewObj) {
      const { status } = req.body;
      //const userId = req.userInfo._id; -> no need, cause any admin that passed "isAdmin" can do it

      // modify theReview Obj with the new status:Active
      const updatedReviewObj = await updateAReviewById(reviewId, { status });

      // After review is active, the Book rating needs to be updated:
      const allActiveReviews = await getAllReviews({
        bookId: reviewObj.bookId,
        status: "active",
      });

      const avgRating = (
        allActiveReviews.reduce((acc, item) => acc + item.rating, 0) /
        allActiveReviews.length
      ).toFixed(1);

      // update book
      const bookObj = await updateABookById(reviewObj.bookId, {
        averageRating: avgRating,
      });

      // return
      return res.json({
        status: "success",
        message: "Review active and updated Rating",
        updatedReviewObj,
      });
    } else {
      const error = {
        message: "Review not found",
      };
      next(error);
    }
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
    // const userId = req.userInfo._id;
    // const reviews = await getAllReviews({ userId });

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
