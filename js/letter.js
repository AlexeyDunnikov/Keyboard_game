import { getRandomNum } from "./helper.js";

export class Letter {
  constructor(letterCode) {
    this.letterCode = letterCode;
  }

  displayLetter() {
    //creating element
    this.letterEl = document.createElement("div");
    this.letterEl.classList.add("letter");
    this.letterEl.innerHTML = String.fromCharCode(this.letterCode);
    this.letterEl.style.top = 0;

    //append html page
    document.querySelector(".main").append(this.letterEl);

    //set random horizontal position
    const letterWidth = this.letterEl.offsetWidth;
    const bodyWidth = document.body.offsetWidth;

    this.letterEl.style.left = `${getRandomNum(0, bodyWidth - letterWidth)}px`;
  }

  getCoord() {
    return this.letterEl.getBoundingClientRect();
  }

  //Delete letter from field
  delete(isRight) {
    if (isRight) {
      this.letterEl.classList.add("deleted--good");
    } else {
      this.letterEl.classList.add("deleted--bad");
    }
    setTimeout(() => {
      this.letterEl.remove();
    }, 100);
  }
}
