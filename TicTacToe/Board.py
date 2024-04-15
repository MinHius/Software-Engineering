
# Kiểm soát ngoại lệ kích thước.
def validSize(mode, size):
    if mode == 0 and size != 3:
        x = input('This gamemode do not support size larger than 3, but the other gamemode does. Do you want to switch gamemode? 0 for No, 1 for Yes: ')
        if x == '1':
            return 'switch'
        elif x == '0':
            return 'again'
        else:
            print('Invalid input!')
            validSize(mode, size)

    elif mode == 1 and size < 3 or size > 6:
        return 'again' 
    
    else:
        return 'accepted'
    
    
# Tạo ván chơi mới.
def newBoard(size):
    board = ['-'] * (size * size)
    return board

# Hiển thị ván chơi.
def display(board, size):
    for i in range(0, len(board), size):
        values = [str(z[0]) for z in board[i:i + size]]
        print(' '.join(values))