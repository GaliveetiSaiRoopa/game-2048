import { useCallback, useEffect, useRef, useState } from "react";
import {
  addValAtRandomCellInGrid,
  createBoard,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
} from "./utils";

function App() {
  const [size, setSize] = useState(Number(localStorage.getItem("size")) || 4);
  const [board, setBoard] = useState(
    JSON.parse(localStorage.getItem("board")) || null
  );
  const [score, setScore] = useState(
    Number(localStorage.getItem("score")) || 0
  );
  const inputRef = useRef();
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem("bestScore")) || 0
  );
  ("");
  const [undoBoard, setUndoBoard] = useState(
    JSON.parse(localStorage.getItem("undoBoard")) || []
  );
  const [redoBoard, setRedoBoard] = useState(
    JSON.parse(localStorage.getItem("redoBoard")) || []
  );

  console.log(size, "Check Size");

  // Initialize board

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

  const handleMove = useCallback(
    (direction) => {
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

      if (JSON.stringify(tempBoard) === JSON.stringify(newBoard)) {
        return tempBoard;
      }
      const updatedBoard = addValAtRandomCellInGrid(newBoard);
      setBoard(updatedBoard);
      setScore((score) => score + gainScore);
      setUndoBoard((prev) => {
        const temp = [...prev, updatedBoard];
        if (temp.length > 3) temp.shift();
        return temp;
      });
      setRedoBoard([]);
    },
    [board]
  );

  useEffect(() => {
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

    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [handleMove]);

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

  const restartGame = () => {
    const newBoard = addValAtRandomCellInGrid(
      addValAtRandomCellInGrid(createBoard(size))
    );

    setBoard(newBoard);
    setRedoBoard([]);
    setUndoBoard([newBoard]);
    setScore(0);
  };
  console.log(size, "Size check");

  return (
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

      <div className="game-controls">
        <div
          className={`undo-wrapper ${undoBoard.length < 2 ? "disable" : ""}`}
        >
          <img
            src="src/assets/undo.svg"
            alt="undo"
            className={`undo-img `}
            onClick={handleUndo}
          />
          <p className="undo">Undo the move</p>
        </div>
        <div
          className={`undo-wrapper  ${redoBoard.length < 1 ? "disable" : ""}`}
        >
          <img
            src="src/assets/redo.svg"
            alt="redo"
            className={`undo-img`}
            onClick={handleRedo}
          />
          <p className="undo">Redo the move</p>
        </div>

        <button className="" onClick={() => restartGame()}>
          Restart
        </button>
      </div>
    </div>
  );
}

export default App;
