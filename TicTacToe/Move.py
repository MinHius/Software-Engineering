import Check
import Board # type: ignore
import random
import math

# Khai báo biến global.
x = 'X'
o = 'O'
first = True # Theo dõi lượt đầu kết thức hay chưa.
count = 0 # Số lần random nước đi của AI để giảm khối lượng tính toán.

# Hàm di chuyển của người chơi.
def Player(board, size, turn): 

    if turn == 1 or turn == 0:
        if turn == 1:
            a, b = input("Player 1's turn: ").split()
        if turn == 0:
            a, b = input("Player's turn: ").split() 
            
        check = validMove(a, b, board, size, turn)
        
        if check == True:
            Board.display(board, size)
            a = int(a)
            b = int(b)
            board[a * size + b] = x
        else:
            Player(board, size, turn)
        

    elif turn == 2:
        a, b = input("Player 2's turn: ").split() 
        check = validMove(a, b, board, size, turn)  
        
        if check == True:
            Board.display(board, size) 
            a = int(a)
            b = int(b)
            board[a * size + b] = o
        else:
            Player(board, size, turn)
            
            
    print('')
        

          
# Hàm di chuyển của AI.        
def AI(board, size):  
    global first  
    global count

    if first == True or count < size - 2 and size >= 4:
        random_first_move = random.randint(0, size - 1) # nước đi đầu của AI là random.
        z = random_first_move
        
        if board[z * size + z] == '-':
            print("AI's turn:")
            board[z * size + z] = o
            Board.display(board, size)
            print('')
            
            count = count + 1
            first = False
            
        else:
            AI(board, size)
            
    else:
        print("AI's turn:")
        AIMove = bestMove(board, size) # từ nước thứ 2 sẽ là nước đi tính toán.
        board[AIMove[0] * size + AIMove[1]] = o
        Board.display(board, size)
        print('')
        
        
        
    
        
        
        
# Hàm tính nước di chuyển tốt nhất cho AI.       
def bestMove(board, size):
    bestScore = -(math.inf)
    bestMove = None
    
    for l in range(size):
        for k in range(size):
            if board[l * size + k] == '-':
                # Make a copy of the board
                new_board = board[:]
                new_board[l * size + k] = o
                score = minimax(new_board, 0, False, -(math.inf), math.inf, size)
                if score > bestScore:
                    bestScore = score
                    bestMove = (l, k)
                    
    return bestMove

    
                
# Thuật toán Minimax Alpha Beta Pruning.
def minimax(board, depth, isMaxing, alpha, beta, size):
    result = Check.checkState(board, size)
    if result != None:
        return result
    
    if isMaxing:
        bestScore = -(math.inf)
        for l in range(size):
            for k in range(size):
                if board[l * size + k] == '-':
                    board[l * size + k] = o
                    score = minimax(board, depth + 1, False, alpha, beta, size)
                    board[l * size + k] = '-'  # Revert back the move
                    bestScore = max(score, bestScore)
                    alpha = max(alpha, score) 
                    if beta <= alpha:
                        break
        return bestScore
    
    else:
        bestScore = math.inf
        for l in range(size):
            for k in range(size):
                if board[l * size + k] == '-':
                    board[l * size + k] = x
                    score = minimax(board, depth + 1, True, alpha, beta, size)
                    board[l * size + k] = '-'  # Revert back the move
                    bestScore = min(score, bestScore) 
                    beta = min(beta, score) 
                    if beta <= alpha:
                        break
        return bestScore
           
        
    
def validMove(a, b, board, size, turn):
    a = int(a)
    b = int(b)
    number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    if a in number and b in number:
        
        if ((a < 0 and b < 0) or (a > size - 1 and b > size - 1)):
            print('Invalid move.')
            return False
        
        elif board[a * size + b] != '-':
            print('Invalid move.')
            return False
        
        else:
            return True
        
    else:
        print('Move input should be a pair of integer!')
        return False
    
        