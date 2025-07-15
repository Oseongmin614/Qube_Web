const FACE = {
    TOP: 0,
    FRONT: 1,
    RIGHT: 2,
    BOTTOM: 3,
    BACK: 4,
   	RIGHT: 5,
};

const FACE_COLORS = {
    [FACE.TOP]: "yellow",
    [FACE.FRONT]: "red",
    [FACE.RIGHT]: "green",
    [FACE.BOTTOM]: "white",
    [FACE.BACK]: "orange",
    [FACE.LEFT]: "blue",
};


const STORAGE_KEY = 'cubeRecords';
const MAX_RECORDS = 10;
let totalSeconds = 0;
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

// 로컬스토리지에서 기록들을 불러오는 함수
function getStoredRecords() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        const records = data ? JSON.parse(data) : [];
        return Array.isArray(records) ? records : [];
    } catch (e) {
        console.error('Storage parsing error:', e);
        localStorage.removeItem(STORAGE_KEY);
        return [];
    }
}

function saveRecord(seconds, playerName = '익명') {
    const records = getStoredRecords();
    records.push({ time: seconds, name: playerName, date: new Date().toLocaleDateString() });
    records.sort((a, b) => a.time - b.time);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECORDS)));
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`;
}

function renderRanking() {
    const records = getStoredRecords();
    const container = document.getElementById('ranking-list');
    container.innerHTML = '';

    if (records.length === 0) {
        container.innerHTML = '<div class="no-records">기록이 없습니다.</div>';
        return;
    }

    records.forEach((record, idx) => {
        const item = document.createElement('div');
        item.className = `ranking-item ${idx < 3 ? 'top-' + (idx + 1) : ''}`;

        item.innerHTML = `
            <span class="ranking-rank">${idx + 1}위</span>
            <span class="ranking-name">${record.name}</span>
            <span class="ranking-time">${formatTime(record.time)}</span>
        `;

        container.appendChild(item);
    });
}

function clearAllRecords() {
    if (confirm('모든 기록을 삭제하시겠습니까?')) {
        localStorage.removeItem(STORAGE_KEY);
        renderRanking();
        alert('모든 기록이 삭제되었습니다.');
    }
}

function getFaceColors(faceType) {
    const colors = [];
    const faceMap = {
        top: FACE.TOP,
        front: FACE.FRONT,
        right: FACE.RIGHT,
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

//화전시 옆면을 같이 돌리는 함수
function rotateFaceColors(faceIndex, clockwise = true) {
    const temp = [];
    // 면의 9개 셀을 임시 배열에 저장
    for (let i = 0; i < 3; i++) {
        temp[i] = [];
        for (let j = 0; j < 3; j++) {
            temp[i][j] = cube[i][j][faceIndex];
        }
    }

    // 시계방향 또는 반시계방향으로 회전
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (clockwise) {
                cube[i][j][faceIndex] = temp[2-j][i];
            } else {
                cube[i][j][faceIndex] = temp[j][2-i];
            }
        }
    }
}

// 회전 함수들 (기존 코드 유지)
function rotateR(clockwise = true) {
    rotateFaceColors(FACE.RIGHT, clockwise);
    for (let i = 0; i < 3; i++) {
        const temp = cube[i][2][FACE.TOP];
        if (clockwise) {
            cube[i][2][FACE.TOP] = cube[i][2][FACE.FRONT];
            cube[i][2][FACE.FRONT] = cube[i][2][FACE.BOTTOM];
            cube[i][2][FACE.BOTTOM] = cube[i][2][FACE.BACK];
            cube[i][2][FACE.BACK] = temp;
        } else {
            cube[i][2][FACE.TOP] = cube[i][2][FACE.BACK];
            cube[i][2][FACE.BACK] = cube[i][2][FACE.BOTTOM];
            cube[i][2][FACE.BOTTOM] = cube[i][2][FACE.FRONT];
            cube[i][2][FACE.FRONT] = temp;
        }
    }
}

function rotateL(clockwise = true) {
    rotateFaceColors(FACE.LEFT, clockwise);
    for (let i = 0; i < 3; i++) {
        const temp = cube[i][0][FACE.TOP];
        if (clockwise) {
            cube[i][0][FACE.TOP] = cube[i][0][FACE.BACK];
            cube[i][0][FACE.BACK] = cube[i][0][FACE.BOTTOM];
            cube[i][0][FACE.BOTTOM] = cube[i][0][FACE.FRONT];
            cube[i][0][FACE.FRONT] = temp;
        } else {
            cube[i][0][FACE.TOP] = cube[i][0][FACE.FRONT];
            cube[i][0][FACE.FRONT] = cube[i][0][FACE.BOTTOM];
            cube[i][0][FACE.BOTTOM] = cube[i][0][FACE.BACK];
            cube[i][0][FACE.BACK] = temp;
        }
    }
}

function rotateU(clockwise = true) {
    rotateFaceColors(FACE.TOP, clockwise);
    for (let j = 0; j < 3; j++) {
        const temp = cube[0][j][FACE.FRONT];
        if (clockwise) {
            cube[0][j][FACE.FRONT] = cube[0][j][FACE.RIGHT];
            cube[0][j][FACE.RIGHT] = cube[0][j][FACE.BACK];
            cube[0][j][FACE.BACK] = cube[0][j][FACE.LEFT];
            cube[0][j][FACE.LEFT] = temp;
        } else {
            cube[0][j][FACE.FRONT] = cube[0][j][FACE.LEFT];
            cube[0][j][FACE.LEFT] = cube[0][j][FACE.BACK];
            cube[0][j][FACE.BACK] = cube[0][j][FACE.RIGHT];
            cube[0][j][FACE.RIGHT] = temp;
        }
    }
}


function rotateD(clockwise = true) {
    rotateFaceColors(FACE.BOTTOM, clockwise);
    for (let j = 0; j < 3; j++) {
        const temp = cube[2][j][FACE.FRONT];
        if (clockwise) {
            cube[2][j][FACE.FRONT] = cube[2][j][FACE.LEFT];
            cube[2][j][FACE.LEFT] = cube[2][j][FACE.BACK];
            cube[2][j][FACE.BACK] = cube[2][j][FACE.RIGHT];
            cube[2][j][FACE.RIGHT] = temp;
        } else {
            cube[2][j][FACE.FRONT] = cube[2][j][FACE.RIGHT];
            cube[2][j][FACE.RIGHT] = cube[2][j][FACE.BACK];
            cube[2][j][FACE.BACK] = cube[2][j][FACE.LEFT];
            cube[2][j][FACE.LEFT] = temp;
        }
    }
}

function rotateF(clockwise = true) {
    rotateFaceColors(FACE.FRONT, clockwise);
    for (let k = 0; k < 3; k++) {
        const temp = cube[2][k][FACE.TOP];
        if (clockwise) {
            cube[2][k][FACE.TOP] = cube[2 - k][2][FACE.LEFT];
            cube[2 - k][2][FACE.LEFT] = cube[0][2 - k][FACE.BOTTOM];
            cube[0][2 - k][FACE.BOTTOM] = cube[k][0][FACE.RIGHT];
            cube[k][0][FACE.RIGHT] = temp;
        } else {
            cube[2][k][FACE.TOP] = cube[k][0][FACE.RIGHT];
            cube[k][0][FACE.RIGHT] = cube[0][2 - k][FACE.BOTTOM];
            cube[0][2 - k][FACE.BOTTOM] = cube[2 - k][2][FACE.LEFT];
            cube[2 - k][2][FACE.LEFT] = temp;
        }
    }
}

function rotateB(clockwise = true) {
    rotateFaceColors(FACE.BACK, clockwise);
    for (let k = 0; k < 3; k++) {
        const temp = cube[0][k][FACE.TOP];
        if (clockwise) {
            cube[0][k][FACE.TOP] = cube[k][2][FACE.RIGHT];
            cube[k][2][FACE.RIGHT] = cube[2][2 - k][FACE.BOTTOM];
            cube[2][2 - k][FACE.BOTTOM] = cube[2 - k][0][FACE.LEFT];
            cube[2 - k][0][FACE.LEFT] = temp;
        } else {
            cube[0][k][FACE.TOP] = cube[2 - k][0][FACE.LEFT];
            cube[2 - k][0][FACE.LEFT] = cube[2][2 - k][FACE.BOTTOM];
            cube[2][2 - k][FACE.BOTTOM] = cube[k][2][FACE.RIGHT];
            cube[k][2][FACE.RIGHT] = temp;
        }
    }
}

// 큐브 회전 함수들 (기존 코드 유지)
function rotateCubeX(clockwise = true) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const temp = cube[i][j][FACE.TOP];
            if (clockwise) {
                cube[i][j][FACE.TOP] = cube[i][j][FACE.FRONT];
                cube[i][j][FACE.FRONT] = cube[i][j][FACE.BOTTOM];
                cube[i][j][FACE.BOTTOM] = cube[i][j][FACE.BACK];
                cube[i][j][FACE.BACK] = temp;
            } else {
                cube[i][j][FACE.TOP] = cube[i][j][FACE.BACK];
                cube[i][j][FACE.BACK] = cube[i][j][FACE.BOTTOM];
                cube[i][j][FACE.BOTTOM] = cube[i][j][FACE.FRONT];
                cube[i][j][FACE.FRONT] = temp;
            }
        }
    }
    rotateFaceColors(FACE.RIGHT, clockwise);
    rotateFaceColors(FACE.LEFT, !clockwise);
}

function rotateCubeY(clockwise = true) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const temp = cube[i][j][FACE.FRONT];
            if (clockwise) {
                cube[i][j][FACE.FRONT] = cube[i][j][FACE.RIGHT];
                cube[i][j][FACE.RIGHT] = cube[i][j][FACE.BACK];
                cube[i][j][FACE.BACK] = cube[i][j][FACE.LEFT];
                cube[i][j][FACE.LEFT] = temp;
            } else {
                cube[i][j][FACE.FRONT] = cube[i][j][FACE.LEFT];
                cube[i][j][FACE.LEFT] = cube[i][j][FACE.BACK];
                cube[i][j][FACE.BACK] = cube[i][j][FACE.RIGHT];
                cube[i][j][FACE.RIGHT] = temp;
            }
        }
    }
    rotateFaceColors(FACE.TOP, clockwise);
    rotateFaceColors(FACE.BOTTOM, !clockwise);
}

function rotateCubeZ(clockwise = true) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const temp = cube[i][j][FACE.TOP];
            if (clockwise) {
                cube[i][j][FACE.TOP] = cube[j][2-i][FACE.LEFT];
                cube[j][2-i][FACE.LEFT] = cube[2-i][2-j][FACE.BOTTOM];
                cube[2-i][2-j][FACE.BOTTOM] = cube[2-j][i][FACE.RIGHT];
                cube[2-j][i][FACE.RIGHT] = temp;
            } else {
                cube[i][j][FACE.TOP] = cube[2-j][i][FACE.RIGHT];
                cube[2-j][i][FACE.RIGHT] = cube[2-i][2-j][FACE.BOTTOM];
                cube[2-i][2-j][FACE.BOTTOM] = cube[j][2-i][FACE.LEFT];
                cube[j][2-i][FACE.LEFT] = temp;
            }
        }
    }
    rotateFaceColors(FACE.FRONT, clockwise);
    rotateFaceColors(FACE.BACK, !clockwise);
}

//큐브 섞는 함수
function scrambleCube(moves = 2) {
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
    document.getElementById("timer").textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
//완성시 메소드
function handleGameCompletion() {
    const elapsed = Date.now() - gameStartTime;
    totalSeconds = Math.floor(elapsed / 1000);

    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    stopTimer();
    document.querySelector(".timer-display").classList.add("completed");
    document.getElementById("status").textContent = `축하합니다! ${formatTime(totalSeconds)} 걸렸습니다!`;

    document.getElementById("completion-message").textContent = `${formatTime(totalSeconds)}에 큐브를 완성했습니다!`;
    document.getElementById("save-modal").style.display = "block";
    document.body.classList.add("modal-open");
    document.getElementById("player-name").focus();
}
// 기록 저장 버튼 이벤트
document.getElementById("save-score-btn").addEventListener("click", () => {
    const playerName = document.getElementById("player-name").value.trim() || "익명";
    saveRecord(totalSeconds, playerName); // 💡 전역 변수 사용
    document.getElementById("save-modal").style.display = "none";
    document.body.classList.remove("modal-open");
    document.getElementById("player-name").value = "";
    alert("기록이 저장되었습니다!");
});

function startGame() {
    console.log("Starting new game...");
    stopTimer();
    reset();
    document.getElementById("timer").textContent = "00:00";
    document.getElementById("status").textContent = "큐브를 섞는 중...";

    setTimeout(() => {
        scrambleCube();
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

// 키보드 이벤트 리스너
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
        KeyZ: () => rotateCubeZ(!isShift),
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

    // 게임 버튼 이벤트
    const startButton = document.getElementById("start-game-btn");
    if (startButton) {
        startButton.addEventListener("click", startGame);
    }

    const resetButton = document.getElementById("reset-btn");
    if (resetButton) {
        resetButton.addEventListener("click", reset);
    }

    // 랭킹 관련 버튼 이벤트
    const showRankingBtn = document.getElementById("show-ranking-btn");
    if (showRankingBtn) {
        showRankingBtn.addEventListener("click", () => {
            document.getElementById("ranking-modal").style.display = "block";
            document.body.classList.add("modal-open");
            renderRanking();
        });
    }

    const clearRecordsBtn = document.getElementById("clear-records-btn");
    if (clearRecordsBtn) {
        clearRecordsBtn.addEventListener("click", clearAllRecords);
    }

    // 모달 닫기 이벤트
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
            document.body.classList.remove("modal-open");
        });
    });

    // 모달 배경 클릭 시 닫기
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.classList.remove("modal-open");
            }
        });
    });


    // 기록 저장 건너뛰기 버튼 이벤트
    document.getElementById("skip-save-btn").addEventListener("click", () => {
        document.getElementById("save-modal").style.display = "none";
        document.body.classList.remove("modal-open");
        document.getElementById("player-name").value = "";
    });

    // Enter 키로 기록 저장
    document.getElementById("player-name").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            document.getElementById("save-score-btn").click();
        }
    });


    renderCube();
});