class Images {
  constructor() {
    this.imagesArray = [
      "slack",
      "zendesk",
      "docker",
      "intercom",
      "netflix",
      "snapchat",
      "spotify",
      "twilio",
      "slack",
      "zendesk",
      "docker",
      "intercom",
      "netflix",
      "snapchat",
      "spotify",
      "twilio"
    ];
  }

  shuffle() {
    // Fisher-Yates Shuffle
    let currentIndex = this.imagesArray.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = this.imagesArray[currentIndex];
      this.imagesArray[currentIndex] = this.imagesArray[randomIndex];
      this.imagesArray[randomIndex] = temporaryValue;
    }
  }
}

class GameLogic {
  constructor() {
    this.moves = 0;
    this.correctGuess = 0;
    this.stars = 3;
    this.card1 = null;
    this.card2 = null;
    this.secondsElapsed = 0;
    this.timerStarted = false;
    this.intervalID = null;
  }

  updateMovesText() {
    document.querySelector("span#moves").innerHTML = this.moves;
  }

  isSameImage(card1, card2) {
    [this.card1, this.card2] = [card1, card2];
    // card1 and card2 are objects, but we need the element
    const card1Element = document.querySelector(`.card.${this.card1.identity}`);
    const card2Element = document.querySelector(`.card.${this.card2.identity}`);
    // get the image element so we can access the src attribute value
    const card1ElementImage = card1Element.querySelector("img");
    const card2ElementImage = card2Element.querySelector("img");

    const img1 = card1ElementImage.getAttribute("src");
    const img2 = card2ElementImage.getAttribute("src");
    if (img1 === img2) {
      return true;
    }
    return false;
  }

  timer() {
    if (!this.timerStarted) {
      const start = Date.now();
      // check every 10 millisecond, how many seconds has passed
      this.intervalID = setInterval(() => {
        document.querySelector("span#timer").innerHTML = this.secondsElapsed;
        // how many milliseconds has elapsed since start
        const delta = Date.now() - start;
        // convert to seconds
        this.secondsElapsed = Math.floor(delta / 1000);
      }, 10);
      this.timerStarted = true;
    }
  }

  startTimerWhenCardIsClicked() {
    const wrapper = document.querySelector(".wrapper");
    wrapper.addEventListener("click", this.timer.bind(this));
  }

  endTimer() {
    clearInterval(this.intervalID);
    this.secondsElapsed = 0;
    document.querySelector("span#timer").innerHTML = this.secondsElapsed;
  }

  gameisWon() {
    console.log(this);
    const message = `You have won the game!\nIt took you ${
      this.secondsElapsed
    } seconds, ${this.moves} moves, and ${this.stars} stars\nPlay Again?`;
    this.endTimer();
    const response = window.confirm(message);
    console.log(response);
    if (response) {
      // restartGame();
    } else {
      // user does not want to play again
    }
  }

  restartGame() {}

  starRating() {
    if (this.moves === 8) {
      const star = document.querySelector("#star3");
      star.style.visibility = "hidden";
      this.stars -= 1;
    } else if (this.moves === 12) {
      const star = document.querySelector("#star2");
      star.style.visibility = "hidden";
      this.stars -= 1;
    }
  }
}

class AllCards extends GameLogic {
  constructor() {
    super();
    this.allCards = [];
    this.openedCards = [];
  }

  add(card) {
    this.allCards.push(card);
  }

  // do something when two cards are opened
  addTwoCardsOpenListener(card) {
    const cardElement = card.getCardElement();
    cardElement.addEventListener("click", this.checkCorrectGuess.bind(this));
  }

  closeTwoCards() {
    this.openedCards[0].hide();
    this.openedCards[1].hide();
    this.openedCards = [];
  }

  checkCorrectGuess() {
    for (let i = 0; i < this.allCards.length; i += 1) {
      if (this.allCards[i].isOpen) {
        if (this.allCards[i] !== this.openedCards[0]) {
          this.openedCards.push(this.allCards[i]);
        }
      }
    }
    if (this.openedCards.length === 2) {
      if (this.isSameImage(this.openedCards[0], this.openedCards[1])) {
        // a correct guess
        this.correctGuess += 1;
        this.moves += 1;
        this.updateMovesText();
        // check star rating after a move
        this.starRating();
        // leave the cards physically open(isOpen is set to false because we
        // don't want to interact with the cards in the future when looking
        // for cards that are open)
        this.openedCards[0].isOpen = false;
        this.openedCards[1].isOpen = false;
        this.openedCards = [];
        if (this.correctGuess === this.allCards.length / 2) {
          // game is won
          this.gameisWon();
        }
      } else {
        this.moves += 1;
        this.updateMovesText();
        // check star rating after a move
        this.starRating();
        // close the cards
        setTimeout(this.closeTwoCards.bind(this), 500);
      }
    }
  }

  returnAllCards() {
    return this.allCards;
  }
}

const images = new Images();
images.shuffle();
let card;
const cardDeck = new AllCards();
cardDeck.startTimerWhenCardIsClicked();

class Card {
  constructor(identity, aClone) {
    this.identity = identity;
    this.aClone = aClone;
    this.isOpen = false;
  }

  addClickListener() {
    const myCard = this.getCardElement();
    // make sure 'this' is the card object, so we can access the isOpen property
    myCard.addEventListener("click", this.hideOrShow.bind(this));
  }

  getCardElement() {
    return document.querySelector(`.card.${this.identity}`);
  }

  /** add a div, with an img as a child, into the DOM */
  setImage() {
    const myImage = document.createElement("img");
    if (this.aClone) {
      myImage.src = `img/${this.identity.slice(0, -5)}.svg`;
    } else {
      myImage.src = `img/${this.identity}.svg`;
    }

    // create the div for the img tag
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", this.identity);
    document.querySelector(".wrapper").appendChild(cardDiv);

    cardDiv.appendChild(myImage);
  }

  show() {
    const cardDiv = this.getCardElement();
    cardDiv.style.visibility = "hidden";
    const img = document.querySelector(`.card.${this.identity} img`);
    img.style.visibility = "visible";
    this.isOpen = true;
    // make sure user can't click on an already opened card to close it.
    // cards would only be closed after a wrong or right match
    this.disableClick();
  }

  hide() {
    const cardDiv = this.getCardElement();
    cardDiv.style.visibility = "visible";
    const img = document.querySelector(`.card.${this.identity} img`);
    img.style.visibility = "hidden";
    this.isOpen = false;
    this.enableClick();
  }

  hideOrShow(e) {
    // only respond to click on the card DIV itself
    if (e.target.nodeName !== "UL") {
      if (this.isOpen) {
        this.hide();
      } else if (cardDeck.openedCards.length < 2) {
        this.show();
        // If two cards are opened, check if its a correct guess
        cardDeck.checkCorrectGuess();
      }
    }
  }

  disableClick() {
    this.getCardElement().style.pointerEvents = "none";
  }

  enableClick() {
    this.getCardElement().style.pointerEvents = "auto";
  }
}

const alreadyExistingCards = [];
let cardExists = false;
// loop through the 16 card names, and create a card accordingly
for (let i = 0; i < 16; i += 1) {
  // Check if we are dealing with a card name that's already been used.
  // Trying to make sure we don't have the same class names for two cards
  // with the same image
  for (let j = 0; j < alreadyExistingCards.length; j += 1) {
    if (images.imagesArray[i] === alreadyExistingCards[j]) {
      cardExists = true;
    }
  }
  // change the card's identity(class name) depending on whether
  // a card with the same name is already existing
  if (cardExists) {
    const identity = `${images.imagesArray[i]}clone`;
    card = new Card(identity, true);
    card.setImage();
    card.addClickListener();
    cardDeck.add(card);
    cardExists = false;
  } else {
    const identity = images.imagesArray[i];
    card = new Card(identity, false);
    card.setImage();
    card.addClickListener();
    cardDeck.add(card);
    alreadyExistingCards.push(images.imagesArray[i]);
  }
}

// const num_unique_cards = 8;
// // variable to determine how many card has been opened
// let card_open = {
//   value: 0
// };
// // store currently open guessed cards
// let current_guessed_card = [];
// let correct_guesses = 0;
// let timer_started = false;
// let seconds_elapsed = 0;
// let intervalID;
// let moves = 0;
// let stars = 3;

// document.addEventListener("DOMContentLoaded", function() {
//   generateCardDivs();
//   let randomized_img_tags = [];
//   randomized_img_tags = shuffle(createImageTags());
//   addImagesToDiv(randomized_img_tags);

//   // select the whole grid
//   const grid_wrapper = document.querySelector(".wrapper");
//   grid_wrapper.addEventListener("click", hide_or_showLogo);
//   // grid_wrapper.addEventListener("click", timer);

//   const restart = document.querySelector("#restart");
//   restart.addEventListener("click", restartGame);
// });

// // create the card divs and add them to the wrapper ul
// function generateCardDivs() {
//   for (let i = 1; i <= 16; i++) {
//     let cardDiv = document.createElement("div");
//     cardDiv.classList.add("card");
//     document.querySelector(".wrapper").appendChild(cardDiv);
//   }
// }

// function addImagesToDiv(images) {
//   let card_divs = document.querySelectorAll(".card");
//   card_divs.forEach(function(card, index) {
//     if (images[index] !== undefined) {
//       card.appendChild(images[index]);
//     }
//   });
// }

// function createImageTags() {
//   let image_tags = [];

//   let index = 0;
//   const images = [
//     "slack",
//     "zendesk",
//     "docker",
//     "intercom",
//     "netflix",
//     "snapchat",
//     "spotify",
//     "twilio"
//   ];
//   for (let i = 1; i <= num_unique_cards; i++) {
//     let my_image = document.createElement("img");
//     // there is two versions of every image
//     let my_image_clone = document.createElement("img");

//     my_image.src = "img/" + images[index] + ".svg";
//     my_image_clone.src = "img/" + images[index] + ".svg";

//     my_image.className = images[index];
//     my_image_clone.className = images[index];

//     my_image.alt = images[index] + " logo";
//     my_image_clone.alt = images[index] + " logo";

//     index += 1;
//     // if we push `my_image` twice rather than using `my_image_clone`,
//     // it wouldn't work with `appendChild`
//     image_tags.push(my_image);
//     image_tags.push(my_image_clone);
//   }
//   return image_tags;
// }

// function removeImagesFromDiv() {
//   let card_divs = document.querySelectorAll(".card");
//   card_divs.forEach(function(card) {
//     card.innerHTML = "";
//   });
// }

// // Fisher-Yates Shuffle
// function shuffle(array) {
//   let currentIndex = array.length;
//   let temporaryValue;
//   let randomIndex;

//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;

//     // And swap it with the current element.
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }

//   return array;
// }

// function hide_or_showLogo(event) {
//   timer();
//   const card = event.target;
//   // make sure we are not targetting the parent wrapper div
//   if (card.className != "wrapper") {
//     // the div's have their visibility set to "" by default,
//     // we haven't set their visibility explicitly like the images which were explicitly hidden
//     if (card.style.visibility == "" || card.style.visibility == "hidden") {
//       showLogo(event.target);
//     } else {
//       hideLogo(event.target);
//     }
//   }
// }

// // console.log(event.target.style.visibility);
// function showLogo(card) {
//   // NB: only the card div can be clicked since the image is hidden
//   card.style.backgroundColor = "white"; // show the logo
//   card.firstElementChild.style.visibility = "visible";

//   // store the opened card in an array and increase the 'card_open' counter
//   if (current_guessed_card.length != 0) {
//     // the number of cards opened can only be 2 if there is already an opened card
//     if (current_guessed_card[0].style.visibility == "visible") {
//       card_open = 2;
//       current_guessed_card.push(card.firstElementChild);

//       correctGuess(current_guessed_card[0], current_guessed_card[1]);

//       // setTimeout(correctGuess, 400, current_guessed_card[0], current_guessed_card[1]);
//     }
//   } else {
//     card_open = 1;
//     current_guessed_card.push(card.firstElementChild);
//   }
// }

// function hideLogo(card) {
//   card.parentElement.style.backgroundColor = "black";
//   card.style.visibility = "hidden";
//   // if player open and closes a card, its a move
//   // if player guesses wrongly, it's also a move
//   // also, we don't want to increment 'moves' twice for a wrong guess
//   if (current_guessed_card.length == 2) {
//     moves++;
//     document.querySelector("#moves").innerHTML = moves;
//     // check rating after moves is incremented
//     starRating();
//   }
//   // enable card to be clickable after its been closed
//   enableClick(card);

//   const card_index = current_guessed_card.indexOf(card);

//   // making sure that the right card is being deleted in a scenario where
//   // when 3 cards are opened very quickly, with the first pair being a wrong guess,
//   // the third card would be the only item in `current_guessed_card` while `card` might be
//   // the first or second card that was opened

//   // this is so 'current_guessed_card' would have 2 items when checking for correct guesses
//   if (current_guessed_card[card_index] == card) {
//     current_guessed_card.splice(card_index, 1);
//   }

//   card_open -= 1;
// console.log(card_open);
// }

// function correctGuess(card1, card2) {
//   // console.log("-------Timeout function-------");
//   // console.log("hiding logo ", card1, card2);
//   if (card1.className == card2.className) {
//     console.log("you guessed correctly");
//     // if player guesses correctly, its a move
//     moves++;
//     document.querySelector("#moves").innerHTML = moves;
//     // check rating after moves is incremented
//     starRating();
//     // make sure both the card and its parent div isn't clickable
//     preventClick(card1, card2);
//     current_guessed_card.splice(0, 2);
//     correct_guesses += 1;
//     // the game is won
//     if (correct_guesses == num_unique_cards) {
//       console.log("You have won the game");
//       const message =
//         "You have won the game!\nIt took you " +
//         seconds_elapsed +
//         " seconds, " +
//         moves +
//         " moves, and " +
//         stars +
//         " stars\nPlay Again?";
//       const response = window.confirm(message);
//       console.log(response);
//       if (response) {
//         restartGame();
//       } else {
//         // user does not want to play again
//         clearInterval(intervalID);
//       }
//     }
//   } else {
//     // prevent wrongly guessed cards to be clickable before any animation
//     preventClick(card1, card2);

//     setTimeout(hideLogo, 400, card1);
//     setTimeout(hideLogo, 400, card2);
//     // hideLogo(card1);
//     // hideLogo(card2);
//     console.log("you guessed wrong");
//   }
// }

// function restartGame() {
//   // restart the game

//   // reset timer
//   clearInterval(intervalID);
//   seconds_elapsed = 0;
//   document.querySelector("#timer").innerHTML = seconds_elapsed;
//   // make sure the timer is restarted
//   timer_started = false;

//   // reset number of moves
//   moves = 0;
//   document.querySelector("#moves").innerHTML = 0;

//   // reset stars
//   stars = 3;
//   const allStars = document.querySelectorAll(".star");
//   allStars.forEach(function enableVisibility(star) {
//     star.style.visibility = "visible";
//   });

//   const all_cards = document.querySelectorAll(".card");
//   all_cards.forEach(function(card) {
//     hideLogo(card.firstElementChild);
//   });
//   correct_guesses = 0;
//   removeImagesFromDiv();
//   let randomized_img_tags = [];
//   randomized_img_tags = shuffle(createImageTags());
//   addImagesToDiv(randomized_img_tags);
// }

// function preventClick(card1, card2) {
//   card1.style.pointerEvents = "none";
//   card1.parentElement.style.pointerEvents = "none";

//   card2.style.pointerEvents = "none";
//   card2.parentElement.style.pointerEvents = "none";
// }

// function enableClick(card) {
//   card.style.pointerEvents = "auto";
//   card.parentElement.style.pointerEvents = "auto";
// }

// function timer() {
//   if (!timer_started) {
//     var start = Date.now();
//     // check every 10 millisecond, how many seconds has passed
//     intervalID = setInterval(function() {
//       document.querySelector("#timer").innerHTML = seconds_elapsed;
//       // how many milliseconds has elapsed since start
//       var delta = Date.now() - start;
//       // convert to seconds
//       seconds_elapsed = Math.floor(delta / 1000);
//     }, 10);
//     timer_started = true;
//   }
// }

// function starRating() {
//   if (moves == 8) {
//     const star = document.querySelector("#star3");
//     star.style.visibility = "hidden";
//     stars -= 1;
//     console.log(stars, " stars");
//   } else if (moves == 12) {
//     const star = document.querySelector("#star2");
//     star.style.visibility = "hidden";
//     stars -= 1;
//     console.log(stars, " stars");
//   }
// }
