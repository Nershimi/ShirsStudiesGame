const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
    admin.initializeApp();
}

const db = admin.firestore();

const BATCH_SIZE = 100; // מספר המסמכים שנטפל בהם בכל פעם

exports.updateTopicReferences = functions.runWith({
  timeoutSeconds: 540, // 9 דקות
  memory: '1GB', // להגדיל זיכרון במידת הצורך
}).https.onRequest(async (req, res) => {
  try {
    const questionsSnapshot = await db.collection('questions').get();

    if (questionsSnapshot.empty) {
      res.status(404).send('No documents found in the questions collection.');
      return;
    }

    const docs = questionsSnapshot.docs;
    console.log(`Found ${docs.length} documents to process.`);

    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
      const chunk = docs.slice(i, i + BATCH_SIZE);

      const updatePromises = chunk.map(async (questionDoc) => {
        const questionData = questionDoc.data();
        const topic = questionData.topic;

        if (!topic) {
          console.log(`Document ${questionDoc.id} does not have a topic field.`);
          return;
        }

        // Check if topic is already a reference
        if (admin.firestore.DocumentReference.isPrototypeOf(topic)) {
          console.log(`Document ${questionDoc.id} already has a reference in the topic field.`);
          return;
        }

        // Find the corresponding document in the courses collection
        const coursesSnapshot = await db.collection('courses').where('course', '==', topic).get();

        if (coursesSnapshot.empty) {
          console.log(`No course found for topic "${topic}".`);
          return;
        }

        // Assuming there is only one matching course document
        const courseDoc = coursesSnapshot.docs[0];
        const courseRef = db.collection('courses').doc(courseDoc.id);

        // Update the topic field in the questions document to be a reference
        await questionDoc.ref.update({ topic: courseRef });
        console.log(`Updated topic field in document ${questionDoc.id} to reference course ${courseDoc.id}`);
      });

      // חכה שכל המסמכים בקבוצה יעודכנו לפני המעבר לקבוצה הבאה
      await Promise.all(updatePromises);
    }

    res.status(200).send('Topic references updated successfully.');
  } catch (error) {
    console.error('Error updating topic references:', error);
    res.status(500).send('Error updating topic references.');
  }
});
