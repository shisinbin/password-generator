// note to self: to help understand what's going on, uncomment the console.log() code
// on lines 181, 309, and 314, and then inspect->console on browser 

// Array of special characters to be included in password
var specialCharacters = [
  '@',
  '%',
  '+',
  '\\',
  '/',
  "'",
  '!',
  '#',
  '$',
  '^',
  '?',
  ':',
  ',',
  ')',
  '(',
  '}',
  '{',
  ']',
  '[',
  '~',
  '-',
  '_',
  '.'
];

// Array of numeric characters to be included in password
var numericCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Array of lowercase characters to be included in password
var lowerCasedCharacters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
];

// Array of uppercase characters to be included in password
var upperCasedCharacters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

// boolean "listener" that checks to see if user wants to cancel process
var userCancels = false;


// Function to shuffle/randomise a string
function shuffleString(str) {

  // put string characters into array (so that splice can be used)
  var strArr = [];
  for (character of str) {
    strArr.push(character);
  }

  /*
  while string array is not empty, randomly select one character from array,
  add this to new password before removing it from string array
  */
  var newPassword = "";
  while (strArr.length !==0) {
    var randomIndex = Math.floor(Math.random() * strArr.length);
    newPassword += strArr[randomIndex];
    strArr.splice(randomIndex, 1);
  }

  // return shuffled password
  return newPassword;
}


/*
Function that randomly works out how many characters from each included character set
to put into password (assuming that we require at least one character from each set).
It returns the number of characters for each included character set that the password should have.
This approach for randomly choosing n numbers so that they add up to the sum m,
was helped by reading the following forum post:
https://forum.pdpatchrepo.info/topic/12561/random-numbers-that-add-up-to-a-certain-number/6#:~:text=ingox-,A%20nice%20solution,-has%20been%20proposed
*/
function getNumbersForEachCharacterSet(options) {

  // store max length of password into variable
  var maxLength = options.length;

  // initialise arrays to hold character set labels and their corresponding totals
  var totalLabels = []
  var totalNumbers = [];

  /*
  go through each of the character set options, and if true,
  add both a label and corresponding 1 (as password should include at least 1) to arrays
  */
  if (options.characterSets.upper) {
    totalLabels.push("numberOfUpperCased");
    totalNumbers.push(1);
  }
  if (options.characterSets.lower) {
    totalLabels.push("numberOfLowerCased");
    totalNumbers.push(1);
  }
  if (options.characterSets.numeric) {
    totalLabels.push("numberOfNumeric");
    totalNumbers.push(1);
  }
  if (options.characterSets.special) {
    totalLabels.push("numberOfSpecial");
    totalNumbers.push(1);
  }

  // calculate remaining length to fill for password
  var remainingLengthToFill = maxLength - totalNumbers.length;

  /* 
  loop the remaining number of times required,
  each time generating a random index number to use
  for incrementing a number in totalNumbers by one
  */
  for (var i = 0; i < remainingLengthToFill; i++) {
    var randomIndex = Math.floor(Math.random() * totalLabels.length);
    totalNumbers[randomIndex] = totalNumbers[randomIndex] + 1;
  }

  // store results into object
  var numsForEachSet = {}
  for (let i = 0; i < totalLabels.length; i++) {
    // label and number share same index position
    numsForEachSet[totalLabels[i]] = totalNumbers[i]
  }

  // console.log(numsForEachSet);

  // return result
  return numsForEachSet;
}


/*
Function to prompt user for password options. It returns the desired length of the password
and the character sets that the password should have at least one character of
*/
function getPasswordOptions() {

  // get valid number between 10-64
  var isValid = false;
  var errorMessage = "";
  while (isValid === false) {
    var lengthOfPassword = prompt(`${errorMessage}How many characters do you want the password to have (enter a number between 10-64 inclusive)?`);

    // check to see if they've clicked cancel
    if (lengthOfPassword === null) {
      userCancels = true;
      return;
    }

    // transform user input into number
    lengthOfPassword = Number(lengthOfPassword);

    // check to see if it's valid or not
    if (lengthOfPassword >= 10 && lengthOfPassword <= 64) {
      isValid = true;
    } else {
      errorMessage = "That is not valid. "
    }
  }

  // logic to ensure at least one character set is chosen
  var atLeastOne = false;
  while (atLeastOne === false) {
    var includesUppercase = confirm("To include uppercase characters click OK, otherwise click Cancel");
    var includesLowercase = confirm("To include lowercase characters click OK, otherwise click Cancel");
    var includesNumeric = confirm("To include numeric characters click OK, otherwise click Cancel");
    var includesSpecialCharacters = confirm("To include special characters click OK, otherwise click Cancel");

    if (includesUppercase || includesLowercase || includesNumeric || includesSpecialCharacters) {
      atLeastOne = true;
    } else {
      var response = confirm("You did not select at least one character set. Let's try this again.");

      // another check to see if user wants to exit
      if (response === false) {
        userCancels = true;
        return;
      }
    }
  }

  // put results into object
  var options = {
    length: lengthOfPassword,
    characterSets: {
      upper: includesUppercase,
      lower: includesLowercase,
      numeric: includesNumeric,
      special: includesSpecialCharacters
    }
  };

  //return object
  return options;
}


// Function for getting a random element from an array
function getRandom(arr) {
  var indexOfElement = Math.floor(Math.random() * arr.length);
  return arr[indexOfElement]
}


// Function to generate password with user input
function generatePassword() {

  // grab password options from user
  var options = getPasswordOptions();

  // check if the user has cancelled asking for password
  if (userCancels) {
    return;
  }

  // get the number of characters for each character set to be put into password
  var result = getNumbersForEachCharacterSet(options);

  /*
  using the result above, check each possible property it could have and if it does,
  randomly select a single character from the character set array the appropriate number of times,
  each time concatenating it to the password string
  */
  var password = ""
  if (result.hasOwnProperty("numberOfUpperCased")) {
    for (let i = 0; i < result.numberOfUpperCased; i++) {
      password += getRandom(upperCasedCharacters);
    }
  }
  if (result.hasOwnProperty("numberOfLowerCased")) {
    for (let i = 0; i < result.numberOfLowerCased; i++) {
      password += getRandom(lowerCasedCharacters);
    }
  }
  if (result.hasOwnProperty("numberOfNumeric")) {
    for (let i = 0; i < result.numberOfNumeric; i++) {
      password += getRandom(numericCharacters);
    }
  }
  if (result.hasOwnProperty("numberOfSpecial")) {
    for (let i = 0; i < result.numberOfSpecial; i++) {
      password += getRandom(specialCharacters);
    }
  }

  /*
  a one-line function I copied from a stack overflow post for shuffling a string
  https://stackoverflow.com/a/60963711
  // const shuffle = str => [...str].sort(() => Math.random() - .5).join('');
  I didn't use this and wrote my own function instead but I'm just leaving it in for me :)
  */

  // console.log(password);

  // shuffle password
  password = shuffleString(password);

  // console.log(password);

  // return password
  return password;
}


// Get references to the #generate element
var generateBtn = document.querySelector('#generate');

// Write password to the #password input
function writePassword() {
  var password = generatePassword();

  // if user has cancelled, exit process, otherwise proceed
  if (password == null) {
    // reset boolean "listener"
    userCancels = false;
    return;
  } else {
    var passwordText = document.querySelector('#password');

    passwordText.value = password;
  }
}

// Add event listener to generate button
generateBtn.addEventListener('click', writePassword);