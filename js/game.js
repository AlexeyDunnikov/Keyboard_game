import { Letter } from "./letter.js";
import { getRandomNum } from "./helper.js";
import { game_options } from "./options.js";

export class Game {
  constructor() {
    this.initialization();

    this.letters = {};
    this.setDefault();
  }

  //Clear board
  setDefault() {
    this.spawnTime = 1000;
    this.mistakes = 0;
    this.correctly = 0;

    this.removeAllLetters();
    this.updateMistakes();
    this.updateCorrectly();
  }

  //Find base elements
  initialization() {
    this.mistakesEl = document.querySelector(".user-info__mistakes");
    this.correctlyEl = document.querySelector(".user-info__correctly");
    this.totalAsideEl = document.querySelector(".popup-total");
    this.deadZone = document.querySelector(".deadzone");
  }

  //Rewrite mistakes
  updateMistakes() {
    this.mistakesEl.innerHTML = this.mistakes;
  }

  //Rewrite correct points
  updateCorrectly() {
    this.correctlyEl.innerHTML = this.correctly;
  }

  start() {
    this.stopWindowKeyboard = false;
    this.isStopRender = false;

    const spawnBinded = this.spawn.bind(this);
    const decreaseTimeBinded = this.decreaseTime.bind(this);
    const checkStopRenderBinded = this.checkRender.bind(this);
    let time = this.spawnTime;

    this.renderTimer = setTimeout(function spawn() {
      if (checkStopRenderBinded()) return;
      spawnBinded();

      time = decreaseTimeBinded(time);
      console.log(time);

      setTimeout(spawn, time);
    }, time);

    this.clearDeadzoneTimer = setInterval(() => {
      this.clearDeadZone.call(this);
    }, 200);
  }

  checkRender() {
    return this.isStopRender;
  }

  //restart game
  restart() {
    setTimeout(() => {
      this.start();
    }, 1000);
  }

  //Enter right letter
  win(code) {
    this.correctly += 1;
    this.updateCorrectly();

    this.letters[code].shift().delete(true);

    if (this.letters[code].length === 0) {
      this.deleteProp(code);
    }
  }

  //Miss letter
  miss() {
    this.mistakes += 1;
    this.updateMistakes();
    this.deadZone.classList.add("incorrect");

    setTimeout(() => {
      this.deadZone.classList.remove("incorrect");
    }, 100);

    if (this.mistakes === game_options.MAX_MISTAKES) {
      this.lose();
    }
  }

  //lose game
  lose() {
    this.totalAsideEl.classList.add("show");
    this.totalAsideEl.querySelector(".popup-total__result-text").innerHTML =
      this.correctly;

    this.setDefault();
    this.isStopRender = true;
    clearInterval(this.clearDeadzoneTimer);

    this.stopWindowKeyboard = true;
  }

  //remove all letters
  removeAllLetters() {
    for (let lettersArr of Object.values(this.letters)) {
      lettersArr.forEach((letter) => {
        letter.delete(false);
      });
    }
    this.letters = {};
  }

  windowKeyDown(code) {
    if (this.stopWindowKeyboard) return;

    //If letter on board exists
    if (this.letters[code]) {
      this.win(code);
    }
    //Miss letter
    else {
      this.miss();
    }
  }
  
  //spawn letters
  spawn() {
    const rndCode = getRandomNum(65, 90);
    const letter = new Letter(rndCode);

    letter.displayLetter();

    if (this.letters[rndCode]) {
      this.letters[rndCode].push(letter);
    } else {
      this.letters[rndCode] = [];

      this.letters[rndCode].push(letter);
    }
    console.log(this.letters);
  }

  //delete letters on deadzone
  clearDeadZone() {
    console.log("clear");
    const deadZoneCoord = this.deadZone.getBoundingClientRect();

    for (let [key, lettersArr] of Object.entries(this.letters)) {
      lettersArr.forEach((letter, index, array) => {
        const letterCoord = letter.getCoord();

        //letter on deadzone
        if (letterCoord.bottom > deadZoneCoord.top) {
          if (array.length === 1) {
            this.deleteProp(key);
          } else {
            array.splice(index, 1);
          }
          this.miss();
          letter.delete(false);
        }
      });
    }
  }

  //delete property from state
  deleteProp(key) {
    delete this.letters[key];
  }

  //speed up spawn time
  decreaseTime(time) {
    if (time >= 800) {
      return time - 10;
    } else if (time >= 500) {
      return time - 5;
    } else if (time >= 200) {
      return time - 2;
    }
  }
}
