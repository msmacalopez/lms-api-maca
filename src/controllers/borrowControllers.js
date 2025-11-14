import { getABookById, updateABookById } from "../models/books/BookModel.js";
import {
  getABorrowById,
  getAllBorrows,
  insertBorrow,
  updateABorrowById,
} from "../models/borrowHistory/BorrowModel.js";

export const createBorrowHistory = async (req, res, next) => {
  try {
    //get the data
    const userId = req.userInfo._id;
    const userName = req.userInfo.fName;
    const { bookId } = req.params;

    const book = await getABookById(bookId);
    if (book) {
      if (book.isAvailable && book.status == "active") {
        // const { bookTitle, thumbnail } = req.body;
        const bookTitle = book.title;
        const thumbnail = book.thumbnail;

        const today = new Date();
        const dueDate = new Date(today.setDate(today.getDate() + 15));

        console.log("USERNAME", userName);
        // creating a borrow
        const borrowHistory = await insertBorrow({
          userName,
          userId,
          bookId,
          bookTitle,
          thumbnail,
          dueDate,
        });

        //
        // update book availability
        const updatebook = await updateABookById(bookId, {
          isAvailable: false,
        });

        return res.json({
          status: "success",
          message: "Book Borrowed",
          borrowHistory,
          updatebook,
        });
      } else {
        next({
          status: 404,
          message: "Book not Available",
        });
      }
    } else {
      next({
        status: 404,
        message: "Book not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getBorrowHistory = async (req, res, next) => {
  try {
    // {userId: <id>}
    const fitler = {
      userId: req.userInfo._id,
    };

    const borrows = await getAllBorrows(fitler);

    return res.json({
      status: "success",
      message: "Borrow History Listed!",
      borrows,
    });
  } catch (error) {
    next(error);
  }
};

export const returnBook = async (req, res, next) => {
  try {
    //
    const { borrowId } = req.params;
    //to string--> cause form DB comes as ObjectID
    const userId = req.userInfo._id.toString();
    const borrowObj = await getABorrowById(borrowId);
    const bookId = borrowObj.bookId;
    const bookObj = await updateABookById(bookId);
    // const bookObj = await getABookById(bookId);

    if (userId == borrowObj.userId) {
      if (
        !bookObj.isAvailable &&
        bookObj.status == "active" &&
        !borrowId.returnedDate
      ) {
        // if (!borrowId.returnedDate)
        borrowObj.returnedDate = new Date();
        borrowObj.status = "return";
        const updateBorrow = await updateABorrowById(borrowId, borrowObj);
        const updatebook = await updateABookById(bookId, {
          isAvailable: true,
        });
        return res.json({
          status: "success",
          message: "Book Returned",
          // updateBorrow,
          // updatebook,
        });
      } else {
        next({
          status: 404,
          message: "Book not for Return",
        });
      }
    } else {
      next({
        status: 404,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    next(error);
  }
};
