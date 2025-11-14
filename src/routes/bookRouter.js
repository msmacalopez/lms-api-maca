import express from "express";
import { auth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createBook,
  fetchAllBooks,
  fetchBookDetail,
  fetchPublicBooks,
  removeBook,
  updateBook,
} from "../controllers/bookControllers.js";
import {
  newBookValidation,
  updateBookValidation,
} from "../middlewares/joiValidation.js";

const router = express.Router();

// public books
// api/v1/books/public
router.get("/public", fetchPublicBooks);

// fetch all books (adtive or inactive)
// api/v1/books
router.get("/", auth, isAdmin, fetchAllBooks);

// fetch book detail
router.get("/:id", auth, isAdmin, fetchBookDetail);

// create book
// api/v1/books
router.post("/", newBookValidation, auth, isAdmin, createBook);

// update book
router.patch("/:id", updateBookValidation, auth, isAdmin, updateBook);

// delete a book
router.delete("/:id", auth, isAdmin, removeBook);

export default router;
