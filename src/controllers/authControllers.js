import { createNewUser, getUserByEmail } from "../models/users/UserModel.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { singAccessJWT, singRefresJWT } from "../utils/jwt.js";

export const createUser = async (req, res, next) => {
  try {
    // create user

    const userObject = req.body;
    userObject.password = hashPassword(req.body.password);

    const user = await createNewUser(userObject);

    return res.json({
      status: "success",
      message: "User created",
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    // get email from request

    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if (user) {
      // compare password
      if (comparePassword(password, user.password)) {
        const payload = { email };
        // access token
        const accessJWT = singAccessJWT(payload);

        // renew token
        const refreshJWT = singRefresJWT(payload);

        // send them as response
        return res.json({
          status: "success",
          message: "User authenticated",
          tokens: {
            accessJWT,
            refreshJWT,
          },
        });
      } else {
        return res.json({
          status: "invalid",
          message: "User couldn't be authenticated",
        });
      }
    } else {
      const error = {
        message: "User not found",
      };
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

// logic to create new access token
export const renewToken = async (req, res, next) => {
  try {
    const payload = { email: req.userInfo.email };
    // access token
    const accessJWT = singAccessJWT(payload);

    return res.json({
      status: "success",
      message: "User authenticated",
      tokens: {
        accessJWT,
      },
    });
  } catch (error) {
    next(error);
  }
};
