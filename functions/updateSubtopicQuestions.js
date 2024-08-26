const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.updateSubtopicQuestions = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(400).send("Not Allowed Request");
    }
    try {
      const questions = req.body;
      if (!Array.isArray(questions)) {
        return res.status(400).send("Invalid input data, Expected an array");
      }

      const batch = db.batch();

      for (const question of questions) {
        const {
          id,
          subtopic,
          wrongAnswers,
          question: questionText,
          topic,
          correctAnswer,
          level,
        } = question;

        if (!id || !subtopic) {
          throw new Error("Invalid question format: missing id or subtopic");
        }

        const docRef = db.collection("questions").doc(id);
        const doc = await docRef.get(); // שימוש ב-await

        if (!doc.exists) {
          return res.status(404).send(`Document with ID ${id} not found`);
        }

        batch.update(docRef, {
          subtopic,
          wrongAnswers,
          question: questionText,
          topic,
          correctAnswer,
          level,
        });
      }

      await batch.commit(); // שימוש ב-await

      res.status(200).send("Question updated successfully!");
    } catch (error) {
      console.error("Error updating question: ", error);
      res.status(500).send("Internal Server Error");
    }
  });
});
