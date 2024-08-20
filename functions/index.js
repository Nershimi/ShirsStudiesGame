const { saveUserPersonalDetails } = require("./saveUserPersonalDetails");
const { pushQuestion } = require("./pushQuestions");
const { getQuestionsByTopic } = require("./getQuestionsByTopic");
const { reportAboutQuestions } = require("./reportAboutQuestions");
module.exports = {
  saveUserPersonalDetails,
  pushQuestion,
  getQuestionsByTopic,
  reportAboutQuestions,
};
