//new timer form
var timerForm = document.getElementById("timerForm");
timerForm.style.minHeight = "100vh";

let btnAdd = document.getElementById("btnAddTimer");
let txtName = document.getElementById("txtName");

let timeContainer = document.getElementById("timeContainer");
let txtHours = document.getElementById("txtHours");
let txtMinutes = document.getElementById("txtMinutes");
let txtSeconds = document.getElementById("txtSeconds");

let cboColour = document.getElementById("cboColour");
let btnColour = document.getElementById("btnColour");
let selectedColour = "white";
let colourOptions = document.querySelectorAll('input[name="cboColour"]');

let cboAudio = document.getElementById("cboAudio");
let btnAudio = document.getElementById("btnAudio");
let selectedAudio = new Audio("");
selectedAudio.loop = true;
let audioOptions = document.querySelectorAll('input[name="cboAudio"]');

let txtMessage = document.getElementById("txtMessage");
let btnStart = document.getElementById("btnStart");
let btnCancel = document.getElementById("btnCancel");

//timer array used to hold all timerUI objects and container divs
var timerArray = [];
var timersContainer = document.getElementById("timerArrayContainer");

//used to track timers that are paused on blur 
//this reduces all timer intervals into one check to 
//run more efficiently in the background
var startBlur = null;
var blurInterval = null;
var pausedTimers = [];

//on window blur (lost focus)
addEventListener("blur", () => {
  //track initial time of blur
  startBlur = new Date();
  //pause all actively running timers
  timerArray.forEach((timerUI) => {
    if (!timerUI.timer.isPaused) {
      timerUI.timer.StopTimer();
      pausedTimers.push(timerUI);
    }
  });

  //set one function to check all timers that should be running
  blurInterval = setInterval(() => {
    pausedTimers.forEach((timerUI) => {
      //if timer is done, set to 1 second and unpause
      if (checkTimer(startBlur, timerUI)) {
        timerUI.timer.hours = 0;
        timerUI.timer.minutes = 0;
        timerUI.timer.seconds = 1;
        timerUI.timer.StartTimer(timerUI.timeContainer);
        pausedTimers = pausedTimers.filter((t) => t != timerUI);
      }
    });
  }, 1000);
});

//on window focus
addEventListener("focus", () => {
  clearInterval(blurInterval); //remove check interval
  pausedTimers.forEach((timerUI) => {
      //if timer is done, set to 1 second and unpause
    if (checkTimer(startBlur, timerUI)) {
      timerUI.timer.hours = 0;
      timerUI.timer.minutes = 0;
      timerUI.timer.seconds = 1;
      timerUI.timer.StartTimer(timerUI.timeContainer);
      pausedTimers = pausedTimers.filter((t) => t != timerUI);
    } else { //else calculate time paused and subtract from timers
      let checkTime = new Date();
      let diff = checkTime - startBlur;
      let now = new Date().getTime();
      let end = new Date();

      //add time based on when the timer should be done
      end.setHours(
        timerUI.timer.hours + end.getHours(),
        timerUI.timer.minutes + end.getMinutes(),
        timerUI.timer.seconds + end.getSeconds(),
        0
      );

      let time = end.getTime() - now - diff;
      //set timer to correct time and unpause
      timerUI.timer.hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      timerUI.timer.minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
      timerUI.timer.seconds = Math.floor((time % (1000 * 60)) / 1000);
      timerUI.timer.StartTimer(timerUI.timeContainer);
      pausedTimers = pausedTimers.filter((t) => t != timerUI);
    }
  });
});

//to play audio samples, set sampleTime to an int to play for a timed duration
var sampleTime = 0;
setInterval(() => {
  sampleTime -= 1;
  if (sampleTime <= 0) selectedAudio.pause();
}, 1000);

//show timer form
btnAdd.addEventListener("click", () => { showTimerForm(); });

//hide timer form
btnCancel.addEventListener("click", () => { hideTimerForm(); });

//add timer event
btnStart.addEventListener("click", () => {
  //validation
  if (!validateTimer(txtName, txtHours, txtMinutes, txtSeconds)) return;
  //create timer
  let t = new timer(
    parseInt(txtHours.value),
    parseInt(txtMinutes.value),
    parseInt(txtSeconds.value),
    txtName.value,
    txtMessage.value
  );
  //create container div
  let innerDiv = document.createElement("div");
  innerDiv.classList.add("flex-container");
  innerDiv.classList.add("timer-container");
  innerDiv.id = `${t.id}${timerArray.length}`;
  timersContainer.appendChild(innerDiv);
  //create UI
  let tUI = new timerUI(
    t,
    innerDiv,
    timerDelay,
    selectedColour,
    selectedAudio.src != "" && selectedAudio.src != "noSound" ? selectedAudio.src : null
  );
  tUI.SetSecondaryButtonClass("btn-warning"); // adds css class to reset and dismiss buttons
  t.addEventListener("done", () => { tUI.OnDone(); });
  
  if (isListView) {
    innerDiv.style.minWidth = "100%";
    innerDiv.style.minHeight = "auto";
    innerDiv.style.flexDirection = "row";
    innerDiv.style.gap = "48px";
  }
  //add timer to list
  timerArray.push(tUI);

  //reset timer form
  hideTimerForm();
});

//select colour event
colourOptions.forEach((colourNode) => {
  colourNode.addEventListener("click", () => {
    selectedColour = colourNode.value.toLowerCase();                     //update
    btnColour.innerHTML = `${selectedColour} <i class="nav-arrow"></i>`; //render
    timerForm.style.backgroundColor = `var(--${selectedColour})`;        //and show selected colour
  });
});

//select audio event
audioOptions.forEach((audioNode) => {
  audioNode.addEventListener("click", async () => {
    //no sound to sample
    if (audioNode.dataset.audio == "noSound") {
      btnAudio.innerHTML = `No Sound <i class="nav-arrow"></i>`;
      selectedAudio.src = null;
    } else {
      selectedAudio.src = "audio/" + audioNode.dataset.audio.toLowerCase(); //update
      btnAudio.innerHTML = `${audioNode.value} <i class="nav-arrow"></i>`;  //render
      selectedAudio.play();                                                 //and play sample for 4 seconds
      sampleTime = 4;
    }
  });
});

//validates user input and highlights controls with wrong input
function validateTimer(titleInput, hoursInput, minutesInput, secondsInput) {
  const isValid = (n) => typeof n === "number" && !isNaN(n) && !(n < 0);
  //title
  if (!titleInput.value) {
    titleInput.focus();
    titleInput.placeholder = "A name is required";
    titleInput.classList.add("invalid-control");
    return false;
  } else {
    titleInput.classList.remove("invalid-control");
    titleInput.placeholder = "Timer Name";
  }
  //hours
  let hours = parseInt(hoursInput.value);
  if (!hoursInput.value || !isValid(hours)) {
    hoursInput.focus();
    hoursInput.classList.add("invalid-control");
    return false;
  } else {
    hoursInput.classList.remove("invalid-control");
  }
  //minutes
  let minutes = parseInt(minutesInput.value);
  if (!minutesInput.value || !isValid(minutes)) {
    minutesInput.focus();
    minutesInput.classList.add("invalid-control");
    return false;
  } else {
    minutesInput.classList.remove("invalid-control");
  }
  //seconds
  let seconds = parseInt(secondsInput.value);
  if (!secondsInput.value || !isValid(seconds)) {
    secondsInput.focus();
    secondsInput.classList.add("invalid-control");
    return false;
  } else {
    secondsInput.classList.remove("invalid-control");
  }

  return true;
}

//repetitive actions
// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

function showTimerForm() {
  btnAdd.style.display = "none";
  txtName.style.display = "block";
  timeContainer.style.display = "block";
  cboColour.style.display = "block";
  cboAudio.style.display = "block";
  txtMessage.style.display = "block";
  btnStart.style.display = "block";
  btnCancel.style.display = "block";
}

function hideTimerForm() {
  txtName.value = "";
  txtHours.value = "00";
  txtMinutes.value = "05";
  txtSeconds.value = "00";
  btnColour.innerHTML = `Colour <i class="nav-arrow"></i>`;
  selectedColour = "white";
  btnAudio.innerHTML = `Alarm Sounds <i class="nav-arrow"></i>`;
  selectedAudio.src = null;
  txtMessage.value = "";
  btnAdd.style.display = "flex";
  txtName.style.display = "none";
  timeContainer.style.display = "none";
  cboColour.style.display = "none";
  cboAudio.style.display = "none";
  txtMessage.style.display = "none";
  btnStart.style.display = "none";
  btnCancel.style.display = "none";
  timerForm.style.backgroundColor = `transparent`;
  if (timerArray.length != 0)
    timerForm.style.minHeight = "50vh";
}

//clear text on focus
txtHours.addEventListener("focus", () => { txtHours.value = ""; });
txtMinutes.addEventListener("focus", () => { txtMinutes.value = ""; });
txtSeconds.addEventListener("focus", () => { txtSeconds.value = ""; });

//checks a timer based on a given start time and returns true if timer should be done, otherwise returns false
function checkTimer(startTime, timerUI) {
  let checkTime = new Date();
  let diff = checkTime - startTime;
  let now = new Date().getTime();
  let end = new Date();
  
  //add time based on when the timer should be done
  end.setHours(
    timerUI.timer.hours + end.getHours(),
    timerUI.timer.minutes + end.getMinutes(),
    timerUI.timer.seconds + end.getSeconds(),
    0
  );

  let time = end.getTime() - now - diff;
  return time <= 0;
}
