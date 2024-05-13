var turn = 0;
var currentPlayer = "X";
document.addEventListener("DOMContentLoaded", function() {
    var socketio = io()  // coi nhu la connect socket
    const cells = document.querySelectorAll('.gameplay__card');
    let finished = true
    let boardSize = Math.sqrt(cells.length);
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
            socketio.emit('x_win')
            finished = true
            resetBoard(cells);
        } else if (winner === 1) {
            alert("Player O wins!");
            socketio.emit('o_win')
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
    // Check diagonal
    let n = boardSize
    for(let i = 0; i < n - 4; i++) {
        for(let j = 0; j < n - 4; j++) {
            if (cells[i * n + j].textContent === cells[(i + 1) * n + (j + 1)].textContent && cells[(i + 2) * n + (j + 2)].textContent === cells[(i + 3) * n + (j + 3)].textContent && cells[(i + 4) * n + (j + 4)].textContent === cells[i * n + j].textContent && cells[i * n + j].textContent === 'X')
                return -1;
            else {
                continue;
            }
        }
    }
    for(let i = 0; i < n - 4; i++) {
        for(let j = 0; j < n - 4; j++) {
            if (cells[i * n + j].textContent === cells[(i + 1) * n + (j + 1)].textContent && cells[(i + 2) * n + (j + 2)].textContent === cells[(i + 3) * n + (j + 3)].textContent && cells[(i + 4) * n + (j + 4)].textContent === cells[i * n + j].textContent && cells[i * n + j].textContent === 'O')
                return 1;
            else {
                continue;
            }
        }
    }
    for(let i = 0; i < n - 4; i++) {
        for(let j = 4; j < n; j++) {
            if (cells[i * n + j].textContent === cells[(i + 1) * n + (j - 1)].textContent && cells[(i + 2) * n + (j - 2)].textContent === cells[(i + 3) * n + (j - 3)].textContent && cells[(i + 4) * n + (j - 4)].textContent === cells[i * n + j].textContent && cells[i * n + j].textContent === 'X')
                return -1;
            else {
                continue;
            }
        }
    }
    for(let i = 0; i < n - 4; i++) {
        for(let j = 4; j < n; j++) {
            if (cells[i * n + j].textContent === cells[(i + 1) * n + (j - 1)].textContent && cells[(i + 2) * n + (j - 2)].textContent === cells[(i + 3) * n + (j - 3)].textContent && cells[(i + 4) * n + (j - 4)].textContent === cells[i * n + j].textContent && cells[i * n + j].textContent === 'O')
                return 1;
            else {
                continue;
            }
        }
    }
    return checkCol(cells, n)
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