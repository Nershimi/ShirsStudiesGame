const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.pushQuestion = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(400).send("Not Allowed Request");
    }
    try {
      const questions = req.body;
      if (!Array.isArray(questions)) {
        return res
          .status(400)
          .send("Invalid input data. Expected an array of definitions.");
      }

      const batch = db.batch();

      questions.forEach((question) => {
        const {
          question: questionText,
          correctAnswer,
          wrongAnswers,
          level,
          topic,
          subtopic,
        } = question;
        const docRef = db.collection("questions").doc(); // Auto-generate ID

        batch.set(docRef, {
          question: questionText,
          correctAnswer,
          wrongAnswers,
          level,
          topic,
          subtopic,
        });
      });

      await batch.commit();

      res.status(200).send("Questions saved successfully.");
    } catch (error) {
      console.error("Error saving questions:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});
