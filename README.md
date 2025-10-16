# 2048 Game

A React-based 2048 game with configurable board size, dynamic score tracking, Undo/ redo functionality and responsive UI.

## Table of Contents
1. Installation
2. Running the Game
3. Game Instructions
4. Implementation Details
5. Features

## Installation
1. Clone the repo: git clone https://github.com/GaliveetiSaiRoopa/game-2048.git
2. Navigate into project directory: cd game-2048
3. Install dependencies : npm install

## Running the game
Start the development server: npm start (visit browser at http://localhost:5173/) (Vite + react).  
Build for production: npm run build

## Game Instructions
#### Combining the tiles with same number (adjacent tiles) on every move to reach 2048 score.

### Controls:
- Use keyboard arrows to control the game
- Click Restart button to restart the game 
- Undo / Redo buttons to revert back or redo moves

### Rules:
-Tiles with the same number (adjacent tiles - in arrow direction) merge into one tile with their sum.
- After every move new tile with values either 2 or 4 gets added to the board at random empty tile.
- Game ends when:
  - You reach score 2048 (win)
  - No more moves are possible
 
### Score Calculation:
- Score increases by the sum of merged tiles.
- Best score is tracked using **localStorage**.

## Implementation Details
  - React functional components with hooks (useState, useEffect, useRef)
  - **Board Logic and game implementation**: Implemented in utils.js using functional programming principles
    - CreateBoard(size) - creates empty board
    - addValAtRandonCellInGrid(board) - adds 2 or 4 values at random tiles on the board
    - moveLeft/moveRight/moveUp/moveDown(board) - handle tile movements and merging
    - hasWon(board) - checks for tile with 2048 value
    - isEmptyCellsLeft(board) - checks for avaliable moves

 - Undo/Redo functionality: stores last 3 board states in memory to allow undo/redo
 - Local Storage: Data persists between sessions
 - **Accessibility:** Keyboard support with keydown events

## Features
- Configurable board size (4 X 4, 5 X 5, 6 X 6)
- Undo/ Redo moves
- Persists bestscore between sessions
- Restart Game
   



