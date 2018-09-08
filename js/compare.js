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
        restartGame();
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

function restartGame() {
  // restart the game

  // reset timer
  clearInterval(intervalID);
  seconds_elapsed = 0;
  document.querySelector("#timer").innerHTML = seconds_elapsed;
  // make sure the timer is restarted
  timer_started = false;

  // reset number of moves
  moves = 0;
  document.querySelector("#moves").innerHTML = 0;

  // reset stars
  stars = 3;
  const allStars = document.querySelectorAll(".star");
  allStars.forEach(function enableVisibility(star) {
    star.style.visibility = "visible";
  });

  const all_cards = document.querySelectorAll(".card");
  all_cards.forEach(function(card) {
    hideLogo(card.firstElementChild);
  });
  correct_guesses = 0;
  removeImagesFromDiv();
  let randomized_img_tags = [];
  randomized_img_tags = shuffle(createImageTags());
  addImagesToDiv(randomized_img_tags);
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
    timer_started = true;
  }
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
