const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

const corsHandler = cors({ origin: true });

exports.getQuestionsByTopic = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const idToken = req.headers.authorization
        ? req.headers.authorization.split("Bearer ")[1]
        : null;

      if (!idToken) {
        return res.status(401).send("Unauthorized");
      }

      const { topic } = req.body;

      if (!topic) {
        return res.status(400).send("Topic is required");
      }

      // Fetch all questions for the specified topic
      const querySnapshot = await db
        .collection("questions")
        .where("topic", "==", topic)
        .get();
      const questions = [];

      querySnapshot.forEach((doc) => {
        questions.push({ id: doc.id, ...doc.data() });
      });

      if (questions.length === 0) {
        return res
          .status(404)
          .send("No questions found for the specified topic");
      }

      // Randomly select 30 questions
      const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffledQuestions.slice(0, 30);

      res.status(200).json(selectedQuestions);
    } catch (error) {
      console.error("Error fetching questions: ", error);
      res.status(500).send("Error fetching questions");
    }
  });
});
