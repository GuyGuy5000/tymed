//timer class
//intervalID is used to capture the result from setInterval();
//hours, minutes, and seconds are mutable and change when the timer is ticking
//title and message are used to differentiate each timer
//isPaused is a flag for whether the timer is paused or not
//time array contains the original values passed into the timer to be able to reset hours, minutes, and seconds
class timer {
  constructor(hours, minutes, seconds, title, message) {
    this.intervalID;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.title = title;
    this.message = message;
    this.isPaused = true;
    this.time = [hours, minutes, seconds];
  }

  StartTimer(div) {
    //pass div to TickTimer
    let tick = () => this.TickTimer(div);
    //start 1 second intervals
    this.intervalID = setInterval(tick, 1000);
    this.isPaused = false;
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
    if (diff < 0) {
      clearInterval(this.intervalID);
      alert(this.message);
      this.ResetTimer(div);
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
    this.titleContainer = `<h1 id="${timer.title}title">${timer.title}</h1>`;
    this.timeContainer = `<h2 id="${timer.title}time">${timer.toString()}</h2>`;
    this.pauseButton = `<button id="${timer.title}pause">Start</button>`;
    this.resetButton = `<button id="${timer.title}reset">Reset</button>`;
    this.buttonContainer = `<div id="${timer.title}btn">${this.pauseButton} ${this.resetButton}</div>`;

    this.containerDiv.innerHTML = `${this.titleContainer}
                                    ${this.timeContainer} 
                                    ${this.buttonContainer}`;
    //retrieve HTML elements
    this.titleContainer = document.getElementById(`${timer.title}title`);
    this.timeContainer = document.getElementById(`${timer.title}time`);
    this.pauseButton = document.getElementById(`${timer.title}pause`);
    this.resetButton = document.getElementById(`${timer.title}reset`);
    this.buttonContainer = document.getElementById(`${timer.title}btn`);

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
    });
  }
}


//test code
let timerDiv = document.getElementById("timer");
let timer2Div = document.getElementById("timer2");

let t = new timer(0, 0, 2, "timer 1", "done!");
let tUI = new timerUI(t, timerDiv);

let t2 = new timer(0, 1, 2, "timer 2", "2 done!");
let tUI2 = new timerUI(t2, timer2Div);

tUI2.pauseButton.classList.add("test");
tUI2.resetButton.classList.add("test");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
