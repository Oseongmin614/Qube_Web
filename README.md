# Web Cube Game

## 설명

이 프로젝트는 웹 기반의 큐브 퍼즐 게임입니다. 사용자는 웹 브라우저에서 큐브를 맞추며 즐길 수 있으며, 로컬 스토리지를 사용하여 순위를 기록합니다. 2D 그래픽을 입체적으로 보이게 하여 실제 큐브를 조작하는 듯한 경험을 제공합니다.

## 주요 기능

-   브라우저에서 즐기는 인터랙티브 큐브 퍼즐 게임
-   로컬 스토리지를 이용한 랭킹 시스템
-   입체감을 살린 2D 그래픽

## 기술 스택

-   **Frontend:**
    -   HTML
    -   CSS
    -   Vanilla JavaScript

## 실행 방법

1.  프로젝트를 클론하거나 다운로드 받습니다.
2.  `webapp/html/index.html` 파일을 웹 브라우저에서 엽니다.

## 동작 설명

- **큐브 조작**:
    -   **R, L, U, D, F, B**: 각 면을 시계 방향으로 회전합니다.
    -   **Shift + (R, L, U, D, F, B)**: 각 면을 반시계 방향으로 회전합니다.
    -   **X, Y, Z**: 큐브 전체를 각 축을 기준으로 회전합니다.
    -   **Space**: 큐브를 초기 상태로 리셋합니다.

- **모달 동작**:
    -   랭킹 보기 또는 게임 완료 시 나타나는 모달 창이 열려 있는 동안에는 배경 페이지의 스크롤이 비활성화됩니다.