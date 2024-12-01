const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.getUserDetails = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "GET") {
      return res.status(400).send("Not Allowed Request");
    }
    try {
      const userId = req.get("userId");
      if (!userId) {
        console.log(userId);
        res.status(400).send("Missing userId");
        return;
      }

      const userDoc = await db.collection("usersDetails").doc(userId).get();

      if (!userDoc.exists) {
        return res.status(404).send("User ID not found");
      }

      const userData = userDoc.data();
      // Check if the "university" field is a Firestore reference
      if (userData.university && userData.university.path) {
        const universityRef = userData.university;

        // Fetch the referenced document (optional)
        const universityDoc = await universityRef.get();

        if (universityDoc.exists) {
          userData.university = {
            id: universityDoc.id,
            ...universityDoc.data(),
          };
        } else {
          // If you just want the path as a string
          userData.university = universityRef.path;
        }
      }

      res.status(200).json(userData);
    } catch (error) {
      console.error("Error fetching user details: ", error);
      res.status(500).send("Error fetching users");
    }
  });
});
