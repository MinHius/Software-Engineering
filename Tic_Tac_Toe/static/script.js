document.addEventListener("DOMContentLoaded", function() {
    const cells = document.querySelectorAll('.cell');
    turn = 0
    let finished = true
    let boardSize = Math.sqrt(cells.length);

    // Add click event listener to each cell
    cells.forEach((cell, index) => {
        cell.addEventListener('click', function(event) {
            // Check if the cell is empty
            if (this.textContent === "X" || this.textContent === "O") {
                alert("Invalid move!")
                finished = true
            }

            if (!this.textContent) {
                // Change the content of the cell to "X"
                this.textContent = "X"
                // Start the game tracker
                finished = false
                turn++;

            }


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

            if (!finished) {
                // Perform AI move
                if (difficulty === "easy") {
                    performRandomAIMove(cells)
                }
                else if (difficulty === "medium") {
                    performRandomAIMove(cells);
                }
                else if (difficulty === "hard") {
                    if (turn < boardSize - 1) {
                        performRandomAIMove(cells)
                    }
                    else {
                        performMinimaxAIMove(cells, boardSize)
                    }
                    
                }
            }
        });
    });
});

function checkState(boardSize, cells) {
    if (boardSize === 3) {
        return checkState3(cells);
    }
}

// Function to check for a winner
function checkState3(cells) {

    // Check the main diagonal
    if (cells[0].textContent !== '' && cells[0].textContent === cells[4].textContent && cells[4].textContent === cells[8].textContent) {
        if (cells[0].textContent === "X" && cells[4].textContent === "X" && cells[8].textContent === "X") {
            return -1;
        } else if (cells[0].textContent === "O" && cells[4].textContent === "O" && cells[8].textContent === "O") {
            return 1;
        }
    }

    // Check the secondary diagonal
    if (cells[2].textContent !== '' && cells[2].textContent === cells[4].textContent && cells[4].textContent === cells[6].textContent) {
        if (cells[2].textContent === "X" && cells[4].textContent === "X" && cells[6].textContent === "X") {
            return -1;
        } else if (cells[2].textContent === "O" && cells[4].textContent === "O" && cells[6].textContent === "O") {
            return 1;
        }
    }

    // Check the 1st col.
    if (cells[0].textContent !== '' && cells[0].textContent === cells[3].textContent && cells[3].textContent === cells[6].textContent) {
        if (cells[0].textContent === "X" && cells[3].textContent === "X" && cells[6].textContent === "X") {
            return -1;
        } else if (cells[0].textContent === "O" && cells[3].textContent === "O" && cells[6].textContent === "O") {
            return 1;
        }
    }

    // Check the 2nd col.
    if (cells[1].textContent !== '' && cells[1].textContent === cells[4].textContent && cells[4].textContent === cells[7].textContent) {
        if (cells[1].textContent === "X" && cells[4].textContent === "X" && cells[7].textContent === "X") {
            return -1;
        } else if (cells[1].textContent === "O" && cells[4].textContent === "O" && cells[7].textContent === "O") {
            return 1;
        }
    }

    // Check the 3rd col.
    if (cells[2].textContent !== '' && cells[2].textContent === cells[5].textContent && cells[5].textContent === cells[8].textContent) {
        if (cells[2].textContent === "X" && cells[5].textContent === "X" && cells[8].textContent === "X") {
            return -1;
        } else if (cells[2].textContent === "O" && cells[5].textContent === "O" && cells[8].textContent === "O") {
            return 1;
        }
    }

    // Check the 1st row.
    if (cells[0].textContent !== '' && cells[0].textContent === cells[1].textContent && cells[1].textContent === cells[2].textContent) {
        if (cells[0].textContent === "X" && cells[1].textContent === "X" && cells[2].textContent === "X") {
            return -1;
        } else if (cells[0].textContent === "O" && cells[1].textContent === "O" && cells[2].textContent === "O") {
            return 1;
        }
    }

    // Check the 2nd row.
    if (cells[3].textContent !== '' && cells[3].textContent === cells[4].textContent && cells[4].textContent === cells[5].textContent) {
        if (cells[3].textContent === "X" && cells[4].textContent === "X" && cells[5].textContent === "X") {
            return -1;
        } else if (cells[3].textContent === "O" && cells[4].textContent === "O" && cells[5].textContent === "O") {
            return 1;
        }
    }

    // Check the 3rd row.
    if (cells[6].textContent !== '' && cells[6].textContent === cells[7].textContent && cells[7].textContent === cells[8].textContent) {
        if (cells[6].textContent === "X" && cells[7].textContent === "X" && cells[8].textContent === "X") {
            return -1;
        } else if (cells[6].textContent === "O" && cells[7].textContent === "O" && cells[8].textContent === "O") {
            return 1;
        }
    }

    return checkTie(cells);
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
    // Select a random empty cell for AI move
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
    console.log(cells)

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
    console.log("check_result" , result)
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
                console.log("cell.content", Cells[l * boardSize + k].textContent, Cells)
                if (Cells[l * boardSize + k].textContent === "" ) {
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



