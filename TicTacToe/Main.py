import Move 
import Board 

# Khai báo biến.
size = 0 # Kích thước ván chơi.


# Hàm bắt đầu trò chơi.
def start():  
    global size
    size = int(input('Nhap kich thuoc bang: '))
    board = Board.newBoard(size)
    
    Board.display(board, size) 
    
    if Move.Player(board, size):
        x = int(input('Choi lai khong? 0-Khong, 1-Co: ')) 
        if x == 1:
            start()   
        else: 
            end() 

# Hàm kết thúc trò chơi.
def end():
    print("See you later!")   
    
       
# Bắt đầu chạy chương trình.
start()
