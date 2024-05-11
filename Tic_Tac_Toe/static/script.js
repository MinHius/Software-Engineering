document.addEventListener("DOMContentLoaded", function() {
    const cells = document.querySelectorAll('.gameplay__card');
    turn = 0
    let finished = true
    change = 1;

    // Add click event listener to each cell
    cells.forEach((gameplay__card, index) => {
        gameplay__card.addEventListener('click', function(event) {
            // Check if the cell is empty
            if (this.textContent === "X" || this.textContent === "O") {
                alert("Invalid move!")
                finished = true
            }

            if (!this.textContent) {
                // Change the content of the cell to "X"
                this.textContent = "X";
                this.classList.add('x-mark');
                // Start the game tracker
                finished = false
                turn++;


            }


            // Check for a winner
            let boardSize = Math.sqrt(cells.length);
            let winner = checkState(boardSize, cells);
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
            if (!finished) {
                // Perform AI move
                if (difficulty === "easy") {
                    performRandomAIMove(cells);

                }
                else if (difficulty === "hard") {
                    if (turn < boardSize - 1) {
                        performRandomAIMove(cells);
                    }
                    else {
                        performMinimaxAIMove(cells, boardSize);
                    }
                    
                }
            }
        });
    });
});

function checkState(boardSize, cells) {
    return checkDiag(cells, boardSize);
}

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
    cells.forEach(gameplay__card => {
        gameplay__card.textContent = "";
        if (gameplay__card.classList.contains('x-mark')) {
            gameplay__card.classList.remove('x-mark');
        } else if (gameplay__card.classList.contains('o-mark')) {
            gameplay__card.classList.remove('o-mark');
        }
    });
}

// Function to perform AI move
function performRandomAIMove(cells) {
    let boardSize = Math.sqrt(cells.length);
    // Find available empty cells
    const emptyCells = [...cells].filter(gameplay__card => !gameplay__card.textContent);
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // Change the content of the selected cell to "O"
    randomCell.textContent = "O";
    randomCell.classList.add('o-mark');

    finished = false;
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
    cells[cellIndex].classList.add('o-mark');
    
    // Check for a winner
    let winner = checkState(boardSize, cells);
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
    console.log(cells)

    for (let l = 0; l < boardSize; l++) {
        for (let k = 0; k < boardSize; k++) {
            if (cells[l * boardSize + k].textContent === '') {
                // Make a copy of the board
                let newCells = cells.map(gameplay__card => {
                    const newCell = document.createElement('div');
                    newCell.textContent = gameplay__card.textContent;
                    return newCell;
                });  // co 2 loai copy la: shallow vs deep, cai nay la deep, thay doi o copy k thay doi o origin
                newCells[l * boardSize + k].textContent = 'O';
                console.log(newCells, newCells[8].textContent)
                let score = minimax(newCells, 0, false, -Infinity, Infinity, boardSize);
                console.log("score", score)
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = [l, k]
                }
            }
        }
    }
    console.log("bestScore", bestScore)
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
                if (Cells[l * boardSize + k].textContent === '') {
                    Cells[l * boardSize + k].textContent = 'X';
                    console.log("check")
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


