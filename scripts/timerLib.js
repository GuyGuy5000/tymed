//timer class
//id is used to create a unique id for html elements. Created with a trimmed title + timestamp;
//intervalID is used to capture the result from setInterval();
//hours, minutes, and seconds are mutable and change when the timer is ticking
//title and message are used to differentiate each timer
//isPaused is a flag for whether the timer is paused or not
//time array contains the original values passed into the timer to be able to reset hours, minutes, and seconds
class timer {
  constructor(hours, minutes, seconds, title, message) {
    this.id = title.replace(/\s/g, "") + Date.now();
    this.intervalID;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.title = title;
    this.message = message;
    this.isPaused = true;
    this.time = [hours, minutes, seconds];
    this.callback = null;
  }

  StartTimer(div) {
    //pass div to TickTimer
    let tick = () => this.TickTimer(div);
    //start 1 second intervals
    this.intervalID = setInterval(tick, 1000);
    this.isPaused = false;
    div.innerHTML = this.toString();
  }

  StopTimer() {
    if (this.intervalID != null || this.isPaused == true) {
      //stop interval function
      clearInterval(this.intervalID);
      //reset variable
      this.intervalID = null;
      this.isPaused = true;
    } else console.log("timer has already stopped");
  }

  TickTimer(div) {
    //arbitrary time so that a constant is used
    let now = new Date(1999, 12, 0, 0, 0, 0);
    let end = new Date(now);
    //add time
    end.setHours(
      this.hours + end.getHours(),
      this.minutes + end.getMinutes(),
      this.seconds - 1 + end.getSeconds(),
      0
    );
    let diff = end.getTime() - now;
    //calculate difference in hours, minutes, and seconds
    this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((diff % (1000 * 60)) / 1000);

    //if difference is less than 0, time is up
    if (diff <= 0) {
      clearInterval(this.intervalID);
      if (this.callback != null) this.callback();
      else {
        this.StopTimer();
        alert(this.title + " is done!");
        this.ResetTimer();
      }
      return;
    }
    //display timer
    div.innerHTML = this.toString();
  }

  ResetTimer(div) {
    this.StopTimer();
    //set hours, minutes, seconds back to original values
    this.hours = this.time[0];
    this.minutes = this.time[1];
    this.seconds = this.time[2];
    div.innerHTML = this.toString();
  }

  AddMinutes(minutes, div) {
    this.minutes += minutes;
    div.innerHTML = this.toString();
  }

  toString() {
    return `${("0" + this.hours).slice(-2)}:${("0" + this.minutes).slice(
      -2
    )}:${("0" + this.seconds).slice(-2)}`;
  }

  addEventListener(eventType, callback) {
    if (eventType !== "done") return;
    if (typeof callback !== "function") return;
    this.callback = callback;
  }
}

//timerUI class
//timer holds the timer object
//delayInterval is the amount of minutes added to the timer when snoozing or adding time
//containerDiv holds the title, timeContainer, and buttonContainer
//titleContainer initiates to an h1 element with the timer title
//timeContainer holds the h2 element with the time remaining
//pauseButton is a button tag with a click event to pause the timer and UI elements
//resetButton is a button tag with a click event to reset the timer and UI elements
//buttonContainer is a div that holds both buttons inside of it
class timerUI {
  constructor(timer, containerDiv, delayInterval, bgColour, audioFile) {
    this.timer = timer;
    this.delayInterval = delayInterval;
    this.containerDiv = containerDiv;
    this.containerDiv.style.position = "relative";
    this.audio = new Audio(audioFile);
    this.audio.loop = true;
    //create HTML
    this.titleContainer = `<h1 id="${timer.id}title">${timer.title}</h1>`;
    this.timeContainer = `<h2 id="${timer.id}time">${timer.toString()}</h2>`;
    this.closeButton = `<button id="${timer.id}close" style="background:none; border:none; position: absolute; top:16px; right:16px;">X</button>`;
    this.addButton = `<button id="${timer.id}add">+${delayInterval}</button>`;
    this.pauseButton = `<button id="${timer.id}pause">Start</button>`;
    this.resetButton = `<button id="${timer.id}reset">Reset</button>`;
    this.snoozeButton = `<button id="${timer.id}snooze" hidden>Snooze</button>`;
    this.dismissButton = `<button id="${timer.id}dismiss" hidden>Dismiss</button>`;
    this.buttonContainer = `<div id="${timer.id}btn">${this.addButton} ${this.pauseButton} ${this.resetButton} ${this.snoozeButton} ${this.dismissButton}</div>`;

    //set html
    this.containerDiv.innerHTML = `${this.closeButton}
                                    ${this.titleContainer}
                                    ${this.timeContainer} 
                                    ${this.buttonContainer}`;
    //retrieve HTML elements
    this.titleContainer = document.getElementById(`${timer.id}title`);
    this.timeContainer = document.getElementById(`${timer.id}time`);
    this.closeButton = document.getElementById(`${timer.id}close`);
    this.addButton = document.getElementById(`${timer.id}add`);
    this.pauseButton = document.getElementById(`${timer.id}pause`);
    this.resetButton = document.getElementById(`${timer.id}reset`);
    this.snoozeButton = document.getElementById(`${timer.id}snooze`);
    this.dismissButton = document.getElementById(`${timer.id}dismiss`);
    this.buttonContainer = document.getElementById(`${timer.id}btn`);

    //set bg colour
    if (bgColour != null)
      this.containerDiv.style.backgroundColor = `var(--${bgColour})`;

    //set event listeners
    this.closeButton.addEventListener("click", () => {
      if (this.audio.src != null) this.audio.pause();
      this.timer.StopTimer();
      this.containerDiv.outerHTML = null;
    });

    this.addButton.addEventListener("click", () => {
      this.timer.AddMinutes(this.delayInterval, this.timeContainer);
    });

    this.pauseButton.addEventListener("click", () => {
      if (timer.isPaused) {
        this.timer.StartTimer(this.timeContainer);
        this.pauseButton.innerHTML = "Pause";
      } else {
        this.timer.StopTimer();
        this.pauseButton.innerHTML = "Start";
      }
    });

    this.resetButton.addEventListener("click", () => {
      this.timer.ResetTimer(this.timeContainer);
      this.pauseButton.innerHTML = "Start";
      this.titleContainer.innerHTML = this.timer.title;
    });

    this.snoozeButton.addEventListener("click", () => {
      this.timer.hours = 0;
      this.timer.minutes = this.delayInterval;
      this.timer.seconds = 0;
      this.timer.StartTimer(this.timeContainer);
      this.addButton.hidden = false;
      this.resetButton.hidden = false;
      this.pauseButton.hidden = false;
      this.snoozeButton.hidden = true;
      this.dismissButton.hidden = true;
      this.pauseButton.innerHTML = "Pause";
      this.titleContainer.innerHTML = this.timer.title;
      if (this.audio.src != null) this.audio.load();
    });

    this.dismissButton.addEventListener("click", () => {
      this.timer.ResetTimer(this.timeContainer);
      this.addButton.hidden = false;
      this.resetButton.hidden = false;
      this.pauseButton.hidden = false;
      this.snoozeButton.hidden = true;
      this.dismissButton.hidden = true;
      this.titleContainer.innerHTML = this.timer.title;
      if (this.audio.src != null) this.audio.load();
    });
  }

  SetSecondaryButtonClass(classString) {
    this.resetButton.classList.remove(...this.resetButton.classList);
    this.resetButton.classList.add(classString);

    this.dismissButton.classList.remove(...this.dismissButton.classList);
    this.dismissButton.classList.add(classString);
  }

  SetPrimaryButtonClass(classString) {
    this.pauseButton.classList.remove(...this.pauseButton.classList);
    this.pauseButton.classList.add(classString);

    this.addButton.classList.remove(...this.addButton.classList);
    this.addButton.classList.add(classString);

    this.snoozeButton.classList.remove(...this.snoozeButton.classList);
    this.snoozeButton.classList.add(classString);
  }

  RenderTimer() {
    this.addButton.innerHTML = "+" + this.delayInterval;
    if (
      this.timer.hours >= 0 ||
      this.timer.minutes >= 0 ||
      this.timer.seconds >= 0
    )
      this.timeContainer.innerHTML = this.timer.toString();
  }

  OnDone() {
    this.pauseButton.innerHTML = "Start";
    this.addButton.hidden = true;
    this.resetButton.hidden = true;
    this.pauseButton.hidden = true;
    this.snoozeButton.hidden = false;
    this.dismissButton.hidden = false;
    if (this.timer.message) this.titleContainer.innerHTML = this.timer.message;
    if (!this.audio.src.endsWith("/null")) this.audio.play();
  }
}

//test code
// let timerDiv = document.getElementById("timer");

// let t = new timer(0, 0, 2, "timer 1", "Do a thing!");
// t.addEventListener("done", () => {
//   tUI.OnDone();
//   alert("1 & done!");
// });
// let tUI = new timerUI(t, timerDiv, 5);
// tUI.SetSecondaryButtonClass("btn-warning");
// /////////////////////////////////////////////////

// let timer2Div = document.getElementById("timer2");

// let t2 = new timer(0, 0, 4, "timer 2", "Do another thing!");
// t2.addEventListener("done 2", () => {
//   tUI2.OnDone();
// });
// let tUI2 = new timerUI(t2, timer2Div, 5);
// tUI2.SetSecondaryButtonClass("btn-warning");

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
