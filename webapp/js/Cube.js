class RubiksCube {
    constructor() {
        this.colors = ['white', 'red', 'blue', 'orange', 'green', 'yellow'];
        this.faces = {
            front: Array(9).fill('white'),
            right: Array(9).fill('red'),
            top: Array(9).fill('yellow'),
            back: Array(9).fill('orange'),
            left: Array(9).fill('green'),
            bottom: Array(9).fill('blue')
        };
        this.currentOrientation = {
            front: 'front',
            right: 'right',
            top: 'top'
        };
        this.init();
    }

    init() {
        this.renderCube();
        this.addKeyboardControls();
        console.log('루빅스 큐브 초기화 완료');
        console.log('키보드 조작: R/L/U/D/F/B (면 회전), X/Y/Z (큐브 회전), Space (초기화)');
    }

    renderCube() {
        Object.keys(this.currentOrientation).forEach(displayFace => {
            const actualFace = this.currentOrientation[displayFace];
            const squares = document.querySelectorAll(`[data-face="${displayFace}"]`);
            squares.forEach((square, index) => {
                square.className = `square ${this.faces[actualFace][index]}`;
            });
        });
    }

    rotateFace(face, clockwise = true) {
        const faceArray = [...this.faces[face]];
        if (clockwise) {
            this.faces[face] = [
                faceArray[6], faceArray[3], faceArray[0],
                faceArray[7], faceArray[4], faceArray[1],
                faceArray[8], faceArray[5], faceArray[2]
            ];
        } else {
            this.faces[face] = [
                faceArray[2], faceArray[5], faceArray[8],
                faceArray[1], faceArray[4], faceArray[7],
                faceArray[0], faceArray[3], faceArray[6]
            ];
        }
        this.renderCube();
        console.log(`${face} 면을 ${clockwise ? '시계' : '반시계'}방향으로 회전`);
    }

    rotateCube(axis, clockwise = true) {
        const rotateFaceData = (face, direction) => {
            const arr = [...this.faces[face]];
            return direction === 'cw' ? [
                arr[6], arr[3], arr[0],
                arr[7], arr[4], arr[1],
                arr[8], arr[5], arr[2]
            ] : [
                arr[2], arr[5], arr[8],
                arr[1], arr[4], arr[7],
                arr[0], arr[3], arr[6]
            ];
        };

        // 얕은 복사로 원본 보존
        const originalFaces = {
            front: [...this.faces.front],
            right: [...this.faces.right],
            top: [...this.faces.top],
            back: [...this.faces.back],
            left: [...this.faces.left],
            bottom: [...this.faces.bottom]
        };

        if (axis === 'x') {
            if (clockwise) {
                this.faces.front  = rotateFaceData('bottom', 'cw');
                this.faces.bottom = rotateFaceData('back', 'ccw');
                this.faces.back   = rotateFaceData('top', 'cw');
                this.faces.top    = rotateFaceData('front', 'ccw');
                this.faces.left   = rotateFaceData('left', 'ccw');
                this.faces.right  = rotateFaceData('right', 'cw');
            } else {
                this.faces.front  = rotateFaceData('top', 'cw');
                this.faces.top    = rotateFaceData('back', 'ccw');
                this.faces.back   = rotateFaceData('bottom', 'cw');
                this.faces.bottom = rotateFaceData('front', 'ccw');
                this.faces.left   = rotateFaceData('left', 'cw');
                this.faces.right  = rotateFaceData('right', 'ccw');
            }
        } 
        else if (axis === 'y') {
            if (clockwise) {
                this.faces.front = [...originalFaces.right];
                this.faces.right = [...originalFaces.back];
                this.faces.back = [...originalFaces.left];
                this.faces.left = [...originalFaces.front];
                this.faces.top = rotateFaceData('top', 'cw');
                this.faces.bottom = rotateFaceData('bottom', 'ccw');
            } else {
                this.faces.front = [...originalFaces.left];
                this.faces.left = [...originalFaces.back];
                this.faces.back = [...originalFaces.right];
                this.faces.right = [...originalFaces.front];
                this.faces.top = rotateFaceData('top', 'ccw');
                this.faces.bottom = rotateFaceData('bottom', 'cw');
            }
        }
        else if (axis === 'z') {
            if (clockwise) {
                this.faces.top = rotateFaceData('left', 'cw');
                this.faces.right = rotateFaceData('top', 'cw');
                this.faces.bottom = rotateFaceData('right', 'cw');
                this.faces.left = rotateFaceData('bottom', 'cw');
                this.faces.front = rotateFaceData('front', 'cw');
                this.faces.back = rotateFaceData('back', 'ccw');
            } else {
                this.faces.top = rotateFaceData('right', 'ccw');
                this.faces.right = rotateFaceData('bottom', 'ccw');
                this.faces.bottom = rotateFaceData('left', 'ccw');
                this.faces.left = rotateFaceData('top', 'ccw');
                this.faces.front = rotateFaceData('front', 'ccw');
                this.faces.back = rotateFaceData('back', 'cw');
            }
        }

        this.renderCube();
        console.log(`큐브를 ${axis}축으로 ${clockwise ? '시계' : '반시계'}방향 회전`);
    }

    addKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            const isShift = e.shiftKey;
            const clockwise = !isShift;

            const faceMap = {
                'r': 'right',
                'l': 'left',
                'u': 'top',
                'd': 'bottom',
                'f': 'front',
                'b': 'back'
            };

            if (faceMap[key]) {
                this.rotateFace(faceMap[key], clockwise);
                return;
            }

            const axisMap = {
                'x': 'x',
                'y': 'y',
                'z': 'z'
            };

            if (axisMap[key]) {
                this.rotateCube(axisMap[key], clockwise);
                return;
            }

            if (key === ' ') {
                e.preventDefault();
                this.reset();
                return;
            }
        });
    }

    reset() {
        this.faces = {
            front: Array(9).fill('white'),
            right: Array(9).fill('red'),
            top: Array(9).fill('yellow'),
            back: Array(9).fill('orange'),
            left: Array(9).fill('green'),
            bottom: Array(9).fill('blue')
        };
        this.currentOrientation = {
            front: 'front',
            right: 'right',
            top: 'top'
        };
        this.renderCube();
        console.log('큐브가 초기화되었습니다.');
    }

    scramble() {
        const moves = ['front', 'right', 'top', 'back', 'left', 'bottom'];
        for (let i = 0; i < 20; i++) {
            const randomFace = moves[Math.floor(Math.random() * moves.length)];
            const randomDirection = Math.random() < 0.5;
            this.rotateFace(randomFace, randomDirection);
        }
        console.log('큐브를 섞었습니다.');
    }

    logState() {
        console.log('=== 현재 큐브 상태 ===');
        Object.keys(this.faces).forEach(face => {
            console.log(`${face}:`, this.faces[face]);
        });
        console.log('현재 방향:', this.currentOrientation);
        console.log('==================');
    }

    isSolved() {
        return Object.keys(this.faces).every(face => {
            const firstColor = this.faces[face][0];
            return this.faces[face].every(color => color === firstColor);
        });
    }
}

// 전역 함수
function resetCube() {
    if (window.rubiksCube) window.rubiksCube.reset();
}
function scrambleCube() {
    if (window.rubiksCube) window.rubiksCube.scramble();
}
function logCubeState() {
    if (window.rubiksCube) window.rubiksCube.logState();
}

document.addEventListener('DOMContentLoaded', () => {
    window.rubiksCube = new RubiksCube();
});
