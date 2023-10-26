window.addEventListener("load", () => {
  document.body.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  setTimeout(function () {
    document.querySelector(".container-fluid").style.display = "block"; // Show the content
    document.querySelector(".container-fluid").style.opacity = 1; // Fade in the content
  }, 1500);
});
