import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore();

const addUniversityToFirestore = async (university) => {
  const newUniversity = {
    university: university.label, // Make sure you're passing only valid fields here
  };
  try {
    await addDoc(collection(db, "Universities"), newUniversity);
    console.log("University added successfully");
  } catch (error) {
    console.error("Error adding university: ", error);
  }
};

export default addUniversityToFirestore;
