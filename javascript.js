function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropxo = (column, row, player) => {
    if (board[row][column].getValue() === "") {
      board[row][column].addxo(player);
      return { row, column }; // ✅ return result
    }
    return null;
  };

  const printBoard = () => {
    const boardWithValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithValues);
  };

  return { getBoard, dropxo, printBoard };
}

function Cell() {
  let value = "";

  const addxo = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addxo,
    getValue,
  };
}

function GameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2"
) {
  let winner = null;

  const board = GameBoard();

  const players = [
    { name: playerOneName, token: "x" },
    { name: playerTwoName, token: "o" },
  ];

  let activePlayer = players[0];

  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;
  const getWinner = () => winner;

  const checkWin = ({ row, column }) => {
    const directions = [
      [
        [0, 1],
        [0, -1],
      ],
      [
        [1, 0],
        [-1, 0],
      ],
      [
        [1, 1],
        [-1, -1],
      ],
      [
        [1, -1],
        [-1, 1],
      ],
    ];
    const boardData = board.getBoard();
    const playerToken = activePlayer.token;

    for (const [dir1, dir2] of directions) {
      let count = 1;
      for (const [dx, dy] of [dir1, dir2]) {
        let r = row + dx,
          c = column + dy;
        while (
          r >= 0 &&
          r < 3 &&
          c >= 0 &&
          c < 3 &&
          boardData[r][c].getValue() === playerToken
        ) {
          count++;
          r += dx;
          c += dy;
        }
      }
      if (count >= 3) return true;
    }
    return false;
  };

  const checkTie = () => {
    return board
      .getBoard()
      .flat()
      .every((cell) => cell.getValue() !== "");
  };

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (column, row) => {
    const result = board.dropxo(column, row, activePlayer.token);
    if (!result) return;

    if (checkWin(result)) {
      winner = activePlayer;
    } else if (checkTie()) {
      winner = "tie";
    } else {
      switchTurn();
    }
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getWinner,
    printBoard: board.printBoard,
  };
}

function ScreenController() {
  let game;
  const gameDiv = document.querySelector(".game");
  const playerTurnDiv = document.querySelector(".turn");
  const winnerDiv = document.querySelector(".winner");
  const boardDiv = document.querySelector(".board");
  const restartBtn = document.querySelector(".restart");
  const startForm = document.querySelector("form");
  const formDiv = document.querySelector(".form");

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    const winner = game.getWinner();

    if (winner) {
      if (winner === "tie") {
        winnerDiv.textContent = "It's a tie!";
      } else {
        winnerDiv.textContent = `${winner.name} wins!`;
      }
      playerTurnDiv.textContent = "";
      restartBtn.style.display = "block";
    }

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name} (${activePlayer.token})'s turn...`;

    // Render board squares
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = columnIndex;
        cellButton.dataset.row = rowIndex; // set row here!
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    // Make sure I've clicked a column and not the gaps in between
    if (!selectedColumn || !selectedRow) return;

    game.playRound(Number(selectedColumn), Number(selectedRow));
    updateScreen();
  }

  function handleStartGame(e) {
    e.preventDefault();
    const p1 = document.querySelector("#player1").value || "Player 1";
    const p2 = document.querySelector("#player2").value || "Player 2";
    game = GameController(p1, p2);
    formDiv.style.display = "none";
    gameDiv.style.display = "block";
    updateScreen();
  }

  // Initial render
  //updateScreen();

  function restartGame() {
    location.reload();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);
  startForm.addEventListener("submit", handleStartGame);
  restartBtn.addEventListener("click", restartGame);

  // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

const h1=document.querySelector("h1");
h1.addEventListener("mouseover",()=>{
    h1.textContent="Tic. Tac. Gotcha!";
});
h1.addEventListener("mouseout",()=>{
    h1.textContent="Tic-Tac-Toe";
});

ScreenController();
