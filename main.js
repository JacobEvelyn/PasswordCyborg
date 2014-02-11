"use strict";

// main.js
// Jacob Evelyn
// 2014

(function() {
  var result, error;

  var generatePassword = function() {
    var buffer;
    var password = "";
    var numbers = "0123456789";
    var lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    var uppercaseLetters = lowercaseLetters.toUpperCase();
    var symbols = "~@#$%^&*()_-+={}[]|?/':;<,>.";
    var validCharacters = "";
    var params = EasyAPI.input().params;

    if (params.letters) {
      if (params.uppercase) { validCharacters += uppercaseLetters; }
      if (params.lowercase) { validCharacters += lowercaseLetters; }
    }

    if (params.numbers) { validCharacters += numbers; }
    if (params.symbols) { validCharacters += symbols; }

    // If nothing characters are valid, render an error.
    if (validCharacters === "") {
      error = "No allowed characters.";
      return
    }

    while (password.length < params.length) {
      buffer = new Uint8Array(1);

      // Get a random number, but handle the case where we don't have enough
      // entropy to do so.
      try {
        window.crypto.getRandomValues(buffer);
      } catch (e) {
        error = "Not enough entropy to generate random values.";
        return;
      }

      // If our random value is within the validCharacters, add that character
      // to our password. Otherwise, do nothing (to avoid a non-uniform
      // character distribution in the final password).
      if (buffer[0] < validCharacters.length) {
        password += validCharacters[buffer[0]];
      }

      result = password;
    }
  };

  EasyAPI.setDefaults({
    format: "txt",
    length: 30,
    uppercase: true,
    lowercase: true,
    letters: true,
    numbers: true,
    symbols: true
  });

  generatePassword();

  if (result) {
    EasyAPI.result(result);
  } else {
    EasyAPI.error(error);
  }
})();
