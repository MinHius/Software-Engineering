

def newBoard(n):
    board = ['-']*(n*n)
    return board

def display(board, n):
    for i in range(0, len(board), n):
        values = [str(z[0]) for z in board[i:i+n]]
        print(' '.join(values))
        
        