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

//timer array
var timerArray = [];
var timersContainer = document.getElementById("timerArrayContainer");

//set sampleTime to an int to play audio for a timed duration
var sampleTime = 0;
setInterval(() => {
  sampleTime -= 1;
  if (sampleTime <= 0) selectedAudio.pause();
}, 1000);

btnAdd.addEventListener("click", () => {
  btnAdd.style.display = "none";
  txtName.style.display = "block";
  timeContainer.style.display = "block";
  cboColour.style.display = "block";
  cboAudio.style.display = "block";
  txtMessage.style.display = "block";
  btnStart.style.display = "block";
});

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
    selectedAudio.src != "" && selectedAudio.src != "noSound"
      ? selectedAudio.src
      : null
  );
  tUI.SetSecondaryButtonClass("btn-warning");
  t.addEventListener("done", () => {
    tUI.OnDone();
  });

  if (isListView) {
    innerDiv.style.minWidth = "100%";
    innerDiv.style.minHeight = "auto";
    innerDiv.style.flexDirection = "row";
    innerDiv.style.gap = "48px";
  }

  //add timer to list
  timerArray.push(tUI);

  txtName.value = "";
  txtHours.value = "00";
  txtMinutes.value = "05";
  txtSeconds.value = "00";
  btnColour.innerHTML = `Colour <i class="nav-arrow"></i>`;
  selectedColour = "white";
  btnAudio.innerHTML = `Alarm Sounds <i class="nav-arrow"></i>`;
  selectedAudio.src = null;
  txtMessage.value = "";
  timerForm.style.minHeight = "50vh";

  btnAdd.style.display = "flex";
  txtName.style.display = "none";
  timeContainer.style.display = "none";
  cboColour.style.display = "none";
  cboAudio.style.display = "none";
  txtMessage.style.display = "none";
  btnStart.style.display = "none";
  timerForm.style.backgroundColor = `transparent`;
});

//select colour event
colourOptions.forEach((colourNode) => {
  colourNode.addEventListener("click", () => {
    selectedColour = colourNode.value.toLowerCase();
    btnColour.innerHTML = `${selectedColour} <i class="nav-arrow"></i>`;
    timerForm.style.backgroundColor = `var(--${selectedColour})`;
  });
});

//select audio event
audioOptions.forEach((audioNode) => {
  audioNode.addEventListener("click", async () => {
    if (audioNode.dataset.audio == "noSound") {
      btnAudio.innerHTML = `No Sound <i class="nav-arrow"></i>`;
      selectedAudio.src = null;
    } else {
      selectedAudio.src = "audio/" + audioNode.dataset.audio.toLowerCase();
      btnAudio.innerHTML = `${audioNode.value} <i class="nav-arrow"></i>`;
      selectedAudio.play();
      sampleTime = 4;
    }
  });
});

//validates user input or highlights controls with wrong input
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
