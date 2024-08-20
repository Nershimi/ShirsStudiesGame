const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.reportAboutQuestions = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(400).send("Not Allowed Request");
    }
    try {
      const { question, userId } = req.body;
      if (!Array.isArray(question)) {
        return res
          .status(400)
          .send("Invalid input data. Expected an array of questions.");
      }
      console.log(question);
      const batch = db.batch();
      const userRef = db.collection("usersDetails").doc(userId);

      question.forEach((item) => {
        const { questionId, topic, typeOfReport } = item;
        const questionRef = db.collection("questions").doc(questionId);

        const docRef = db.collection("ReporterQuestions").doc();
        batch.set(docRef, {
          questionRef,
          topic,
          typeOfReport,
          userRef,
        });
      });

      await batch.commit();
      res.status(200).json({ ok: true, message: "Questions reported successfully." });
    } catch (error) {
      console.error("Error saving questions:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});
