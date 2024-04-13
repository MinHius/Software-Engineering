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
    size = int(input('Nhap kich thuoc bang: '))
    board = Board.newBoard(size)
    Board.display(board, size) 
    
    # Chế độ người vs máy.
    if mode == 0:
        # Chơi theo lượt.
        while done != True:
            Move.Player(board, size, 0)
            if Check.final(board, size, 0, 0): 
                done = True
                x = int(input('Play again? 0 - No, 1 - Yes: ')) 
                if x == 1:
                    done = False
                    initiate()   
                else:  
                    end()
                    
            Move.AI(board, size)
            if Check.final(board, size, 0, 1): 
                done = True
                x = int(input('Play again? 0 - No, 1 - Yes: ')) 
                if x == 1:
                    done = False
                    initiate()   
                else:  
                    end()
                    
                    
    if mode == 1:
        # Chơi theo lượt.
        while done != True:
            Move.Player(board, size, 1)
            if Check.final(board, size, 1, 0): 
                done = True
                x = int(input('Play again? 0 - No, 1 - Yes: ')) 
                if x == 1:
                    done = False
                    initiate()   
                else:  
                    end()
                    
            Move.Player(board, size, 2)
            if Check.final(board, size, 1, 1): 
                done = True
                x = int(input('Play again? 0 - No, 1 - Yes: ')) 
                if x == 1:
                    done = False
                    initiate()   
                else:  
                    end()
        

# Hàm kết thúc trò chơi.
def end():
    print("Tạm biệt!") 
    initiate()  
    
       
# Bắt đầu chạy chương trình.
def initiate():
    y = int(input('Choose game mode: 0 - Player vs AI, 1 - Player vs Player: '))
    play(y)


# Luôn chạy.  
initiate()       
