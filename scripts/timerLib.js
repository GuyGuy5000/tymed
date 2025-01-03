//timer class
//id is used to create a unique id for html elements. Created with a trimmed title + timestamp;
//intervalID is used to capture the result from setInterval();
//hours, minutes, and seconds are mutable and change when the timer is ticking
//title is used to differentiate each timer
//isPaused is a flag for whether the timer is paused or not
//time array contains the original values passed into the timer to be able to reset hours, minutes, and seconds
class timer {
  constructor(hours, minutes, seconds, title) {
    this.id = title.replace(/\s/g, "") + Date.now();
    this.intervalID;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.title = title;
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
    let now = new Date().getTime();
    let end = new Date();
    //add time
    end.setHours(
      this.hours + end.getHours(),
      this.minutes + end.getMinutes(),
      this.seconds + end.getSeconds(),
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
      else alert(`${this.title} is up!`);

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
//containerDiv holds the title, timeContainer, and buttonContainer
//titleContainer initiates to an h1 element with the timer title
//timeContainer holds the h2 element with the time remaining
//pauseButton is a button tag with a click event to pause the timer and UI elements
//resetButton is a button tag with a click event to reset the timer and UI elements
//buttonContainer is a div that holds both buttons inside of it
class timerUI {
  constructor(timer, containerDiv) {
    this.timer = timer;
    this.containerDiv = containerDiv;
    //create HTML
    this.titleContainer = `<h1 id="${timer.id}title">${timer.title}</h1>`;
    this.timeContainer = `<h2 id="${timer.id}time">${timer.toString()}</h2>`;
    this.pauseButton = `<button id="${timer.id}pause">Start</button>`;
    this.resetButton = `<button id="${timer.id}reset">Reset</button>`;
    this.snoozeButton = `<button id="${timer.id}snooze" hidden>Snooze</button>`;
    this.dismissButton = `<button id="${timer.id}dismiss" hidden>Dismiss</button>`;
    this.buttonContainer = `<div id="${timer.id}btn">${this.pauseButton} ${this.resetButton} ${this.snoozeButton} ${this.dismissButton}</div>`;
    //set html
    this.containerDiv.innerHTML = `${this.titleContainer}
                                    ${this.timeContainer} 
                                    ${this.buttonContainer}`;
    //retrieve HTML elements
    this.titleContainer = document.getElementById(`${timer.id}title`);
    this.timeContainer = document.getElementById(`${timer.id}time`);
    this.pauseButton = document.getElementById(`${timer.id}pause`);
    this.resetButton = document.getElementById(`${timer.id}reset`);
    this.snoozeButton = document.getElementById(`${timer.id}snooze`);
    this.dismissButton = document.getElementById(`${timer.id}dismiss`);
    this.buttonContainer = document.getElementById(`${timer.id}btn`);

    //set event listeners
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
    });

    this.snoozeButton.addEventListener("click", () => {
      this.timer.hours = 0;
      this.timer.minutes = 5;
      this.timer.seconds = 0;
      this.timer.StartTimer(this.timeContainer);
      this.resetButton.hidden = false;
      this.pauseButton.hidden = false;
      this.snoozeButton.hidden = true;
      this.dismissButton.hidden = true;
      this.pauseButton.innerHTML = "Pause";
    });

    this.dismissButton.addEventListener("click", () => {
      this.timer.ResetTimer(this.timeContainer);
      this.resetButton.hidden = false;
      this.pauseButton.hidden = false;
      this.snoozeButton.hidden = true;
      this.dismissButton.hidden = true;
    });
  }

  OnDone() {
    this.pauseButton.innerHTML = "Start";
    this.resetButton.hidden = true;
    this.pauseButton.hidden = true;
    this.snoozeButton.hidden = false;
    this.dismissButton.hidden = false;
  }
}

//test code
let timerDiv = document.getElementById("timer");

let t = new timer(0, 0, 2, "timer 1");
t.addEventListener("done", () => {
  tUI.OnDone();
});
let tUI = new timerUI(t, timerDiv);

// let timer2Div = document.getElementById("timer2");
// let t2 = new timer(0, 1, 2, "timer 2");
// let tUI2 = new timerUI(t2, timer2Div);

// tUI2.pauseButton.classList.add("test");
// tUI2.resetButton.classList.add("test");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
