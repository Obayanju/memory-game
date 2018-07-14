const num_unique_cards = 2;

function create_image_tags() {
  let image_tags = [];
  let randomized_img_tags = [];
  let index = 0;
  const images = ["slack", "zendesk"];
  for (let i = 1; i <= num_unique_cards; i++) {
    let my_image = document.createElement("img");
    my_image.src = "img/" + images[index] + ".svg";
    my_image.className = images[index];
    my_image.alt = images[index] + " logo";
    index += 1;
    // we have a pair of every image
    image_tags.push(my_image);
    image_tags.push(my_image);

  }
  randomized_img_tags = shuffle(image_tags);
  console.log(randomized_img_tags);
}
create_image_tags();

// Fisher-Yates Shuffle
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// select the whole grid
const grid_wrapper = document.querySelector(".wrapper");
grid_wrapper.addEventListener("click", hide_or_showLogo);
// variable to determine how many card has been opened
let card_open = {
  value: 0
};
// store currently open guessed cards
let current_guessed_card = [];

let correct_guesses = 0;
let all_cards = document.querySelectorAll(".card");

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
    correct_guesses += 1;
    // the game is won
    if (correct_guesses == num_unique_cards) {
      console.log("You have won the game");
      alert("You have won the game");
      all_cards.forEach(function(card, index) {
        if (index < 4) {
          console.log(card);
          hideLogo(card.firstElementChild);
        }
      });
      correct_guesses = 0;
    }
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
