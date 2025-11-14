import {
  deleteABookById,
  getABookById,
  getAllBooks,
  insertBook,
  updateABookById,
} from "../models/books/BookModel.js";

export const fetchPublicBooks = async (req, res, next) => {
  try {
    // get all books with status 'active' true

    const books = await getAllBooks({ status: "active" });

    return res.json({
      status: "success",
      message: "Books Found!",
      books,
    });
  } catch (error) {
    next(error);
  }
};

// fetching all books (actives and inactives)
export const fetchAllBooks = async (req, res, next) => {
  try {
    // get all books with status 'active' true

    const books = await getAllBooks({});

    return res.json({
      status: "success",
      message: "Books Found!",
      books,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchBookDetail = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await getABookById(bookId);

    return res.json({
      status: "success",
      message: "Book Found",
      book,
    });
  } catch (error) {
    next(error);
  }
};

// create book controller
export const createBook = async (req, res, next) => {
  try {
    const bookObject = req.body;
    const book = await insertBook(bookObject);

    return res.json({
      status: "success",
      message: "Book Created!",
      book,
    });
  } catch (error) {
    next(error);
  }
};

// update a book
export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateObj = req.body;

    const book = await updateABookById(id, updateObj);

    return res.json({
      status: "success",
      message: "Book updated!",
      book,
    });
  } catch (error) {
    next(error);
  }
};

// delete a book
export const removeBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await deleteABookById(id);

    return res.json({
      status: "success",
      message: "Book Deleted!",
    });
  } catch (error) {
    next(error);
  }
};
