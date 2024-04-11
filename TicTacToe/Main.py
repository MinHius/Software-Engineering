import Move 
import Board 
import Check

# Khai báo biến.
size = 0 # Kích thước ván chơi.
done = False

# Hàm bắt đầu trò chơi.
def play():  
    global size
    global done
    
    # Khởi tạo ván chơi.
    size = int(input('Nhap kich thuoc bang: '))
    board = Board.newBoard(size)
    
    Board.display(board, size) 
    
    # Chơi theo lượt.
    while done != True:
        Move.Player(board, size)
        if Check.final(board, size): 
            done = True
            x = int(input('Choi lai khong? 0-Khong, 1-Co: ')) 
            if x == 1:
                done = False
                play()   
            else:  
                end()
        Move.AI(board, size)
        if Check.final(board, size): 
            done = True
            x = int(input('Choi lai khong? 0-Khong, 1-Co: ')) 
            if x == 1:
                done = False
                play()   
            else:  
                end()
        

# Hàm kết thúc trò chơi.
def end():
    print("See you later!") 
    initiate()  
    
       
# Bắt đầu chạy chương trình.
def initiate():
    y = int(input('Choi khong? 0-Khong, 1-Co: '))
    if y == 1: 
        play()
    else:
        initiate()

# Luôn chạy.  
initiate()       
