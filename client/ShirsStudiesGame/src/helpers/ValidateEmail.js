/**
 * return - void
 * The function getting email element covert to JavaScript String.
 * crate value that checking if the email is write correct by the format.
 * If yes - errorMassage will be empty else it will jump error massage
 * to the user saying the email is not valid.
 */
export function isEmailValid(email) {
  let isEmailCorrect = mailFormatValid(email);
  if (isEmailCorrect) {
    return true;
  } else {
    return false;
  }
}

/**
 *
 * @param {*} email
 * @returns true if the email element is equals to the format.
 */
function mailFormatValid(email) {
  if(!email){
    return false;
  }
  let mailFormat =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (email.match(mailFormat)) {
    return true;
  }
  return false;
}
