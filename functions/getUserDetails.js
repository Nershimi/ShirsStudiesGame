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

      res.status(200).json(userDoc.data());
    } catch (error) {
      console.error("Error fetching user details: ", error);
      res.status(500).send("Error fetching users");
    }
  });
});
