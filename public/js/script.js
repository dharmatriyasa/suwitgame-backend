// Player Game
const rockPLayer = document.getElementById("player-rock");
const paperPLayer = document.getElementById("player-paper");
const scissorsPLayer = document.getElementById("player-scissors");

const playerArr = [rockPLayer, paperPLayer, scissorsPLayer];

// Com Game
const rockCom = document.getElementById("com-rock");
const paperCom = document.getElementById("com-paper");
const scissorsCom = document.getElementById("com-scissors");

const comArr = [rockCom, paperCom, scissorsCom];

// Result game
const gameResult = document.getElementById("game-result");

// Referesh Game
const refreshGame = document.getElementById("refresh-game");
let isEnd = false;

// GAME LOGIC

function playerChoose(playerChoose, playerArr, comChoose, gameResult) {
  return function chooseByPlayer() {
    // for Player
    for (let i = 0; i < playerArr.length; i++) {
      if (playerArr[i] === playerChoose) {
        playerArr[i].classList.add("bg-active");
      }
      playerArr[i].classList.remove("bg-icon");
      playerArr[i].onclick = "";
    }
    // for Com
    const indexCom = randomGenerator();
    for (let i = 0; i < comChoose.length; i++) {
      if (i === indexCom) {
        comChoose[i].classList.add("bg-active");
      }
      comChoose[i].classList.remove("bg-icon");
    }
    gamePlay(playerChoose, comChoose[indexCom], gameResult);
    refreshGame.firstElementChild.firstElementChild.classList.add("rotate");

    // remove fade-out
    gameResult.classList.remove("fade-out");
    isEnd = true;
  };
}

// Random choose by com
function randomGenerator() {
  const randomNumber = Math.floor(Math.random() * 100);
  const indexCom = randomNumber % 3;
  return indexCom;
}

// Game Play
function gamePlay(player, com, result) {
  if (player.title === com.title) {
    result.firstElementChild.innerHTML = "DRAW";
    result.classList.add("bg-draw");
  } else if (player.title === "rock") {
    if (com.title === "paper") {
      result.firstElementChild.innerHTML = "COM WIN";
    } else if (com.title == "scissors") {
      result.firstElementChild.innerHTML = "PLAYER WIN";
    }
    result.classList.add("bg-win");
  } else if (player.title === "paper") {
    if (com.title === "scissors") {
      result.firstElementChild.innerHTML = "COM WIN";
    } else if (com.title == "rock") {
      result.firstElementChild.innerHTML = "PLAYER WIN";
    }
    result.classList.add("bg-win");
  } else if (player.title === "scissors") {
    if (com.title === "rock") {
      result.firstElementChild.innerHTML = "COM WIN";
    } else if (com.title == "paper") {
      result.firstElementChild.innerHTML = "PLAYER WIN";
    }
    result.classList.add("bg-win");
  }
  result.classList.add("hidden");

  result.firstElementChild.classList.add("text-dark");
  result.firstElementChild.classList.add("fs-m");
  result.firstElementChild.classList.remove("fs-1");
}

rockPLayer.onclick = playerChoose(rockPLayer, playerArr, comArr, gameResult);
paperPLayer.onclick = playerChoose(paperPLayer, playerArr, comArr, gameResult);
scissorsPLayer.onclick = playerChoose(
  scissorsPLayer,
  playerArr,
  comArr,
  gameResult
);

// Refresh Logic

refreshGame.onclick = function () {
  if (isEnd) {
    console.log(isEnd);

    for (let i = 0; i < 3; i++) {
      // remove grey background
      playerArr[i].classList.remove("bg-active");
      comArr[i].classList.remove("bg-active");

      // add hover bg-gray
      playerArr[i].classList.add("bg-icon");

      // add onclick function
      playerArr[i].onclick = playerChoose(
        playerArr[i],
        playerArr,
        comArr,
        gameResult
      );
    }

    isEnd = false;

    // remove game result
    // backgorund
    gameResult.classList.add("fade-out");

    // game result
    setTimeout(function () {
      gameResult.classList.remove("bg-win");
      gameResult.classList.remove("bg-draw");

      gameResult.firstElementChild.classList.remove("text-dark");
      gameResult.firstElementChild.classList.remove("fs-m");
      gameResult.firstElementChild.classList.add("fs-1");
      gameResult.firstElementChild.innerHTML = "VS";

      gameResult.classList.remove("hidden");
    }, 500);

    // Refresh game animation
    refreshGame.firstElementChild.firstElementChild.classList.remove("rotate");
  }
};
