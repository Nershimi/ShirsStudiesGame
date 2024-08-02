const MINIMUM_AGE_THRESHOLD = 13;
/**
 * return - void
 * The function getting date element covert to JavaScript Date Object.
 * checking if the age is bigger than 13 years old.
 * If yes - errorMassage will be empty else it will jump error massage
 * to the user saying the age is not compatible
 */
function CheckAgeOverThirteen() {
  let birthDate = new Date(document.getElementById("dateOfBirth").value);
  let today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  let monthDiff = today.getMonth() - birthDate.getMonth();
  let errorMassageOfDate = document.getElementById("errorMassageNotRightAge");
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  if (age <= MINIMUM_AGE_THRESHOLD) {
    errorMassageOfDate.innerHTML = "הרשיום מוגבל לגיל 13 ומעלה <br>";
    return false;
  } else {
    errorMassageOfDate.innerHTML = "";
    return true;
  }
}
