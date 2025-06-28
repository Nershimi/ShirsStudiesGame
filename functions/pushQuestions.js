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

      // Create or get topic reference
      for (const question of questions) {
        const {
          question: questionText,
          correctAnswer,
          wrongAnswers,
          level,
          topic,
          subtopic,
        } = question;

        // Check if the topic exists in the 'courses' collection
        const topicSnapshot = await db
          .collection('courses')
          .where('course', '==', topic)
          .get();

        let topicDocRef;

        // If the topic doesn't exist, create it
        if (topicSnapshot.empty) {
          const newTopicRef = db.collection("courses").doc();
          await newTopicRef.set({
            course: topic,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          topicDocRef = newTopicRef;
        } else {
          topicDocRef = topicSnapshot.docs[0].ref; // Get the first matching document's reference
        }

        // Now create the question with a reference to the topic
        const questionDocRef = db.collection("questions").doc(); // Auto-generate ID

        batch.set(questionDocRef, {
          question: questionText,
          correctAnswer,
          wrongAnswers,
          level,
          topic: topicDocRef, // Reference to topic
          subtopic,
        });
      }

      // Commit all batch operations
      await batch.commit();

      res.status(200).send(`${questions.length} Questions saved successfully.`);
    } catch (error) {
      console.error("Error saving questions:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});
