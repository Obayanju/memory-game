const num_unique_cards = 2;
// variable to determine how many card has been opened
let card_open = {
  value: 0
};
// store currently open guessed cards
let current_guessed_card = [];
let correct_guesses = 0;
let timer_started = false;
let seconds_elapsed = 0;
let intervalID;
let moves = 0;
let stars = 3;

document.addEventListener("DOMContentLoaded", function() {
  let randomized_img_tags = [];
  randomized_img_tags = shuffle(createImageTags());
  addImagesToDiv(randomized_img_tags);

  // select the whole grid
  const grid_wrapper = document.querySelector(".wrapper");
  grid_wrapper.addEventListener("click", hide_or_showLogo);
  grid_wrapper.addEventListener("click", timer);
});

function addImagesToDiv(images) {
  let card_divs = document.querySelectorAll(".card");
  card_divs.forEach(function(card, index) {
    if (images[index] !== undefined) {
      card.appendChild(images[index]);
    }
  });
}

function createImageTags() {
  let image_tags = [];

  let index = 0;
  const images = [
    "slack",
    "zendesk",
    "docker",
    "intercom",
    "netflix",
    "snapchat",
    "spotify",
    "twilio"
  ];
  for (let i = 1; i <= num_unique_cards; i++) {
    let my_image = document.createElement("img");
    // there is two versions of every image
    let my_image_clone = document.createElement("img");

    my_image.src = "img/" + images[index] + ".svg";
    my_image_clone.src = "img/" + images[index] + ".svg";

    my_image.className = images[index];
    my_image_clone.className = images[index];

    my_image.alt = images[index] + " logo";
    my_image_clone.alt = images[index] + " logo";

    index += 1;
    // if we push `my_image` twice rather than using `my_image_clone`,
    // it wouldn't work with `appendChild`
    image_tags.push(my_image);
    image_tags.push(my_image_clone);
  }
  return image_tags;
}

function removeImagesFromDiv() {
  let card_divs = document.querySelectorAll(".card");
  card_divs.forEach(function(card) {
    card.innerHTML = "";
  });
}

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
  // if player open and closes a card, its a move
  // if player guesses wrongly, it's also a move
  // also, we don't want to increment 'moves' twice for a wrong guess
  if (current_guessed_card.length == 1) {
    moves++;
    document.querySelector("#moves").innerHTML = moves;
  }
  // check rating after moves is incremented
  starRating();
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
    // if player guesses correctly, its a move
    moves++;
    document.querySelector("#moves").innerHTML = moves;
    // check rating after moves is incremented
    starRating();
    // make sure both the card and its parent div isn't clickable
    preventClick(card1, card2);
    current_guessed_card.splice(0, 2);
    correct_guesses += 1;
    // the game is won
    if (correct_guesses == num_unique_cards) {
      console.log("You have won the game");
      const star_rating = document.querySelector("#stars").innerHTML;
      const message =
        "You have won the game!\nIt took you " +
        seconds_elapsed +
        " seconds, " +
        moves +
        " moves, and " +
        stars +
        " stars\nPlay Again?";
      const response = window.confirm(message);
      console.log(response);
      if (response) {
        // restart the game

        // reset timer
        clearInterval(intervalID);
        seconds_elapsed = 0;
        // make sure the timer is restarted
        timer_started = false;
        const all_cards = document.querySelectorAll(".card");
        all_cards.forEach(function(card, index) {
          if (index < 4) {
            console.log(card);
            hideLogo(card.firstElementChild);
          }
        });
        correct_guesses = 0;
        removeImagesFromDiv();
        let randomized_img_tags = [];
        randomized_img_tags = shuffle(createImageTags());
        addImagesToDiv(randomized_img_tags);
      } else {
        // user does not want to play again
        clearInterval(intervalID);
      }
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

function timer() {
  if (!timer_started) {
    var start = Date.now();
    // check every 10 millisecond, how many seconds has passed
    intervalID = setInterval(function() {
      document.querySelector("#timer").innerHTML = seconds_elapsed;
      // how many milliseconds has elapsed since start
      var delta = Date.now() - start;
      // convert to seconds
      seconds_elapsed = Math.floor(delta / 1000);
    }, 10);
  }
  timer_started = true;
}

function starRating() {
  if (moves == 8) {
    const star = document.querySelector("#star3");
    star.style.visibility = "hidden";
    stars -= 1;
    console.log(stars, " stars");
  } else if (moves == 12) {
    const star = document.querySelector("#star2");
    star.style.visibility = "hidden";
    stars -= 1;
    console.log(stars, " stars");
  }
}