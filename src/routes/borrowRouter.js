import express from "express";
import { auth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createBorrowHistory,
  getBorrowHistory,
  getAllBorrowHistory,
  returnBook,
} from "../controllers/borrowControllers.js";

const router = express.Router();

// create borrow history-borrow book
// TODO: add validation
router.post("/:bookId", auth, createBorrowHistory);

// get my borrows
router.get("/", auth, getBorrowHistory);

// get All borrows -admin
router.get("/all", auth, isAdmin, getAllBorrowHistory);

// return book (Update Status+returnedDate)
router.patch("/return/:borrowId", auth, returnBook);

export default router;
