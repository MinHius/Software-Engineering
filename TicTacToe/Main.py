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
    
    valid = Board.invalidSize(mode, size)  # accepted / switch / again.
    
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
                x = int(input('Play again? 0 for No, 1 for Yes: ')) 
                if x == 1:
                    done = False
                    print('')
                    initiate()   
                else:  
                    end()
                    
            Move.AI(board, size)
            if Check.final(board, size, 0, 1): 
                done = True
                x = int(input('Play again? 0 for No, 1 for Yes: ')) 
                if x == 1:
                    done = False
                    print('')
                    initiate()   
                else:  
                    end()
                    
                    
    if mode == 1:
        # Chơi theo lượt.
        while done != True:
            Move.Player(board, size, 1)
            if Check.final(board, size, 1, 0): 
                done = True
                x = int(input('Play again? 0 for No, 1 for Yes: ')) 
                if x == 1:
                    done = False
                    print('')
                    initiate()   
                else:  
                    end()
                    
            Move.Player(board, size, 2)
            if Check.final(board, size, 1, 1): 
                done = True
                x = int(input('Play again? 0 for No, 1 for Yes: ')) 
                if x == 1:
                    done = False
                    print('')
                    initiate()   
                else:  
                    end()
        

# Hàm kết thúc trò chơi.
def end():
    print("Tạm biệt!") 
    print('')
    print('')
    print('')
    print('')
    initiate()  
    
       
# Bắt đầu chạy chương trình.
def initiate():
    print('Welcome to Tic Tac Toe!')
    y = int(input('Please choose game mode: 0 for Player vs AI, 1 for Player vs Player: '))
    play(y)


# Luôn chạy.  
initiate()       
