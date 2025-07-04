const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.saveUserPersonalDetails = functions.https.onRequest(
  async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== "POST") {
        res.status(400).send("Please send a POST request");
        return;
      }

      try {
        const userDetails = req.body;
        if (
          !userDetails.email ||
          !userDetails.dateOfBirth ||
          !userDetails.fullName ||
          !userDetails.userId ||
          !userDetails.selectedUniversity
        ) {
          res.status(400).send("Missing user details");
          return;
        }
        const universitiesRef = db.collection("Universities");
        const snapshot = await universitiesRef
          .where("university", "==", userDetails.selectedUniversity.label)
          .get();

        if (snapshot.empty) {
          res.status(404).send("University not found");
          return;
        }
        const docRef = snapshot.docs[0].ref;

        const dateOfBirth = admin.firestore.Timestamp.fromDate(
          new Date(userDetails.dateOfBirth)
        );

        await db.collection("usersDetails").doc(userDetails.userId).set({
          email: userDetails.email,
          dateOfBirth: dateOfBirth,
          fullName: userDetails.fullName,
          created: admin.firestore.FieldValue.serverTimestamp(),
          universityRef: docRef,
        });

        res.status(200).send("User's details saved successfully");
      } catch (error) {
        console.error("Error adding user details: ", error);
        res.status(500).send("Internal Server Error");
      }
    });
  }
);
