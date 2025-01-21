//new timer form
let btnAdd = document.getElementById("btnAddTimer");
let txtName = document.getElementById("txtName");
let timeContainer = document.getElementById("timeContainer");
let txtHours = document.getElementById("txtHours");
let txtMinutes = document.getElementById("txtMinutes");
let txtSeconds = document.getElementById("txtSeconds");
let txtMessage = document.getElementById("txtMessage");
let btnStart = document.getElementById("btnStart");

//timer array
let timerArray = [];
let timersContainer = document.getElementById("timerArrayContainer");

btnAdd.addEventListener("click", () => {
  btnAdd.style.display = "none";
  txtName.style.display = "block";
  timeContainer.style.display = "block";
  txtMessage.style.display = "block";
  btnStart.style.display = "block";
});

btnStart.addEventListener("click", () => {
  //validation
  const isValid = (n) => typeof n === "number" && !isNaN(n) && !(n < 0);

  //title
  if (!txtName.value) {
    txtName.focus();
    txtName.placeholder = "A name is required";
    txtName.classList.add("invalid-control");
    return;
  } else {
    txtName.classList.remove("invalid-control");
    txtName.placeholder = "Timer Name";
  }

  //hours
  let hours = parseInt(txtHours.value);
  if (!txtHours.value || !isValid(hours)) {
    txtHours.focus();
    txtHours.classList.add("invalid-control");
    return;
  } else {
    txtHours.classList.remove("invalid-control");
  }

  //minutes
  let minutes = parseInt(txtMinutes.value);
  if (!txtMinutes.value || !isValid(minutes)) {
    txtMinutes.focus();
    txtMinutes.classList.add("invalid-control");
    return;
  } else {
    txtMinutes.classList.remove("invalid-control");
  }

  //seconds
  let seconds = parseInt(txtSeconds.value);
  if (!txtSeconds.value || !isValid(seconds)) {
    txtSeconds.focus();
    txtSeconds.classList.add("invalid-control");
    return;
  } else {
    txtSeconds.classList.remove("invalid-control");
  }

  //create timer
  t = new timer(hours, minutes, seconds, txtName.value, txtMessage.value + " ");
  //create container div
  let innerDiv = document.createElement("div");
  innerDiv.classList.add("flex-container");
  innerDiv.classList.add("timer-container");
  innerDiv.id = `${t.id}${timerArray.length}`;
  timersContainer.appendChild(innerDiv);
  //create UI
  tUI = new timerUI(t, innerDiv, 5, null);
  //add timer to list
  timerArray.push(tUI);
});
