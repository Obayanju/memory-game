// select the whole grid
const grid_wrapper = document.querySelector(".wrapper");
grid_wrapper.addEventListener("click", hide_or_showLogo);

function hide_or_showLogo(event) {
  const card = event.target;
  // make sure we are targetting the card div or the image and not the parent wrapper div
  if (card.className == "slack" || card.className == "card") {
		// the div's have their visibility set to "" by default,
		// we haven't set their visibility explicitly like the images which are explicitly hidden
    if (card.style.visibility == "" || card.style.visibility == "hidden") {
      showLogo();
    } else {
      hideLogo();
    }
  }
}

// console.log(event.target.style.visibility);
function showLogo() {
  const logo = document.querySelector(".slack");
  // remove black background
  logo.parentElement.style.backgroundColor = "white";
  logo.style.visibility = "visible";
}

function hideLogo() {
  const logo = document.querySelector(".slack");
  // remove black background
  logo.parentElement.style.backgroundColor = "black";
  logo.style.visibility = "hidden";
}
