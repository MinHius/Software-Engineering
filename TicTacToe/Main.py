import Move # type: ignore
import Board # type: ignore


n = 0
currentPlayer = True


def play():  
    global n
    n = int(input('Nhap kich thuoc bang: '))
    board = Board.newBoard(n)
    
    Board.display(board, n) 
    
    if Move.Player(board, n):
        x = int(input('Choi lai khong? 0-Khong, 1-Co: ')) 
        if x == 1:
            play()   
        else: 
            end() 


def end():
    print("See you later!")   
    
       


 

# Start 
play()
