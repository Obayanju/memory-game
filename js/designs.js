function showLogo() {
	const logo = document.querySelector(".slack");
	// remove black background
	logo.parentElement.style.backgroundColor = 'white';
	logo.style.visibility = "visible";
}