// select the whole grid
const grid_wrapper = document.querySelector(".wrapper");
grid_wrapper.addEventListener("click", hide_or_showLogo);
// variable to determine how many card has been opened
let card_open = {
  value: 0
};
// store currently open guessed cards
let current_guessed_card = [];

function hide_or_showLogo(event) {
  const card = event.target;
  // make sure we are not targetting the parent wrapper div
  if (card.className != "wrapper") {
    // the div's have their visibility set to "" by default,
    // we haven't set their visibility explicitly like the images which were explicitly hidden
    if (card.style.visibility == "" || card.style.visibility == "hidden") {
      showLogo(event.target);
    } else {
      hideLogo(event.target);
    }
  }
}

// console.log(event.target.style.visibility);
function showLogo(card) {
  // NB: only the card div can be clicked since the image is hidden
  card.style.backgroundColor = "white"; // show the logo
  card.firstElementChild.style.visibility = "visible";

  // store the opened card in an array and increase the 'card_open' counter
  if (current_guessed_card.length != 0) {
    // the number of cards opened can only be 2 if there is already an opened card
    if (current_guessed_card[0].style.visibility == "visible") {
      card_open = 2;
      current_guessed_card.push(card.firstElementChild);

      correctGuess(current_guessed_card[0], current_guessed_card[1]);

      // setTimeout(correctGuess, 400, current_guessed_card[0], current_guessed_card[1]);
    }
  } else {
    card_open = 1;
    current_guessed_card.push(card.firstElementChild);
  }
  // console.log(card_open);
}

function hideLogo(card) {
  card.parentElement.style.backgroundColor = "black";
  card.style.visibility = "hidden";

  // enable card to be clickable after its been closed
  enableClick(card);

  const card_index = current_guessed_card.indexOf(card);

  // making sure that the right card is being deleted in a scenario where
  // when 3 cards are opened very quickly, with the first pair being a wrong guess,
  // the third card would be the only item in `current_guessed_card` while `card` might be
  // the first or second card that was opened

  // this is so 'current_guessed_card' would have 2 items when checking for correct guesses
  if (current_guessed_card[card_index] == card) {
    current_guessed_card.splice(card_index, 1);
  }

  card_open -= 1;
  // console.log(card_open);
}

function correctGuess(card1, card2) {
  // console.log("-------Timeout function-------");
  // console.log("hiding logo ", card1, card2);
  if (card1.className == card2.className) {
    console.log("you guessed correctly");
    // make sure both the card and its parent div isn't clickable
    preventClick(card1, card2);
    current_guessed_card.splice(0, 2);

    console.log(current_guessed_card);
  } else {
    // prevent wrongly guessed cards to be clickable before any animation
    preventClick(card1, card2);

    setTimeout(hideLogo, 400, card1);
    setTimeout(hideLogo, 400, card2);
    // hideLogo(card1);
    // hideLogo(card2);
    console.log("you guessed wrong");
  }
}

function preventClick(card1, card2) {
  card1.style.pointerEvents = "none";
  card1.parentElement.style.pointerEvents = "none";

  card2.style.pointerEvents = "none";
  card2.parentElement.style.pointerEvents = "none";
}

function enableClick(card) {
  card.style.pointerEvents = "auto";
  card.parentElement.style.pointerEvents = "auto";
}
