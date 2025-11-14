import reviewModel from "./ReviewSchema.js";

//Add Review
export const insertReview = (objReview) => {
  return reviewModel(objReview).save();
};

//Read all reviews
export const getAllReviews = (filter) => {
  return reviewModel.find(filter);
};

//get Review by idReview
export const getAReviewById = (id) => {
  return reviewModel.findById(id);
};

//update borrow by id (made it available, etc)
export const updateAReviewById = (id, updatedObj) => {
  return reviewModel.findByIdAndUpdate(id, updatedObj, { new: true });
};

//delete review
export const deleteReviewById = (id) => {
  return reviewModel.findByIdAndDelete(id);
};
