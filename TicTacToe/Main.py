import Move 
import Board 
import Check

# Khai báo biến.
size = 0 # Kích thước ván chơi.
done = False # Ván chơi kết thúc chưa.

# Hàm bắt đầu trò chơi.
def play(mode):  
    global size
    global done
    
    # Khởi tạo ván chơi.
    size = int(input('Insert board size: '))   
    
    valid = Board.validSize(mode, size)  # accepted / switch / again.
    
    if valid == 'accepted':  
        print("Game start!")
        board = Board.newBoard(size)
        Board.display(board, size) 
        
    elif valid == 'switch':
        print('Switched to Player vs Player') 
        play(mode + 1)
        
    elif valid == 'again' and mode == 0:
        print('Try again with "3".')
        play(mode)
        
    elif valid == 'again' and mode == 1:
        print('This gamemode do not support size smaller than 3 and larger than 6. Try again in the range of (3,6).')
        play(mode)
        
    
    # Chế độ người vs máy.
    if mode == 0:
        # Chơi theo lượt.
        while done != True:
            Move.Player(board, size, 0)
            if Check.final(board, size, 0, 0): 
                done = True
                playAgain(done)
                    
            Move.AI(board, size)
            if Check.final(board, size, 0, 1): 
                done = True
                playAgain(done)
                    
    # Chế độ người vs người.              
    if mode == 1:
        # Chơi theo lượt.
        while done != True:
            Move.Player(board, size, 1)
            if Check.final(board, size, 1, 0): 
                done = True
                playAgain(done)
                    
            Move.Player(board, size, 2)
            if Check.final(board, size, 1, 1): 
                done = True
                playAgain(done)
                
                    
        

# Hàm kết thúc trò chơi.
def end():
    print("See you later") 
    print('')
    print('')
    print('')
    print('')
    initiate()  

# Hàm chơi lại nếu muốn.
def playAgain(done):
    x = input('Play again? 0 for No, 1 for Yes: ') 
    if x == '1':
        done = False
        print('')
        initiate()   
    elif x == '0':  
        end()
    else:
        print('Invalid input.')
        playAgain(done)
    
       
# Bắt đầu chạy chương trình.
def initiate():
    print('Welcome to Tic Tac Toe!')
    y = int(input('Please choose game mode: 0 for Player vs AI, 1 for Player vs Player: '))
    if y != 0 and y != 1:
        print('Invalid input.')
        print('')
        print('')
        print('')
        print('')
        initiate()
    else:
        play(y)


# Luôn chạy.  
initiate()       
