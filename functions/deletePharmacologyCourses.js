const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

exports.deletePharmacologyCourses = functions.https.onRequest(
  async (req, res) => {
    const db = admin.firestore();
    const coursesRef = db.collection("courses");

    // Ensure only DELETE requests are allowed
    if (req.method !== "DELETE") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      // Query for courses where the course field is "פרמקולוגיה"
      const snapshot = await coursesRef
        .where("course", "==", "פרמקולוגיה")
        .get();

      if (snapshot.empty) {
        return res.status(204).send("No courses found with the given criteria.");
      }

      // Delete all matching documents
      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Commit the batch
      await batch.commit();

      return res
        .status(200)
        .send("All pharmacology courses have been deleted.");
    } catch (error) {
      console.error("Error deleting courses: ", error);
      return res.status(500).send(`Error deleting courses: ${error.message}`);
    }
  }
);
