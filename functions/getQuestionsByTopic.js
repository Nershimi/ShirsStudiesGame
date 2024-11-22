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
        return res.status(400).send("Course name is required");
      }

      // Fetch the course document based on the course name
      const coursesSnapshot = await db
        .collection("courses")
        .where("course", "==", topic)
        .limit(1) // Expecting a single match
        .get();

      if (coursesSnapshot.empty) {
        return res.status(404).send("Course not found");
      }

      const courseRef = coursesSnapshot.docs[0].ref;

      // Fetch all questions for the specified course
      const querySnapshot = await db
        .collection("questions")
        .where("topic", "==", courseRef)
        .get();

      const questions = [];
      querySnapshot.forEach((doc) => {
        questions.push({ id: doc.id, ...doc.data() });
      });

      if (questions.length === 0) {
        return res
          .status(404)
          .send("No questions found for the specified course");
      }

      res.status(200).json(questions);
    } catch (error) {
      console.error("Error fetching questions: ", error);
      res.status(500).send("Error fetching questions");
    }
  });
});
