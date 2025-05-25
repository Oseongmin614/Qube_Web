const FACE = {
  TOP: 0,
  FRONT_LEFT: 1,
  FRONT_RIGHT: 2,
  BOTTOM: 3,
  BACK_LEFT: 4,
  BACK_RIGHT: 5,
};

const FACE_COLORS = {
  [FACE.TOP]: "yellow",
  [FACE.FRONT_LEFT]: "red",
  [FACE.FRONT_RIGHT]: "green",
  [FACE.BOTTOM]: "white",
  [FACE.BACK_LEFT]: "orange",
  [FACE.BACK_RIGHT]: "blue",
};

let cube = createSolvedCube();
let gameStartTime = null;
let gameTimer = null;
let isGameActive = false;

function createSolvedCube() {
  const cube = [];
  for (let i = 0; i < 3; i++) {
    cube[i] = [];
    for (let j = 0; j < 3; j++) {
      cube[i][j] = Object.values(FACE_COLORS);
    }
  }
  return cube;
}

function getFaceColors(faceType) {
  const colors = [];
  const faceMap = {
    top: FACE.TOP,
    front: FACE.FRONT_LEFT,
    right: FACE.FRONT_RIGHT,
  };
  const faceIndex = faceMap[faceType];

  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      row.push(cube[i][j][faceIndex]);
    }
    colors.push(row);
  }
  return colors;
}

function rotateFaceColors(faceIndex, clockwise = true) {
  const temp = [];
  for (let i = 0; i < 3; i++) {
    temp[i] = [];
    for (let j = 0; j < 3; j++) {
      temp[i][j] = cube[i][j][faceIndex];
    }
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      cube[i][j][faceIndex] = clockwise ? temp[2 - j][i] : temp[j][2 - i];
    }
  }
}

function rotateAdjacentColors(positions, clockwise = true) {
  const temp = positions.map((pos) => cube[pos.i][pos.j][pos.face]);

  positions.forEach((pos, k) => {
    const newIndex = clockwise ? (k + 1) % 4 : (k - 1 + 4) % 4;
    cube[pos.i][pos.j][pos.face] = temp[newIndex];
  });
}
function rotateR(clockwise = true) {
  rotateFaceColors(FACE.FRONT_RIGHT, clockwise);

  for (let i = 0; i < 3; i++) {
    const temp = cube[i][2][FACE.TOP];

    if (clockwise) {
      cube[i][2][FACE.TOP] = cube[i][2][FACE.FRONT_LEFT];
      cube[i][2][FACE.FRONT_LEFT] = cube[i][2][FACE.BOTTOM];
      cube[i][2][FACE.BOTTOM] = cube[i][2][FACE.BACK_LEFT];
      cube[i][2][FACE.BACK_LEFT] = temp;
    } else {
      cube[i][2][FACE.TOP] = cube[i][2][FACE.BACK_LEFT];
      cube[i][2][FACE.BACK_LEFT] = cube[i][2][FACE.BOTTOM];
      cube[i][2][FACE.BOTTOM] = cube[i][2][FACE.FRONT_LEFT];
      cube[i][2][FACE.FRONT_LEFT] = temp;
    }
  }
}

function rotateL(clockwise = true) {
  rotateFaceColors(FACE.BACK_RIGHT, clockwise);

  for (let i = 0; i < 3; i++) {
    const temp = cube[i][0][FACE.TOP];

    if (clockwise) {
      cube[i][0][FACE.TOP] = cube[i][0][FACE.BACK_LEFT];
      cube[i][0][FACE.BACK_LEFT] = cube[i][0][FACE.BOTTOM];
      cube[i][0][FACE.BOTTOM] = cube[i][0][FACE.FRONT_LEFT];
      cube[i][0][FACE.FRONT_LEFT] = temp;
    } else {
      cube[i][0][FACE.TOP] = cube[i][0][FACE.FRONT_LEFT];
      cube[i][0][FACE.FRONT_LEFT] = cube[i][0][FACE.BOTTOM];
      cube[i][0][FACE.BOTTOM] = cube[i][0][FACE.BACK_LEFT];
      cube[i][0][FACE.BACK_LEFT] = temp;
    }
  }
}

function rotateU(clockwise = true) {
  rotateFaceColors(FACE.TOP, clockwise);

  for (let j = 0; j < 3; j++) {
    const temp = cube[0][j][FACE.FRONT_LEFT];

    if (clockwise) {
      cube[0][j][FACE.FRONT_LEFT] = cube[0][j][FACE.BACK_RIGHT];
      cube[0][j][FACE.BACK_RIGHT] = cube[0][j][FACE.BACK_LEFT];
      cube[0][j][FACE.BACK_LEFT] = cube[0][j][FACE.FRONT_RIGHT];
      cube[0][j][FACE.FRONT_RIGHT] = temp;
    } else {
      cube[0][j][FACE.FRONT_LEFT] = cube[0][j][FACE.FRONT_RIGHT];
      cube[0][j][FACE.FRONT_RIGHT] = cube[0][j][FACE.BACK_LEFT];
      cube[0][j][FACE.BACK_LEFT] = cube[0][j][FACE.BACK_RIGHT];
      cube[0][j][FACE.BACK_RIGHT] = temp;
    }
  }
}

function rotateD(clockwise = true) {
  rotateFaceColors(FACE.BOTTOM, clockwise);

  for (let j = 0; j < 3; j++) {
    const temp = cube[2][j][FACE.FRONT_LEFT];

    if (clockwise) {
      cube[2][j][FACE.FRONT_LEFT] = cube[2][j][FACE.FRONT_RIGHT];
      cube[2][j][FACE.FRONT_RIGHT] = cube[2][j][FACE.BACK_LEFT];
      cube[2][j][FACE.BACK_LEFT] = cube[2][j][FACE.BACK_RIGHT];
      cube[2][j][FACE.BACK_RIGHT] = temp;
    } else {
      cube[2][j][FACE.FRONT_LEFT] = cube[2][j][FACE.BACK_RIGHT];
      cube[2][j][FACE.BACK_RIGHT] = cube[2][j][FACE.BACK_LEFT];
      cube[2][j][FACE.BACK_LEFT] = cube[2][j][FACE.FRONT_RIGHT];
      cube[2][j][FACE.FRONT_RIGHT] = temp;
    }
  }
}

function rotateF(clockwise = true) {
  rotateFaceColors(FACE.FRONT_LEFT, clockwise);

  for (let k = 0; k < 3; k++) {
    const temp = cube[2][k][FACE.TOP];

    if (clockwise) {
      cube[2][k][FACE.TOP] = cube[2 - k][2][FACE.BACK_RIGHT];
      cube[2 - k][2][FACE.BACK_RIGHT] = cube[0][2 - k][FACE.BOTTOM];
      cube[0][2 - k][FACE.BOTTOM] = cube[k][0][FACE.FRONT_RIGHT];
      cube[k][0][FACE.FRONT_RIGHT] = temp;
    } else {
      cube[2][k][FACE.TOP] = cube[k][0][FACE.FRONT_RIGHT];
      cube[k][0][FACE.FRONT_RIGHT] = cube[0][2 - k][FACE.BOTTOM];
      cube[0][2 - k][FACE.BOTTOM] = cube[2 - k][2][FACE.BACK_RIGHT];
      cube[2 - k][2][FACE.BACK_RIGHT] = temp;
    }
  }
}

function rotateB(clockwise = true) {
  rotateFaceColors(FACE.BACK_LEFT, clockwise);

  for (let k = 0; k < 3; k++) {
    const temp = cube[0][k][FACE.TOP];

    if (clockwise) {
      cube[0][k][FACE.TOP] = cube[k][2][FACE.FRONT_RIGHT];
      cube[k][2][FACE.FRONT_RIGHT] = cube[2][2 - k][FACE.BOTTOM];
      cube[2][2 - k][FACE.BOTTOM] = cube[2 - k][0][FACE.BACK_RIGHT];
      cube[2 - k][0][FACE.BACK_RIGHT] = temp;
    } else {
      cube[0][k][FACE.TOP] = cube[2 - k][0][FACE.BACK_RIGHT];
      cube[2 - k][0][FACE.BACK_RIGHT] = cube[2][2 - k][FACE.BOTTOM];
      cube[2][2 - k][FACE.BOTTOM] = cube[k][2][FACE.FRONT_RIGHT];
      cube[k][2][FACE.FRONT_RIGHT] = temp;
    }
  }
}

function rotateCubeX(clockwise = true) {
  for (let j = 0; j < 3; j++) {
    const temp = [
      cube[0][j][FACE.TOP],
      cube[1][j][FACE.TOP],
      cube[2][j][FACE.TOP],
    ];

    for (let i = 0; i < 3; i++) {
      if (clockwise) {
        cube[i][j][FACE.TOP] = cube[i][j][FACE.BACK_LEFT];
        cube[i][j][FACE.BACK_LEFT] = cube[i][j][FACE.BOTTOM];
        cube[i][j][FACE.BOTTOM] = cube[i][j][FACE.FRONT_LEFT];
        cube[i][j][FACE.FRONT_LEFT] = temp[i];
      } else {
        cube[i][j][FACE.TOP] = cube[i][j][FACE.FRONT_LEFT];
        cube[i][j][FACE.FRONT_LEFT] = cube[i][j][FACE.BOTTOM];
        cube[i][j][FACE.BOTTOM] = cube[i][j][FACE.BACK_LEFT];
        cube[i][j][FACE.BACK_LEFT] = temp[i];
      }
    }
  }
  rotateFaceColors(FACE.FRONT_RIGHT, !clockwise);
  rotateFaceColors(FACE.BACK_RIGHT, clockwise);
}

function rotateCubeY(clockwise = true) {
  for (let i = 0; i < 3; i++) {
    const temp = [
      cube[i][0][FACE.FRONT_LEFT],
      cube[i][1][FACE.FRONT_LEFT],
      cube[i][2][FACE.FRONT_LEFT],
    ];

    for (let j = 0; j < 3; j++) {
      if (clockwise) {
        cube[i][j][FACE.FRONT_LEFT] = cube[i][j][FACE.BACK_RIGHT];
        cube[i][j][FACE.BACK_RIGHT] = cube[i][j][FACE.BACK_LEFT];
        cube[i][j][FACE.BACK_LEFT] = cube[i][j][FACE.FRONT_RIGHT];
        cube[i][j][FACE.FRONT_RIGHT] = temp[j];
      } else {
        cube[i][j][FACE.FRONT_LEFT] = cube[i][j][FACE.FRONT_RIGHT];
        cube[i][j][FACE.FRONT_RIGHT] = cube[i][j][FACE.BACK_LEFT];
        cube[i][j][FACE.BACK_LEFT] = cube[i][j][FACE.BACK_RIGHT];
        cube[i][j][FACE.BACK_RIGHT] = temp[j];
      }
    }
  }
  rotateFaceColors(FACE.TOP, clockwise);
  rotateFaceColors(FACE.BOTTOM, !clockwise);
}

function rotateCubeZ(clockwise = true) {
  for (let i = 0; i < 3; i++) {
    const temp = [
      cube[0][i][FACE.TOP],
      cube[1][i][FACE.TOP],
      cube[2][i][FACE.TOP],
    ];

    for (let j = 0; j < 3; j++) {
      if (clockwise) {
        cube[j][i][FACE.TOP] = cube[i][j][FACE.FRONT_RIGHT];
        cube[i][j][FACE.FRONT_RIGHT] = cube[j][i][FACE.BOTTOM];
        cube[j][i][FACE.BOTTOM] = cube[j][i][FACE.BACK_RIGHT];
        cube[j][i][FACE.BACK_RIGHT] = temp[i];
      } else {
        cube[j][i][FACE.TOP] = cube[i][j][FACE.BACK_RIGHT];
        cube[i][j][FACE.BACK_RIGHT] = cube[j][i][FACE.BOTTOM];
        cube[j][i][FACE.BOTTOM] = cube[j][i][FACE.FRONT_RIGHT];
        cube[j][i][FACE.FRONT_RIGHT] = temp[i];
      }
    }
  }
  rotateFaceColors(FACE.BACK_LEFT, !clockwise);
  rotateFaceColors(FACE.FRONT_LEFT, !clockwise);
}

function rotateCubeS(clockwise = true) {
  startGame();
  return;
}
function scrambleCube(moves = 20) {
  const rotations = [
    { func: rotateR, name: "R" },
    { func: rotateL, name: "L" },
    { func: rotateU, name: "U" },
    { func: rotateD, name: "D" },
    { func: rotateF, name: "F" },
    { func: rotateB, name: "B" },
  ];

  let scrambleSequence = [];
  for (let i = 0; i < moves; i++) {
    const randomMove = rotations[Math.floor(Math.random() * rotations.length)];
    const clockwise = Math.random() > 0.5;
    randomMove.func(clockwise);
    scrambleSequence.push(randomMove.name + (clockwise ? "" : "'"));
  }

  console.log("Scramble sequence:", scrambleSequence.join(" "));
  return scrambleSequence;
}

function startTimer() {
  gameStartTime = Date.now();
  isGameActive = true;
  gameTimer = setInterval(updateTimer, 100);
  document.getElementById("status").textContent = "게임 진행 중...";
  document.querySelector(".timer-display").classList.remove("completed");
}

function stopTimer() {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
  isGameActive = false;
}

function updateTimer() {
  if (!gameStartTime) return;
  const elapsed = Date.now() - gameStartTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  document.getElementById("timer").textContent = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function isCubeSolved() {
  const faces = ["top", "front", "right"];
  for (const face of faces) {
    const colors = getFaceColors(face);
    const firstColor = colors[0][0];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (colors[i][j] !== firstColor) return false;
      }
    }
  }
  return true;
}

function handleGameCompletion() {
  const elapsed = Date.now() - gameStartTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  stopTimer();
  document.querySelector(".timer-display").classList.add("completed");
  document.getElementById("status").textContent = `축하합니다! ${
    minutes > 0 ? minutes + "분 " : ""
  }${seconds}초 걸렸습니다!`;

  setTimeout(() => {
    alert(
      `큐브 완성! ${minutes > 0 ? minutes + "분 " : ""}${seconds}초 걸렸습니다!`
    );
  }, 500);
}

function startGame() {
  console.log("Starting new game...");
  stopTimer();
  reset();
  document.getElementById("timer").textContent = "00:00";
  document.getElementById("status").textContent = "큐브를 섞는 중...";

  setTimeout(() => {
    scrambleCube(20);
    startTimer();
    renderCube();
  }, 500);
}

function reset() {
  console.log("Resetting cube");
  stopTimer();
  cube = createSolvedCube();
  document.getElementById("timer").textContent = "00:00";
  document.getElementById("status").textContent = "게임을 시작하세요!";
  document.querySelector(".timer-display").classList.remove("completed");
  renderCube();
}

function renderFace(faceElement, colors) {
  faceElement.innerHTML = "";
  colors.forEach((row) => {
    row.forEach((color) => {
      const square = document.createElement("div");
      square.className = `square ${color}`;
      faceElement.appendChild(square);
    });
  });
}

function renderCube() {
  const elements = {
    "top-face": "top",
    "front-face": "front",
    "right-face": "right",
  };

  Object.entries(elements).forEach(([elementId, faceType]) => {
    const element = document.getElementById(elementId);
    if (element) {
      renderFace(element, getFaceColors(faceType));
    }
  });

  if (isGameActive && isCubeSolved()) {
    handleGameCompletion();
  }
}

// 키보드 이벤트 리스너 (S키 추가)
document.addEventListener("keydown", (e) => {
  const isShift = e.shiftKey;

  if (e.code === "KeyS") {
    startGame();
    return;
  }

  const rotationMap = {
    KeyR: () => rotateR(!isShift),
    KeyL: () => rotateL(!isShift),
    KeyU: () => rotateU(!isShift),
    KeyD: () => rotateD(!isShift),
    KeyF: () => rotateF(!isShift),
    KeyB: () => rotateB(!isShift),
    KeyX: () => rotateCubeX(!isShift),
    KeyY: () => rotateCubeY(!isShift),
    Keyc: () => rotateCubeY(!isShift),
    KeyZ: () => rotateCubeZ(!isShift),
    KeyS: () => rotateCubeS(!isShift),
  };

  if (rotationMap[e.code]) {
    rotationMap[e.code]();
    renderCube();
  } else if (e.code === "Space") {
    e.preventDefault();
    reset();
  }
});

// DOM 로드 완료 후 초기화
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing cube");

  const startButton = document.getElementById("start-game-btn");
  if (startButton) {
    startButton.addEventListener("click", startGame);
  }

  const resetButton = document.getElementById("reset-btn");
  if (resetButton) {
    resetButton.addEventListener("click", reset);
  }

  renderCube();
});
