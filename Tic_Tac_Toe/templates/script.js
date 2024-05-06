const X_CLASS = 'x';
const O_CLASS = 'o';

let currentPlayerMark = O_CLASS;
let isVsPlayer = false;
let oTurn = false;

let xWin = 0;
let oWin = 0;
let tie = 0;

let winningArry;
let currentClass;

// CASHING DOM ELEMENTS
const vsCpuBtn = document.getElementById('vs-cpu');
const vsPlayerBtn = document.getElementById('vs-player');
const restartBtn = document.getElementById('restart-btn');

const gameStartEl = document.getElementById('game-start');
const gamePlayEl = document.getElementById('gameplay');
const gameMarksEl = document.querySelectorAll('#game-start-marks div');
const gameBoardEl = document.getElementById('gameplay-board');

const modalEl = document.getElementById('modal');
const backdropEl = document.getElementById('backdrop');

const cells = document.querySelectorAll('.gameplay__card');
const opponentMessage = document.getElementById('opponent-message');

function setGameModeHandler() {
	const btnClickedId = this.id;

	if (btnClickedId === 'vs-player') isVsPlayer = true;

	changeDomLayout(gameStartEl, 'd-block', 'd-none');
	changeDomLayout(gamePlayEl, 'd-none', 'd-grid');
	startGame();
}

function changeDomLayout(domEl, display1, display2) {
	domEl.classList.remove(display1);
	domEl.classList.add(display2);
}

function startGame() {
	setBoardHoverClass();
	setScoreBoard();
	setTurn();

	if (!isVsPlayer) playVsCpu();
	else playVsPlayer();
}

function setBoardHoverClass() {
	if (oTurn) {
		gameBoardEl.classList.remove(O_CLASS);
		gameBoardEl.classList.add(X_CLASS);
	} else {
		gameBoardEl.classList.remove(X_CLASS);
		gameBoardEl.classList.add(O_CLASS);
	}
}

function setScoreBoard() {
	const xWinEl = document.getElementById('x-win');
	const tieEl = document.getElementById('tie');
	const oWinEl = document.getElementById('o-win');

	xWinEl.innerHTML = `${
		isVsPlayer
			? 'X (P1)'
			: currentPlayerMark === X_CLASS
			? 'X (CPU)'
			: 'X (You)'
	} <span id="x-win-inner" class="gameplay__highlight">${xWin}</span>`;
	tieEl.innerHTML = `Ties <span id="tie-inner" class="gameplay__highlight">${tie}</span>`;
	oWinEl.innerHTML = `${
		isVsPlayer
			? 'O (P2)'
			: currentPlayerMark === O_CLASS
			? 'O (You)'
			: 'O (CPU)'
	} <span id="o-win-inner" class="gameplay__highlight">${oWin}</span>`;
}

function setTurn() {
	const turnEl = document.getElementById('gameplay-turn');

	turnEl.innerHTML = `<svg class="gameplay__turn-icon">
											<use xlink:href="./assets/images/SVG/icon-${
												oTurn ? O_CLASS : X_CLASS
											}-default.svg#icon-${
		oTurn ? O_CLASS : X_CLASS
	}-default"></use>
											</svg> &nbsp; Turn`;
}

function playVsCpu() {
	if (currentPlayerMark === O_CLASS) getCpuChoice();
	// CPU starts first
	else getPlayerChoice(); // Player starts first
}

function playVsPlayer() {
	getPlayerChoice();
}

function getEmptyCells() {
	const cellsArray = Array.from(cells);

	return cellsArray.filter(
		cell => !cell.classList.contains('x') && !cell.classList.contains('o')
	);
}

function setCpuBestMove() {
	const emptyCells = getEmptyCells();
	return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

async function getCpuChoice() {
	currentClass = oTurn ? O_CLASS : X_CLASS;

	gameBoardEl.classList.remove(O_CLASS);
	gameBoardEl.classList.remove(X_CLASS);

	cells.forEach(cell => cell.removeEventListener('click', playHandler));

	changeDomLayout(opponentMessage, 'd-none', 'd-block');

	await new Promise(resolve => {
		setTimeout(() => {
			placeMark(setCpuBestMove(), currentClass);
			changeDomLayout(opponentMessage, 'd-block', 'd-none');
			setGameLogic();
			resolve('resolved');
		}, 2000);
	});

	getPlayerChoice();
}

function getPlayerChoice() {
	cells.forEach(cell => {
		if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
			cell.addEventListener('click', playHandler, { once: true });
		}
	});
}

function placeMark(cell, mark) {
	cell.classList.add(mark);
}

function setGameLogic() {
	if (checkWin(currentClass)) {
		endGame(false);
	} else if (isDraw()) {
		endGame(true);
	} else {
		swapTurns();
		setBoardHoverClass();
	}
}

function playHandler(event) {
	const cell = event.target;
	currentClass = oTurn ? O_CLASS : X_CLASS;

	placeMark(cell, currentClass);
	setGameLogic();

	if (!isVsPlayer && !checkWin(currentClass) && !isDraw()) getCpuChoice();
}

function checkWin(currentClass) {
	return WINNING_COMBINATIONS.some(combination => {
		return combination.every((element, index, array) => {
			let condition = cells[element].classList.contains(currentClass);
			if (condition) winningArry = array;
			return condition;
		});
	});
}

function isDraw() {
	return [...cells].every(cell => {
		return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
	});
}

function configureModalButtons() {
	const nextRoundBtn = document.getElementById('next-round');
	const quitBtn = document.getElementById('quit');

	nextRoundBtn.addEventListener('click', setNextRound);
	quitBtn.addEventListener('click', () => {
		location.reload();
	});
}

function endGame(draw) {
	const tieInnerEl = document.getElementById('tie-inner');

	if (draw) {
		tie++;
		tieInnerEl.innerText = tie;

		changeDomLayout(backdropEl, 'd-none', 'd-block');
		changeDomLayout(modalEl, 'd-none', 'd-block');

		modalEl.innerHTML = `
		<h4 class="heading-lg">Round Tied</h4>

		<div class="modal__buttons">
			<button id="quit" class="btn btn--silver-small btn--small">Quit</button>
			<button id="next-round" class="btn btn--yellow-small btn--small">Next Round</button>
		</div>
		`;
	} else {
		setWinner(oTurn);
	}

	configureModalButtons();
}

function swapTurns() {
	oTurn = !oTurn;
	setTurn();
}

function setWinner() {
	const xWinInnerEl = document.getElementById('x-win-inner');
	const oWinInnerEl = document.getElementById('o-win-inner');

	if (oTurn) oWin++;
	else xWin++;

	xWinInnerEl.innerText = xWin;
	oWinInnerEl.innerText = oWin;

	winningArry.forEach(index => {
		cells[index].classList.add('win');
	});

	setTimeout(() => {
		changeDomLayout(backdropEl, 'd-none', 'd-block');
		changeDomLayout(modalEl, 'd-none', 'd-block');
	}, 500);

	modalEl.innerHTML = `<h4 class="heading-xs">${
		isVsPlayer
			? oTurn
				? 'Player 2 Win'
				: 'Player 1 win'
			: oTurn && currentPlayerMark === 'o'
			? 'You won'
			: !oTurn && currentPlayerMark === 'x'
			? 'You won'
			: 'oh No, you lost...'
	}</h4>
	<div class="modal__result">
		<svg class="modal__icon">
			<use xlink:href="./assets/images/SVG/icon-${
				oTurn ? O_CLASS : X_CLASS
			}.svg#icon-${oTurn ? O_CLASS : X_CLASS}"></use>
		</svg>
		<h1 class="heading-lg heading-lg--${
			oTurn ? 'yellow' : 'blue'
		}">takes the round</h1>
	</div>

	<div class="modal__buttons">
		<button id="quit" class="btn btn--silver-small btn--small">Quit</button>
		<button id="next-round" class="btn btn--yellow-small btn--small">Next Round</button>
	</div>`;
}

function setNextRound() {
	oTurn = false;

	changeDomLayout(modalEl, 'd-block', 'd-none');
	changeDomLayout(backdropEl, 'd-block', 'd-none');

	cells.forEach(cell => {
		cell.classList.remove(X_CLASS);
		cell.classList.remove(O_CLASS);
		cell.classList.remove('win');
		cell.removeEventListener('click', playHandler);
	});

	startGame();
}

function restartHandler() {
	modalEl.innerHTML = `<h1 class="heading-lg">Restart Game</h1>

	<div class="modal__buttons">
		<button id="btn-cancel" class="btn btn--silver-small btn--small">
			No, Cancel
		</button>
		<button id="btn-restart" class="btn btn--yellow-small btn--small">
			Yes, Restart
		</button>
	</div>`;

	const restartBtn = document.getElementById('btn-restart');
	const cancelBtn = document.getElementById('btn-cancel');

	changeDomLayout(modalEl, 'd-none', 'd-block');

	restartBtn.addEventListener('click', setNextRound);
	cancelBtn.addEventListener('click', () => {
		changeDomLayout(modalEl, 'd-block', 'd-none');
	});
}

function getUserChoiceHandler() {
	currentPlayerMark = this.id;

	this.classList.add('selected');

	if (this.nextElementSibling)
		this.nextElementSibling.classList.remove('selected');
	else this.previousElementSibling.classList.remove('selected');
}

gameMarksEl.forEach(mark => {
	mark.addEventListener('click', getUserChoiceHandler);
});

restartBtn.addEventListener('click', restartHandler);
vsCpuBtn.addEventListener('click', setGameModeHandler);
vsPlayerBtn.addEventListener('click', setGameModeHandler);


// Function to check the diagonal for a winner
function checkDiag(cells, boardSize) {
    // Check the main diagonal
    let j1 = 0;
    let j2 = 0;
    for (let i = 0; i < boardSize - 1; i++) {
        if (cells[i * boardSize + i].textContent === cells[(i + 1) * (boardSize + 1)].textContent && cells[i * boardSize + i].textContent === "X" && cells[(i + 1) * (boardSize + 1)].textContent === "X") {
            j1++;
        }
    }
    if (j1 + 1 === boardSize) {
        return -1;
    }

    for (let i = 0; i < boardSize - 1; i++) {
        if (cells[i * boardSize + i].textContent === cells[(i + 1) * (boardSize + 1)].textContent && cells[i * boardSize + i].textContent === "O" && cells[(i + 1) * (boardSize + 1)].textContent === "O") {
            j2++;
        }
    }
    if (j2 + 1 === boardSize) {
        return 1;
    }
    // Check the secondary diagonal
    k1 = 0
    k2 = 0
    for (let i = 0; i < boardSize - 1; i++) {
        if (cells[(i + 1) * (boardSize - 1)].textContent === cells[(i + 2) * (boardSize - 1)].textContent && cells[(i + 1) * (boardSize - 1)].textContent === "X" && cells[(i + 2) * (boardSize - 1)].textContent === "X") {
            k1++;
        }
    }
    if (k1 + 1 === boardSize) {
        return -1;
    }
    for (let i = 0; i < boardSize - 1; i++) {
        if (cells[(i + 1) * (boardSize - 1)].textContent === cells[(i + 2) * (boardSize - 1)].textContent && cells[(i + 1) * (boardSize - 1)].textContent === "O" && cells[(i + 2) * (boardSize - 1)].textContent === "O") {
            k2++;
        }
    }
    if (k2 + 1 === boardSize) {
        return 1;
    }
    return checkCol(cells, boardSize);
}

// Function to check columns for a winner
function checkCol(cells, boardSize) {
    let i = 0;
    let j = 0;
    for (let k = 0; k < boardSize; k++) {
        for (let l = 0; l < boardSize - 1; l++) {
            if (cells[l * boardSize + k].textContent === cells[(l + 1) * boardSize + k].textContent && cells[l * boardSize + k].textContent === 'X' && cells[(l + 1) * boardSize + k].textContent === 'X') {
                i++;
            }
            if (cells[l * boardSize + k].textContent === cells[(l + 1) * boardSize + k].textContent && cells[l * boardSize + k].textContent === 'O' && cells[(l + 1) * boardSize + k].textContent === 'O') {
                j++;
            }
        }
        if (i + 1 === boardSize) {
            return -1;
        } else if (j + 1 === boardSize) {
            return 1;
        } else {
            i = 0;
            j = 0;
        }
    }
    return checkRow(cells, boardSize);
}

// Function to check rows for a winner
function checkRow(cells, boardSize) {
    let i = 0;
    let j = 0;
    for (let l = 0; l < boardSize; l++) {
        for (let k = 0; k < boardSize - 1; k++) {
            if (cells[l * boardSize + k].textContent === cells[l * boardSize + k + 1].textContent && cells[l * boardSize + k].textContent === 'X' && cells[l * boardSize + k + 1].textContent === 'X') {
                i++;
            }
            if (cells[l * boardSize + k].textContent === cells[l * boardSize + k + 1].textContent && cells[l * boardSize + k].textContent === 'O' && cells[l * boardSize + k + 1].textContent === 'O') {
                j++;
            }
        }
        if (i + 1 === boardSize) {
            return -1;
        } else if (j + 1 === boardSize) {
            return 1;
        } else {
            i = 0;
            j = 0;
        }
    }
    return checkTie(cells, boardSize);
}

// Function to check for a tie
function checkTie(cells) {
    for (let i = 0; i < cells.length; i++) {
        if (!cells[i].textContent) {
            return;        // van con o chua dien 
        }
    }
    return 0;
}

// Function to reset the game board
function resetBoard(cells) {
    cells.forEach(cell => {
        cell.textContent = "";
    });
}

// Function to perform AI move
function performRandomAIMove(cells) {
    // Find available empty cells
    const emptyCells = [...cells].filter(cell => !cell.textContent);
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // Change the content of the selected cell to "O"
    randomCell.textContent = "O";

    finished = false
    // Check for a winner
    let winner = checkState(boardSize, cells);
    // Determine the result
    if (winner === -1) {
        alert("Player X wins!");
        resetBoard(cells);
    } else if (winner === 1) {
        alert("Player O wins!");
        resetBoard(cells);
    } else if (winner === 0) {
        alert("It's a tie!");
        resetBoard(cells);
    } 
}


// Function to perform AI move using Minimax algorithm
function performMinimaxAIMove(cells, boardSize) {
    move = bestMove(cells, boardSize);
    let cellIndex = move[0] * boardSize + move[1];
    // Change the content of the selected cell to "O"
    cells[cellIndex].textContent = "O";
    

    // Check for a winner
    winner = checkState(boardSize, cells);
    // Determine the result
    if (winner === -1) {
        alert("Player X wins!");
        finished = true
        resetBoard(cells);
    } else if (winner === 1) {
        alert("Player O wins!");
        finished = true
        resetBoard(cells);
    } else if (winner === 0) {
        alert("It's a tie!");
        finished = true
        resetBoard(cells);
    } 
}


// Function to find the best move for AI
function bestMove(cells, boardSize) {
    let bestScore = -Infinity;
    let bestMove = null;
    // Convert NodeList to array
    cells = Array.from(cells);

    for (let l = 0; l < boardSize; l++) {
        for (let k = 0; k < boardSize; k++) {
            if (cells[l * boardSize + k].textContent === '') {
                // Make a copy of the board
                let newCells = cells.map(cell => {
                    const newCell = document.createElement('div');
                    newCell.textContent = cell.textContent;
                    return newCell;
                });  // co 2 loai copy la: shallow vs deep, cai nay la deep, thay doi o copy k thay doi o origin
                newCells[l * boardSize + k].textContent = 'O';
                let score = minimax(newCells, 0, false, -Infinity, Infinity, boardSize);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = [l, k]
                }
            }
        }
    }
    return bestMove
}

// Minimax algorithm with Alpha-Beta Pruning
function minimax(Cells, depth, isMaxing, alpha, beta, boardSize) {

    let result = checkState(boardSize, Cells);
    if (result !== undefined) {    // luc dau la null nma trong js thi cai lenh return; no tra ve undefined
        return result;         // kha nang la 2 cai nay
    }
    if (isMaxing) {
        let bestScore = -Infinity;
        for (let l = 0; l < boardSize; l++) {
            for (let k = 0; k < boardSize; k++) {
                if (Cells[l * boardSize + k].textContent === "") {
                    Cells[l * boardSize + k].textContent = 'O';
                    let score = minimax(Cells, depth + 1, false, alpha, beta, boardSize);
                    Cells[l * boardSize + k].textContent = ''; // Revert back the move
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, score); 
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        } 
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let l = 0; l < boardSize; l++) {
            for (let k = 0; k < boardSize; k++) {
                if (Cells[l * boardSize + k].textContent === "" ) {
                    Cells[l * boardSize + k].textContent = 'X';
                    let score = minimax(Cells, depth + 1, true, alpha, beta, boardSize);
                    Cells[l * boardSize + k].textContent = ''; // Revert back the move
                    bestScore = Math.min(score, bestScore); 
                    beta = Math.min(beta, score); 
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        return bestScore;
    }
}


