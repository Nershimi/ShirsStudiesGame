import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();

const getUniversities = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Universities"));
    const universities = [];
    querySnapshot.forEach((doc) => {
      universities.push({
        id: doc.id,
        university: doc.data().university,
      });
    });
    return universities;
  } catch (error) {
    console.error("Error getting universities: ", error);
  }
};

export default getUniversities;
