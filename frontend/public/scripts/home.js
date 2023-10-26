window.addEventListener("load", () => {
  document.body.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  setTimeout(function () {
    document.querySelector(".container-fluid").style.display = "block"; // Show the content
    document.querySelector(".container-fluid").style.opacity = 1; // Fade in the content
  }, 1500);
});

document.addEventListener("DOMContentLoaded", function () {
  let inputCount = 1;

  // Function to create a new input field
  function createNewInput() {
    inputCount++;
    const newInput = document.createElement("div");
    newInput.className = "form-group mb-3 input-group dynamic-input";
    newInput.innerHTML = `
      <div class="input-group mb-3 border border-2 border-dark rounded-3">
        <span class="input-group-text text-primary" id="basic-addon1">Battery ${inputCount}</span>
        <input
          type="text"
          class="form-control"
          placeholder="Enter Battery link"
          name="battery${inputCount}"
        />
        <span class="input-group-text text-danger" id="basic-addon2">
          <i class="fa-solid fa-trash remove-input"></i>
        </span>
      </div>
    `;
    return newInput;
  }

  // Function to add a new input field when "Add Battery" is clicked
  document.querySelector("#add-battery").addEventListener("click", function () {
    const newInput = createNewInput();
    const addBatteryButton = document.getElementById("add-battery");
    addBatteryButton.parentElement.previousElementSibling.appendChild(newInput);
    console.log(addBatteryButton.parentElement.previousElementSibling)

    // Add an event listener to the new input's trash icon for removal
    const trashIcon = newInput.querySelector(".remove-input");
    trashIcon.addEventListener("click", function () {
      newInput.remove();
    });
  });

  // cant remove inital trash icon
});
