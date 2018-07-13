// select the whole grid
const grid_wrapper = document.querySelector(".wrapper");
grid_wrapper.addEventListener("click", hide_or_showLogo);
// variable to determine how many card has been opened
let card_open = {
  value: 0
};
// store currently opened cards in an array
let currently_open = [];

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
  if (currently_open.length != 0) {
    // the number of cards opened can only be 2 if there is already an opened card
    if (currently_open[0].style.visibility == "visible") {
      card_open = 2;
      currently_open.push(card.firstElementChild);

      setTimeout(correctGuess, 400, currently_open[0], currently_open[1]);
    }
  } else {
    card_open = 1;
    currently_open.push(card.firstElementChild);
  }
  // console.log(card_open);
}

function hideLogo(card) {
  card.parentElement.style.backgroundColor = "black";
  card.style.visibility = "hidden";

  const card_index = currently_open.indexOf(card);

  // making sure that the right card is being deleted in a scenario where
  // when 3 cards are opened very quickly, with the first pair being a wrong guess,
  // the third card would be the only item in `currently_open` while `card` might be
  // the first or second card that was opened

  // this is so 'currently_open' would have 2 items when checking for correct guesses
  if (currently_open[card_index] == card) {
    currently_open.splice(card_index, 1);
  }

  card_open -= 1;
  // console.log(card_open);
}

function correctGuess(card1, card2) {
  // console.log("-------Timeout function-------");
  // console.log("hiding logo ", card1, card2);
  if (card1.className == card2.className) {
    console.log("you guessed correctly");
  } else {
    // console.log("currently open was", currently_open);
    hideLogo(card1);
    hideLogo(card2);
    console.log("you guessed wrong");
  }
}
