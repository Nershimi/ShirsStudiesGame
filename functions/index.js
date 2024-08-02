const { saveUserPersonalDetails } = require("./saveUserPersonalDetails");
const { pushQuestion } = require("./pushQuestions");
const { getQuestionsByTopic } = require("./getQuestionsByTopic");
module.exports = {
  saveUserPersonalDetails,
  pushQuestion,
  getQuestionsByTopic,
};
