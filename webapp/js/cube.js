// 면 인덱스 정의
const FACE = {
  TOP: 0,
  FRONT_LEFT: 1,
  FRONT_RIGHT: 2,
  BOTTOM: 3,
  BACK_LEFT: 4,
  BACK_RIGHT: 5
};

// 각 면의 기본 색상 (사용자 요청대로)
const FACE_COLORS = {
  [FACE.TOP]: 'yellow',
  [FACE.FRONT_LEFT]: 'red', 
  [FACE.FRONT_RIGHT]: 'green',
  [FACE.BOTTOM]: 'white',
  [FACE.BACK_LEFT]: 'orange',
  [FACE.BACK_RIGHT]: 'blue'
};

// 3x3x6 큐브 배열 생성 및 초기화
function createSolvedCube() {
  const cube = [];
  
  // [3][3][6] 배열 생성
  for (let i = 0; i < 3; i++) {
    cube[i] = [];
    for (let j = 0; j < 3; j++) {
      cube[i][j] = [null, null, null, null, null, null];
    }
  }
  
  // 각 위치별로 해당하는 면의 색상 설정
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      cube[i][j][FACE.TOP] = FACE_COLORS[FACE.TOP];
      cube[i][j][FACE.FRONT_LEFT] = FACE_COLORS[FACE.FRONT_LEFT];
      cube[i][j][FACE.FRONT_RIGHT] = FACE_COLORS[FACE.FRONT_RIGHT];
      cube[i][j][FACE.BOTTOM] = FACE_COLORS[FACE.BOTTOM];
      cube[i][j][FACE.BACK_LEFT] = FACE_COLORS[FACE.BACK_LEFT];
      cube[i][j][FACE.BACK_RIGHT] = FACE_COLORS[FACE.BACK_RIGHT];
    }
  }
  
  return cube;
}

let cube = createSolvedCube();

// 특정 면의 3x3 색상 배열 추출
function getFaceColors(faceType) {
  const colors = [];
  
  if (faceType === 'top') {
    // TOP 면 추출
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row.push(cube[i][j][FACE.TOP]);
      }
      colors.push(row);
    }
  } else if (faceType === 'front') {
    // FRONT_LEFT 면 추출
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row.push(cube[i][j][FACE.FRONT_LEFT]);
      }
      colors.push(row);
    }
  } else if (faceType === 'right') {
    // FRONT_RIGHT 면 추출
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row.push(cube[i][j][FACE.FRONT_RIGHT]);
      }
      colors.push(row);
    }
  }
  
  return colors;
}

// 화면 렌더링 - 디버깅 정보 추가
function renderFace(faceElement, colors, faceName) {
  console.log(`Rendering ${faceName}:`, colors);
  faceElement.innerHTML = '';
  colors.forEach(row => {
    row.forEach(color => {
      const square = document.createElement('div');
      square.className = `square ${color}`;
      console.log(`Creating square with class: square ${color}`);
      faceElement.appendChild(square);
    });
  });
}

function renderCube() {
  console.log('=== Rendering Cube ===');
  console.log('Current cube state:', cube);
  
  const topFace = document.getElementById('top-face');
  const frontFace = document.getElementById('front-face');
  const rightFace = document.getElementById('right-face');
  
  if (!topFace || !frontFace || !rightFace) {
    console.error('Face elements not found!');
    return;
  }
  
  const topColors = getFaceColors('top');
  const frontColors = getFaceColors('front');
  const rightColors = getFaceColors('right');
  
  console.log('Top colors should be:', FACE_COLORS[FACE.TOP]);
  console.log('Front colors should be:', FACE_COLORS[FACE.FRONT_LEFT]);
  console.log('Right colors should be:', FACE_COLORS[FACE.FRONT_RIGHT]);
  
  renderFace(topFace, topColors, 'TOP');
  renderFace(frontFace, frontColors, 'FRONT_LEFT');
  renderFace(rightFace, rightColors, 'FRONT_RIGHT');
}

// 면 회전을 위한 헬퍼 함수
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
      if (clockwise) {
        cube[i][j][faceIndex] = temp[2-j][i];
      } else {
        cube[i][j][faceIndex] = temp[j][2-i];
      }
    }
  }
}

// 인접면 색상 회전을 위한 헬퍼 함수
function rotateAdjacentColors(positions, clockwise = true) {
  const temp = [];
  
  positions.forEach(pos => {
    temp.push(cube[pos.i][pos.j][pos.face]);
  });
  
  if (clockwise) {
    for (let k = 0; k < positions.length; k++) {
      const nextIndex = (k + 1) % positions.length;
      const pos = positions[k];
      cube[pos.i][pos.j][pos.face] = temp[nextIndex];
    }
  } else {
    for (let k = 0; k < positions.length; k++) {
      const prevIndex = (k - 1 + positions.length) % positions.length;
      const pos = positions[k];
      cube[pos.i][pos.j][pos.face] = temp[prevIndex];
    }
  }
}

// 회전 함수들
function rotateR(clockwise = true) {
  console.log(`Rotating R ${clockwise ? 'clockwise' : 'counter-clockwise'}`);
  rotateFaceColors(FACE.FRONT_RIGHT, clockwise);
  
  for (let i = 0; i < 3; i++) {
    const positions = [
      {i: i, j: 2, face: FACE.TOP},
      {i: i, j: 2, face: FACE.BACK_LEFT},
      {i: i, j: 2, face: FACE.BOTTOM},
      {i: i, j: 2, face: FACE.FRONT_LEFT}
    ];
    rotateAdjacentColors(positions, clockwise);
  }
}

function rotateL(clockwise = true) {
  console.log(`Rotating L ${clockwise ? 'clockwise' : 'counter-clockwise'}`);
  rotateFaceColors(FACE.BACK_RIGHT, clockwise);
  
  for (let i = 0; i < 3; i++) {
    const positions = [
      {i: i, j: 0, face: FACE.TOP},
      {i: i, j: 0, face: FACE.FRONT_LEFT},
      {i: i, j: 0, face: FACE.BOTTOM},
      {i: i, j: 0, face: FACE.BACK_LEFT}
    ];
    rotateAdjacentColors(positions, clockwise);
  }
}

function rotateU(clockwise = true) {
  console.log(`Rotating U ${clockwise ? 'clockwise' : 'counter-clockwise'}`);
  rotateFaceColors(FACE.TOP, clockwise);
  
  for (let j = 0; j < 3; j++) {
    const positions = [
      {i: 0, j: j, face: FACE.FRONT_LEFT},
      {i: 0, j: j, face: FACE.FRONT_RIGHT},
      {i: 0, j: j, face: FACE.BACK_LEFT},
      {i: 0, j: j, face: FACE.BACK_RIGHT}
    ];
    rotateAdjacentColors(positions, clockwise);
  }
}

function rotateD(clockwise = true) {
  console.log(`Rotating D ${clockwise ? 'clockwise' : 'counter-clockwise'}`);
  rotateFaceColors(FACE.BOTTOM, clockwise);
  
  for (let j = 0; j < 3; j++) {
    const positions = [
      {i: 2, j: j, face: FACE.FRONT_LEFT},
      {i: 2, j: j, face: FACE.BACK_RIGHT},
      {i: 2, j: j, face: FACE.BACK_LEFT},
      {i: 2, j: j, face: FACE.FRONT_RIGHT}
    ];
    rotateAdjacentColors(positions, clockwise);
  }
}

function rotateF(clockwise = true) {
  console.log(`Rotating F ${clockwise ? 'clockwise' : 'counter-clockwise'}`);
  rotateFaceColors(FACE.FRONT_LEFT, clockwise);
  
  for (let k = 0; k < 3; k++) {
    const positions = [
      {i: 2, j: k, face: FACE.TOP},
      {i: k, j: 0, face: FACE.FRONT_RIGHT},
      {i: 0, j: 2-k, face: FACE.BOTTOM},
      {i: 2-k, j: 2, face: FACE.BACK_RIGHT}
    ];
    rotateAdjacentColors(positions, clockwise);
  }
}

function rotateB(clockwise = true) {
  console.log(`Rotating B ${clockwise ? 'clockwise' : 'counter-clockwise'}`);
  rotateFaceColors(FACE.BACK_LEFT, clockwise);
  
  for (let k = 0; k < 3; k++) {
    const positions = [
      {i: 0, j: k, face: FACE.TOP},
      {i: k, j: 2, face: FACE.BACK_RIGHT},
      {i: 2, j: 2-k, face: FACE.BOTTOM},
      {i: 2-k, j: 0, face: FACE.FRONT_RIGHT}
    ];
    rotateAdjacentColors(positions, clockwise);
  }
}

function rotateCubeX(clockwise = true) {
  console.log(`Rotating X ${clockwise ? 'clockwise' : 'counter-clockwise'}`);

  // 각 열을 한 번에 임시 저장 후 순환
  for (let j = 0; j < 3; j++) {
    const temp = [cube[0][j][FACE.TOP], cube[1][j][FACE.TOP], cube[2][j][FACE.TOP]];
    if (clockwise) {
      // TOP → BACK_LEFT, BACK_LEFT → BOTTOM, BOTTOM → FRONT_LEFT, FRONT_LEFT → TOP
      for (let i = 0; i < 3; i++) {
        cube[i][j][FACE.TOP]         = cube[i][j][FACE.BACK_LEFT];
        cube[i][j][FACE.BACK_LEFT]   = cube[i][j][FACE.BOTTOM];
        cube[i][j][FACE.BOTTOM]      = cube[i][j][FACE.FRONT_LEFT];
        cube[i][j][FACE.FRONT_LEFT]  = temp[i];
      }
    } else {
      // TOP → FRONT_LEFT, FRONT_LEFT → BOTTOM, BOTTOM → BACK_LEFT, BACK_LEFT → TOP
      for (let i = 0; i < 3; i++) {
        cube[i][j][FACE.TOP]         = cube[i][j][FACE.FRONT_LEFT];
        cube[i][j][FACE.FRONT_LEFT]  = cube[i][j][FACE.BOTTOM];
        cube[i][j][FACE.BOTTOM]      = cube[i][j][FACE.BACK_LEFT];
        cube[i][j][FACE.BACK_LEFT]   = temp[i];
      }
    }
  }
  // 옆면 자체 회전
  rotateFaceColors(FACE.FRONT_RIGHT, !clockwise);
  rotateFaceColors(FACE.BACK_RIGHT, clockwise);
}

// Y축 회전: FRONT_LEFT <-> FRONT_RIGHT <-> BACK_LEFT <-> BACK_RIGHT (시계방향 순환)
function rotateCubeY(clockwise = true) {
  console.log(`Rotating Y ${clockwise ? 'clockwise' : 'counter-clockwise'}`);

  for (let i = 0; i < 3; i++) {
    const temp = [cube[i][0][FACE.FRONT_LEFT], cube[i][1][FACE.FRONT_LEFT], cube[i][2][FACE.FRONT_LEFT]];
    if (clockwise) {
      // FRONT_LEFT → BACK_RIGHT → BACK_LEFT → FRONT_RIGHT → FRONT_LEFT
      for (let j = 0; j < 3; j++) {
        cube[i][j][FACE.FRONT_LEFT]  = cube[i][j][FACE.BACK_RIGHT];
        cube[i][j][FACE.BACK_RIGHT]  = cube[i][j][FACE.BACK_LEFT];
        cube[i][j][FACE.BACK_LEFT]   = cube[i][j][FACE.FRONT_RIGHT];
        cube[i][j][FACE.FRONT_RIGHT] = temp[j];
      }
    } else {
      // FRONT_LEFT → FRONT_RIGHT → BACK_LEFT → BACK_RIGHT → FRONT_LEFT
      for (let j = 0; j < 3; j++) {
        cube[i][j][FACE.FRONT_LEFT]  = cube[i][j][FACE.FRONT_RIGHT];
        cube[i][j][FACE.FRONT_RIGHT] = cube[i][j][FACE.BACK_LEFT];
        cube[i][j][FACE.BACK_LEFT]   = cube[i][j][FACE.BACK_RIGHT];
        cube[i][j][FACE.BACK_RIGHT]  = temp[j];
      }
    }
  }
  // 상하면 자체 회전
  rotateFaceColors(FACE.TOP, clockwise);
  rotateFaceColors(FACE.BOTTOM, !clockwise);
}

// Z축 회전: 각 면의 3x3 배열을 시계/반시계로 회전, 옆면은 행/열을 순환
function rotateCubeZ(clockwise = true) {
  console.log(`Rotating Z ${clockwise ? 'clockwise' : 'counter-clockwise'}`);

  // 각 행을 임시 저장 후 순환
  for (let i = 0; i < 3; i++) {
    const temp = [cube[0][i][FACE.TOP], cube[1][i][FACE.TOP], cube[2][i][FACE.TOP]];
    if (clockwise) {
      // TOP의 행 → FRONT_LEFT의 열 → BOTTOM의 역행 → FRONT_RIGHT의 역열 → TOP
      for (let j = 0; j < 3; j++) {
        cube[j][i][FACE.TOP] 		= cube[i][j][FACE.FRONT_RIGHT];
        cube[i][j][FACE.FRONT_RIGHT] = cube[j][i][FACE.BOTTOM];
        cube[j][i][FACE.BOTTOM]		= cube[j][i][FACE.BACK_RIGHT];
        cube[j][i][FACE.BACK_RIGHT]= temp[i];
      }
    } else {
      // 역방향 순환
      for (let j = 0; j < 3; j++) {
		cube[j][i][FACE.TOP] 		= cube[i][j][FACE.BACK_RIGHT];
		cube[i][j][FACE.BACK_RIGHT]= cube[j][i][FACE.BOTTOM];
		cube[j][i][FACE.BOTTOM]		= cube[j][i][FACE.FRONT_LEFT];
		cube[j][i][FACE.FRONT_LEFT]	=  temp[i];
      }
    }
  }
  // 뒷면 자체 회전
  rotateFaceColors(FACE.BACK_LEFT, !clockwise);
  rotateFaceColors(FACE.BACK_RIGHT, clockwise);
}


// 초기화
function reset() {
  console.log('Resetting cube');
  cube = createSolvedCube();
  renderCube();
}

// 키보드 이벤트 처리 - event.code 방식으로 수정 (Z키 문제 해결)
document.addEventListener('keydown', (e) => {
  const isShift = e.shiftKey;
  
  console.log(`Key pressed: ${e.code}${isShift ? ' + Shift' : ''}`);
  
  switch(e.code) {
    case 'KeyR':
      rotateR(!isShift);
      break;
    case 'KeyL':
      rotateL(!isShift);
      break;
    case 'KeyU':
      rotateU(!isShift);
      break;
    case 'KeyD':
      rotateD(!isShift);
      break;
    case 'KeyF':
      rotateF(!isShift);
      break;
    case 'KeyB':
      rotateB(!isShift);
      break;
    case 'KeyX':
      rotateCubeX();
      break;
    case 'KeyY':
      rotateCubeY();
      break;
    case 'KeyZ':
      rotateCubeZ();
      break;
    case 'Space':
      e.preventDefault();
      reset();
      break;
    default:
      return;
  }
  
  renderCube();
});

// 초기 렌더링
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing cube');
  console.log('Expected colors:');
  console.log('TOP:', FACE_COLORS[FACE.TOP]);
  console.log('FRONT_LEFT:', FACE_COLORS[FACE.FRONT_LEFT]);
  console.log('FRONT_RIGHT:', FACE_COLORS[FACE.FRONT_RIGHT]);
  
  renderCube();
});
