let btnControls = document.getElementById("btnControls");
let controlsContainer = document.getElementById("controlsContainer");
let isOpen = false;

//controls
let btnListView = document.getElementById("btnListView");
var isListView = false;
let btnReset = document.getElementById("btnReset");
let btnClear = document.getElementById("btnClear");
let btnHelp = document.getElementById("btnHelp");

btnControls.addEventListener("click", () => {
  if (!isOpen) {
    controlsContainer.style.left = 0;
    btnControls.style.borderRadius = "0";
    isOpen = true;
  } else {
    controlsContainer.style.left = "-284px";
    btnControls.style.borderRadius = "0 0 16px 0";
    isOpen = false;
  }
});

btnListView.addEventListener("click", () => {
  if (!isListView) {
    btnListView.innerHTML =
      '<i class="fa-solid fa-grip-vertical"></i> Switch to Grid View';
    isListView = true;
    document.querySelectorAll(".timer-container").forEach((container) => {
      container.style.minWidth = "100%";
      container.style.minHeight = "auto";
      container.style.flexDirection = "row";
      container.style.gap = "48px";
    });
  } else {
    btnListView.innerHTML =
      '<i class="fa-solid fa-list"></i> Switch to List View';
    isListView = false;

    document.querySelectorAll(".timer-container").forEach((container) => {
      container.style.minWidth = "50%";
      container.style.minHeight = "50vh";
      container.style.flexDirection = "column";
      container.style.gap = "8px";
    });
  }
});

btnReset.addEventListener("click", () => {
  document.querySelectorAll(".btn-warning").forEach((btn) => {
    btn.click();
  });
});

btnClear.addEventListener("click", () => {
  timerArray = [];
  timersContainer.innerHTML = "";
  timerForm.style.minHeight = "100vh";
});


btnHelp.addEventListener("click", () => {
  btnHelp.innerHTML = '<i class="fa-solid fa-circle-info"></i> Coming soon!';
});