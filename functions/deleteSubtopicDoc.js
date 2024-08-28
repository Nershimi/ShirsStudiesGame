const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.deleteDocumentsBySubtopic = functions.https.onRequest(
  async (req, res) => {
    const subtopic = req.body.subtopic;

    if (!subtopic) {
      return res
        .status(400)
        .send({ error: 'The request must include a "subtopic" in the body.' });
    }

    const collectionRef = db.collection("questions"); // החלף בשם האוסף שלך
    const querySnapshot = await collectionRef
      .where("subtopic", "==", subtopic)
      .get();

    const batch = db.batch();

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return res.status(200).send({
      message: `${querySnapshot.size} documents with subtopic "${subtopic}" deleted.`,
    });
  }
);
