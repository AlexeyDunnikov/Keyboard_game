import { Letter } from "./letter.js";
import { Game } from "./game.js";

let game;

const startBtn = document.querySelector(".start-btn");
const againBtn = document.querySelector(".popup-total__btn");
const popupTotal = document.querySelector(".popup-total");

startBtn.addEventListener("click", (evt) => {
  game = new Game();
  game.start();

  setTimeout(() => {
    let audio = new Audio();
    audio.src = "./music/music-1.mp3";
    audio.autoplay = true;
    audio.loop = true;
  }, 500);

  evt.target.classList.add("hide");
});

againBtn.addEventListener("click", (evt) => {
  popupTotal.classList.remove("show");
  game.restart();
});

window.addEventListener("keydown", (evt) => {
  game.windowKeyDown(evt.keyCode);
});
