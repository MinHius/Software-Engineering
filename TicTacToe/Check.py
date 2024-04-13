# Hàm update kết quả.
def final(board, size, gamemode, turn):
    final = checkState(board, size)
    
    if gamemode == 0:
        if final == None:
            return False
        elif final == 0: 
            print('Tie!')
            print('')
            return True 
        elif final == -1 and turn == 0: 
            print('Player wins!')
            print('')
            return True
        elif final == 1 and turn == 1: 
            print('AI wins!')
            print('')
            return True
        
        
    if gamemode == 1:
        if final == None:
            return False
        elif final == -1 and turn == 0: 
            print('Player 1 wins!')
            print('')
            return True
        elif final == 1 and turn == 1: 
            print('Player 2 wins!')
            print('')
            return True
        elif final == 0: 
            print('Tie!')
            print('')
            return True 


# Hàm xét các trạng thái.
def checkState(board, size):
    return checkDiag(board, size)
    
 
# Kiểm tra đường chéo.    
def checkDiag(board, size):
    # Kiểm tra đường chéo chính.
    j1 = 0
    j2 = 0
    for i in range(size - 1):
        if board[i * size + i] == board[(i + 1) * (size + 1)] and board[i * size + i] == 'X' and board[(i + 1) * (size + 1)] == 'X':
            j1 = j1 + 1
    if j1 + 1 == size:
        return -1

    
    
    for i in range(size - 1):
        if board[i * size + i] == board[(i + 1) * (size + 1)] and board[i * size + i] == 'O' and board[(i + 1) * (size + 1)] == 'O':
            j2 = j2 + 1
    if j2 + 1 == size:
        return 1

    
    # Kiểm tra đường chéo phụ.
    k1 = 0
    k2 = 0
    for i in range(size - 1):
        if board[(i + 1) * (size - 1)] == board[(i + 2) * (size - 1)] and board[(i + 1) * (size - 1)] == 'X' and board[(i + 2) * (size - 1)] == 'X':
            k1 = k1 + 1
    if k1 + 1 == size:
        return -1

    
    for i in range(size - 1):
        if board[(i + 1) * (size - 1)] == board[(i + 2) * (size - 1)] and board[(i + 1) * (size - 1)] == 'O' and board[(i + 2) * (size - 1)] == 'O':
            k2 = k2 + 1
    if k2 + 1 == size:
        return 1

    
    
    return checkCol(board, size)


# Kiểm tra cột.
def checkCol(board, size):
    i = 0
    j = 0
    for k in range(size):
        for l in range(size - 1):
            if board[l * size + k] == board[(l + 1) * size + k] and board[l * size + k] == 'X' and board[(l + 1) * size + k] == 'X':
                i = i + 1
            if board[l * size + k] == board[(l + 1) * size + k] and board[l * size + k] == 'O' and board[(l + 1) * size + k] == 'O':
                j = j + 1
        if i + 1 == size:
            return -1
        elif j + 1 == size:
            return 1
        else:
            i = 0
            j = 0

         
    return checkRow(board, size)
     

# Kiểm tra hàng.        
def checkRow(board, size):
    i = 0
    j = 0
    for l in range(size):
        for k in range(size - 1):
            if board[l * size + k] == board[l * size + 1 + k] and board[l * size + k] == 'X' and board[l * size + 1 + k] == 'X':
                i = i + 1
            if board[l * size + k] == board[l * size + 1 + k] and board[l * size + k] == 'O' and board[l * size + 1 + k] == 'O':
                j = j + 1
        if i + 1 == size:
            return -1
        elif j + 1 == size:
            return 1
        else:
            i = 0
            j = 0
        
    return checkTie(board)


# Kiểm tra hòa.
def checkTie(board):
    if '-' not in board:
        return 0

        