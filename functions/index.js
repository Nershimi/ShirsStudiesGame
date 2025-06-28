const { saveUserPersonalDetails } = require("./saveUserPersonalDetails");
const { pushQuestion } = require("./pushQuestions");
const { getQuestionsByTopic } = require("./getQuestionsByTopic");
const { reportAboutQuestions } = require("./reportAboutQuestions");
const { getUserDetails } = require("./getUserDetails");
const { updateSubtopicQuestions } = require("./updateSubtopicQuestions");
const { deleteDocumentsBySubtopic } = require("./deleteSubtopicDoc");
const { updateTopicReferences } = require("./updateTopicReferences");
const { deletePharmacologyCourses } = require("./deletePharmacologyCourses");

module.exports = {
  saveUserPersonalDetails,
  pushQuestion,
  getQuestionsByTopic,
  reportAboutQuestions,
  getUserDetails,
  updateSubtopicQuestions,
  deleteDocumentsBySubtopic,
  updateTopicReferences,
  deletePharmacologyCourses
};
