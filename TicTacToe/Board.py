
# Tạo ván chơi mới.
def newBoard(size):
    board = ['-'] * (size * size)
    return board

# Hiển thị ván chơi.
def display(board, size):
    for i in range(0, len(board), size):
        values = [str(z[0]) for z in board[i:i + size]]
        print(' '.join(values))
        
        