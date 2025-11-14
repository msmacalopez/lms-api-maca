import Joi from "joi";

const STR = Joi.string();
const STR_REQUIRED = STR.required();
const PHONE = STR.allow("", null);
const EMAIL = STR.email({ minDomainSegments: 2 });
const ISTRUE = Joi.boolean().allow(null);
const NUM_REQ = Joi.number();

const joiValidator = ({ req, res, next, schema }) => {
  try {
    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

export const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    fName: STR_REQUIRED,
    lName: STR_REQUIRED,
    phone: PHONE,
    email: EMAIL.required(),
    password: STR_REQUIRED,
  });
  return joiValidator({ req, res, next, schema });
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL.required(),
    password: STR_REQUIRED,
  });
  return joiValidator({ req, res, next, schema });
};

// creating a book
export const newBookValidation = (req, res, next) => {
  const schema = Joi.object({
    title: STR_REQUIRED,
    author: STR_REQUIRED,
    isbn: STR_REQUIRED,
    publishedYear: NUM_REQ,
    thumbnail: STR_REQUIRED,
    description: STR_REQUIRED,
  });
  return joiValidator({ req, res, next, schema });
};

// update book validation
export const updateBookValidation = (req, res, next) => {
  const schema = Joi.object({
    title: STR,
    author: STR,
    publishedYear: Joi.number(),
    thumbnail: STR,
    description: STR,
    status: STR.valid("active", "inactive"),
  });
  return joiValidator({ req, res, next, schema });
};
