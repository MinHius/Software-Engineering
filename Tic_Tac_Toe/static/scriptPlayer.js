var turn = 0;
var currentPlayer = "X";
document.addEventListener("DOMContentLoaded", function() {
    var socketio = io()  // coi nhu la connect socket
    const cells = document.querySelectorAll('.gameplay__card');
    let finished = true
    socketio.on('update_info', function(data) {
        document.getElementById('hostName').innerHTML = data.host_name
        document.getElementById('joinName').innerHTML = data.join_name
        console.log("ok")
    })
    socketio.on('moveMade', function(data) {
        const position = data.position
        const content = data.content
        const playerTurn = data.playerTurn
        const icon = data.icon
        turn = data.turn

        cells[position].textContent = content
        cells[position].classList.add(icon)
        currentPlayer = playerTurn
        // Check for a winner
        let winner = checkState(cells);
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
    })
    // Add click event listener to each cell
    cells.forEach((gameplay__card, index) => {
        gameplay__card.addEventListener('click', function(event) {
            // Check if the cell is empty
            if (this.textContent === "X" || this.textContent === "O") {
                alert("Invalid move!")
                finished = true
            }

            if (!this.textContent) {
                finished = false
                // Start the game tracker               
                const data= {
                    position: index,
                    content: (turn % 2 === 0) ? "X" : "O",
                    playerTurn: currentPlayer === "X" ? "O" : "X",
                    turn: turn,
                    icon: (turn % 2 === 0) ? 'x-mark' : 'o-mark'
                }
                socketio.emit('makeMove', data)
            } 
        });
    });
});

// Function to check for a winner
function checkState(cells) {
    let boardSize = Math.sqrt(cells.length);
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
    if (j1 + 1 === 5) {
        return -1;
    }

    for (let i = 0; i < boardSize - 1; i++) {
        if (cells[i * boardSize + i].textContent === cells[(i + 1) * (boardSize + 1)].textContent && cells[i * boardSize + i].textContent === "O" && cells[(i + 1) * (boardSize + 1)].textContent === "O") {
            j2++;
        }
    }
    if (j2 + 1 === 5) {
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
    if (k1 + 1 === 5) {
        return -1;
    }
    for (let i = 0; i < boardSize - 1; i++) {
        if (cells[(i + 1) * (boardSize - 1)].textContent === cells[(i + 2) * (boardSize - 1)].textContent && cells[(i + 1) * (boardSize - 1)].textContent === "O" && cells[(i + 2) * (boardSize - 1)].textContent === "O") {
            k2++;
        }
    }
    if (k2 + 1 === 5) {
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
        if (i + 1 === 5) {
            return -1;
        } else if (j + 1 === 5) {
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
        if (i + 1 === 5) {
            return -1;
        } else if (j + 1 === 5) {
            return 1;
        } else {
            i = 0;
            j = 0;
        }
    }
    return checkTie(cells, boardSize);
}

// Function to check for a tie
function checkTie(cells, boardSize) {
    for (let i = 0; i < cells.length; i++) {
        if (!cells[i].textContent) {
            return;
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

