const { saveUserPersonalDetails } = require("./saveUserPersonalDetails");
const { pushQuestion } = require("./pushQuestions");
const { getQuestionsByTopic } = require("./getQuestionsByTopic");
const { reportAboutQuestions } = require("./reportAboutQuestions");
const { getUserDetails } = require("./getUserDetails");
const { updateSubtopicQuestions } = require("./updateSubtopicQuestions");

module.exports = {
  saveUserPersonalDetails,
  pushQuestion,
  getQuestionsByTopic,
  reportAboutQuestions,
  getUserDetails,
  updateSubtopicQuestions
};
