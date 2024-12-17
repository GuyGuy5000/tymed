let timerDiv = document.getElementById("timer");
let timer2Div = document.getElementById("timer2");

class timer {
  constructor(hours, minutes, seconds, title, message) {
    this.intervalID;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.title = title;
    this.message = message;
  }

  StartTimer(div) {
    let tick = () => this.TickTimer(div);
    this.intervalID = setInterval(tick, 1000);
  }

  StopTimer() {
    if (this.intervalID != null) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    } else console.log("timer has already stopped");
  }

  TickTimer(div) {
    let now = new Date().getTime();
    let end = new Date();
    end.setHours(
      this.hours + end.getHours(),
      this.minutes + end.getMinutes(),
      this.seconds + end.getSeconds(),
      0
    );
    let diff = end.getTime() - now;

    this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (diff < 0) {
      clearInterval(this.intervalID);
      alert(this.message);
    }

    div.innerHTML = this.toString();
  }

  toString(){
    return `${("0"+this.hours).slice(-2)}:${("0"+this.minutes).slice(-2)}:${("0"+this.seconds).slice(-2)}`;
  }
}


let t = new timer(0, 12, 20, "timer 1", "done!");

t.StartTimer(timerDiv);

start();
async function start(){
  await sleep(1000);
  let t2 = new timer(1, 3, 2, "timer 1", "done!");


  t2.StartTimer(timer2Div);

  await sleep(4000);
  t2.StopTimer();
  await sleep(4000);
  t2.StartTimer(timer2Div);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
