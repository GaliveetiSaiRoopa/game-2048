export const createBoard = (size) => {
  let newBoardGame = Array(size)
    .fill(0)
    .map(() => Array(size).fill(0));
  return newBoardGame;
};

export const addValAtRandomCellInGrid = (board) => {
  const listWithZeroVal = [];

  board?.map((row, rowIndex) =>
    row.map((cell, cellIndex) => {
      if (board[rowIndex][cellIndex] === 0) {
        listWithZeroVal.push([rowIndex, cellIndex]);
      }
    })
  );

  if (listWithZeroVal.length === 0) return board;

  const [x, y] =
    listWithZeroVal[Math.floor(Math.random() * listWithZeroVal.length)];
  const newBoard = board.map((row) => [...row]);
  newBoard[x][y] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
};

export const moveLeft = (board) => {
  let newScore = 0;
  let updatedBoard = board?.map((row) => {
    let newArray = row.filter((cell) => cell !== 0);
    let skip = false;
    let mergeElementsArray = [];
    for (let i = 0; i < newArray.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }
      if (newArray[i] === newArray[i + 1]) {
        mergeElementsArray.push(2 * newArray[i]);
        newScore += 2 * newArray[i];
        skip = true;
      } else {
        mergeElementsArray.push(newArray[i]);
      }
    }
    while (mergeElementsArray.length < row.length) mergeElementsArray.push(0);
    return mergeElementsArray;
  });

  return {
    updatedLeftBoard: updatedBoard,
    addScore: newScore,
  };
};

export const moveRight = (board) => {
  const reverseBoard = board?.map((row) => row.reverse());
  const { updatedLeftBoard, addScore } = moveLeft(reverseBoard);
  const updatedRightBoard = updatedLeftBoard.map((row) => row.reverse());
  return { updatedRightBoard, addScore };
};

// const transposeMatrix = (board) => {
//   return board?.[0].map((_, colIndex) => board.map((row) => row[colIndex]));
// };

const transposeMatrix = (board) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = i + 1; j < board.length; j++) {
      let temp = board[i][j];
      board[i][j] = board[j][i];
      board[j][i] = temp;
    }
  }
  return board;
};

export const moveUp = (board) => {
  const transposedGrid = transposeMatrix(board);
  const { updatedLeftBoard, addScore } = moveLeft(transposedGrid);
  const updatedUpBoard = transposeMatrix(updatedLeftBoard);
  return { updatedUpBoard, addScore };
};

export const moveDown = (board) => {
  const transposedGrid = transposeMatrix(board);
  const { updatedRightBoard, addScore } = moveRight(transposedGrid);
  const updatedDownBoard = transposeMatrix(updatedRightBoard);
  return { updatedDownBoard, addScore };
};

export const hasWon = (board) => {
  return board.some((row) => row.includes(2048));
};

export const isEmptyCellsLeft = (board) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === 0) return true;

      if (j < board.length - 1 && board[i][j] === board[i][j + 1]) return true;
      if (i < board.length - 1 && board[i][j] === board[i + 1][j]) return true;
    }
  }
  return false;
};
