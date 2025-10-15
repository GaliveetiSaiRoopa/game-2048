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

const transposeMatrix = (board) => {
  return board?.[0].map((_, colIndex) => board.map((row) => row[colIndex]));
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
