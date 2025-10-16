import { useEffect, useRef, useState } from "react";
import {
  addValAtRandomCellInGrid,
  createBoard,
  hasWon,
  isEmptyCellsLeft,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
} from "./utils";
import HasWon from "./modals/HasWon";
import HasAnyMovesLeft from "./modals/HasAnyMovesLeft";

function App() {
  const inputRef = useRef();
  const [size, setSize] = useState(Number(localStorage.getItem("size")) || 4);
  const [board, setBoard] = useState(
    JSON.parse(localStorage.getItem("board")) || null
  );
  const [score, setScore] = useState(
    Number(localStorage.getItem("score")) || 0
  );

  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem("bestScore")) || 0
  );
  const [undoBoard, setUndoBoard] = useState(
    JSON.parse(localStorage.getItem("undoBoard")) || []
  );
  const [redoBoard, setRedoBoard] = useState(
    JSON.parse(localStorage.getItem("redoBoard")) || []
  );

  const [mStates, setMStates] = useState({
    won: { isOpen: false },
    movesLeft: { isOpen: false },
  });

  const handleMStates = (type) => {
    const temp = { ...mStates };
    temp[type].isOpen = !temp[type].isOpen;
    setMStates(temp);
  };

  // Initilize the board on first render and when size (dependency array changes)
  useEffect(() => {
    if (!board || board.length != size) {
      let newBoard = createBoard(size);
      newBoard = addValAtRandomCellInGrid(addValAtRandomCellInGrid(newBoard));
      setBoard(newBoard);
      setUndoBoard([newBoard]);
      setScore(0);
      setRedoBoard([]);
    }
  }, [size]);

  // storing board, score, redoboard, undoboard , bestScore in localStorage on every render
  useEffect(() => {
    if (!board) return;
    localStorage.setItem("board", JSON.stringify(board));
    localStorage.setItem("score", score);
    localStorage.setItem("redoBoard", JSON.stringify(redoBoard));
    localStorage.setItem("undoBoard", JSON.stringify(undoBoard));
    localStorage.setItem("size", size);

    if (score > bestScore) {
      localStorage.setItem("bestScore", score);
      setBestScore(score);
    }
  }, [board, score, undoBoard, redoBoard, bestScore]);

  // based on directions newBoard is created with updated values
  const handleMove = (direction) => {
    if (!board) return;
    let gainScore = 0;
    let tempBoard = board?.map((row) => [...row]);
    let newBoard = tempBoard;
    switch (direction) {
      case "left":
        const { updatedLeftBoard, addScore } = moveLeft(tempBoard);
        newBoard = updatedLeftBoard;
        gainScore = addScore;
        break;
      case "right":
        const { updatedRightBoard, addScore: rightMoveScore } =
          moveRight(tempBoard);
        newBoard = updatedRightBoard;
        gainScore = rightMoveScore;
        break;
      case "up":
        const { updatedUpBoard, addScore: upMoveScore } = moveUp(tempBoard);
        newBoard = updatedUpBoard;
        gainScore = upMoveScore;
        break;
      case "down":
        const { updatedDownBoard, addScore: downMoveScore } =
          moveDown(tempBoard);
        newBoard = updatedDownBoard;
        gainScore = downMoveScore;
        break;
      default:
        return tempBoard;
    }

    if (hasWon(newBoard)) {
      handleMStates("won");
    }

    if (!isEmptyCellsLeft(newBoard)) {
      handleMStates("movesLeft");
    }

    // no change in board
    if (JSON.stringify(tempBoard) === JSON.stringify(newBoard)) {
      return tempBoard;
    }

    //update board, score, undoBoard (size == 3)
    const updatedBoard = addValAtRandomCellInGrid(newBoard);
    setBoard(updatedBoard);
    setScore((score) => score + gainScore);
    setUndoBoard((prev) => {
      const temp = [...prev, updatedBoard];
      if (temp.length > 3) temp.shift();
      return temp;
    });
    setRedoBoard([]);
  };

  useEffect(() => {
    // based on key press from key board
    const handleKeys = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          handleMove("left");
          break;
        case "ArrowRight":
          handleMove("right");
          break;
        case "ArrowUp":
          handleMove("up");
          break;
        case "ArrowDown":
          handleMove("down");
          break;
      }
    };
    //adding key events to window (keyDown - browser event checks for keyboard - key press)
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [board]);

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const threshold = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > threshold) handleMove("right");
        else if (deltaX < -threshold) handleMove("left");
      } else {
        if (deltaY > threshold) handleMove("down");
        else if (deltaY < -threshold) handleMove("up");
      }
    };

    const container = document.querySelector(".game-container");
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [board]);

  const handleUndo = () => {
    if (undoBoard.length < 2) return;
    const temp = [...undoBoard];
    const lastState = temp.pop();
    const prevState = temp[temp.length - 1];
    setRedoBoard((prev) => [...prev, lastState]);
    setBoard(prevState);
    setUndoBoard(temp);
  };

  const handleRedo = () => {
    if (redoBoard.length < 1) return;
    const temp = [...redoBoard];
    const lastState = temp.pop();
    setBoard(lastState);
    setUndoBoard((prev) => [...prev, lastState]);
    setRedoBoard(temp);
  };

  // restate game with same size
  const restartGame = () => {
    const newBoard = addValAtRandomCellInGrid(
      addValAtRandomCellInGrid(createBoard(size))
    );

    setBoard(newBoard);
    setRedoBoard([]);
    setUndoBoard([newBoard]);
    setScore(0);
  };

  return (
    <>
      <div className="game-container">
        <h1>2048 Game</h1>
        <div className="info">
          <p>Score: {score}</p>
          <p>Best: {bestScore}</p>
          <select
            className="board-size"
            id="size"
            onChange={(e) => {
              setSize(Number(e.target.value));
              localStorage.setItem("size", e.target.value);
              inputRef.current.blur();
            }}
            ref={inputRef}
            value={size}
          >
            <option value={4}>4 X 4</option>
            <option value={5}>5 X 5</option>
            <option value={6}>6 X 6</option>
          </select>
        </div>

        <div className="board">
          {board?.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.map((col, colIndex) => (
                <div className={`col val-${col}`} key={colIndex}>
                  {col === 0 ? "" : col}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mobile-controls">
          <button onClick={() => handleMove("up")} className="up">
            ↑
          </button>
          <button onClick={() => handleMove("down")} className="down">
            ↓
          </button>
          <button onClick={() => handleMove("left")} className="left">
            ←
          </button>
          <button onClick={() => handleMove("right")} className="right">
            →
          </button>
        </div>

        <div className="game-controls">
          <div className={`undo-wrapper`}>
            <img
              src="/assets/undo.svg"
              alt="undo"
              className={`undo-img ${undoBoard.length < 2 ? "disable" : ""} `}
              onClick={handleUndo}
            />
            <p className="undo">Undo the move</p>
          </div>
          <div className={`undo-wrapper`}>
            <img
              src="/assets/redo.svg"
              alt="redo"
              className={`undo-img ${redoBoard.length < 1 ? "disable" : ""}`}
              onClick={handleRedo}
            />
            <p className="undo">Redo the move</p>
          </div>

          <button className="" onClick={() => restartGame()}>
            Restart
          </button>
        </div>
      </div>

      {mStates?.won?.isOpen && (
        <HasWon
          open={mStates?.won?.isOpen}
          handleClose={() => handleMStates("won")}
        />
      )}

      {mStates?.movesLeft?.isOpen && (
        <HasAnyMovesLeft
          open={mStates?.movesLeft?.isOpen}
          handleClose={() => handleMStates("movesLeft")}
          handleRestart={() => restartGame()}
        />
      )}
    </>
  );
}

export default App;
