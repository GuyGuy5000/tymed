let btnControls = document.getElementById("btnControls");
let controlsContainer = document.getElementById("controlsContainer");
let isOpen = false;

//controls
let btnListView = document.getElementById("btnListView");
var isListView = false;
let btnReset = document.getElementById("btnReset");
let btnClear = document.getElementById("btnClear");

let btnMinusMinute = document.getElementById("btnMinusMinute");
let lblTimerDelay = document.getElementById("lblTimerDelay");
let btnPlusMinute = document.getElementById("btnPlusMinute");
var timerDelay = 5;
lblTimerDelay.innerHTML = "+" + timerDelay + "m";

document.querySelectorAll('[name="btnControls"]').forEach((btn) => {
  btn.tabIndex = -1;
});
//toggle controls panel
btnControls.addEventListener("click", () => {
  if (!isOpen) {
    controlsContainer.style.left = 0;
    btnControls.style.borderRadius = "0";
    document.querySelectorAll('[name="btnControls"]').forEach((btn) => { btn.tabIndex = 0; });
    isOpen = true;
  } else {
    //window size is less than 441px wide
    if (window.innerWidth <= 440) {
      controlsContainer.style.left = "-100%";
      btnControls.style.borderRadius = "0";
    } else {
      controlsContainer.style.left = "-284px";
      btnControls.style.borderRadius = "0 0 16px 0";
    }

    document.querySelectorAll('[name="btnControls"]').forEach((btn) => { btn.tabIndex = -1; });
    isOpen = false;
  }
});

//list view
btnListView.addEventListener("click", () => {
  if (!isListView) {
    btnListView.innerHTML = '<i class="fa-solid fa-grip-vertical"></i> Switch to Grid View';
    isListView = true;
    document.querySelectorAll(".timer-container").forEach((container) => {
      container.style.minWidth = "100%";
      container.style.minHeight = "auto";
      container.style.flexDirection = "row";
      container.style.gap = "48px";
    });
  } else {
    btnListView.innerHTML = '<i class="fa-solid fa-list"></i> Switch to List View';
    isListView = false;

    document.querySelectorAll(".timer-container").forEach((container) => {
      container.style.minWidth = "50%";
      container.style.minHeight = "50vh";
      container.style.flexDirection = "column";
      container.style.gap = "8px";
    });
  }
});

//reset
btnReset.addEventListener("click", () => {
  document.querySelectorAll(".btn-warning").forEach((btn) => { btn.click(); });
});

//clear
btnClear.addEventListener("click", () => {
  timerArray = [];
  timersContainer.innerHTML = "";
  timerForm.style.minHeight = "100vh";
});

//increase timer delay
btnPlusMinute.addEventListener("click", () => {
  timerDelay += 1;
  updateTimerDelay();
});

//decrease timer delay
btnMinusMinute.addEventListener("click", () => {
  if (timerDelay >= 2) {
    timerDelay -= 1;
    updateTimerDelay();
  }
});

//re-renders each timer to show updated timer delay (in minutes)
function updateTimerDelay() {
  lblTimerDelay.innerHTML = "+" + timerDelay + "m";

  timerArray.forEach((timerUI) => {
    timerUI.delayInterval = timerDelay;
    timerUI.RenderTimer();
  });
}
