import Check
import Board 
import random
import math

# Khai báo biến global.
x = 'X'
o = 'O'
first = True # Theo dõi lượt đi đầu.
count = 0 # Số lần random nước đi của AI.

# Hàm di chuyển của người chơi.
def Player(board, size): 
    
    if Check.final(board, size):
        return True
    
    else:   
        x1, y1 = input("Player's turn: ").split()
        x1 = int(x1)
        y1 = int(y1)
        
        board[x1 * size + y1] = x
        Board.display(board, size)
        AI(board, size)
       
          
# Hàm di chuyển của AI.        
def AI(board, size):  
    global first  
    global count
        
    if first == True or count <= size - 1 and size >= 4:
        random_first_move = random.randint(0, size - 1) # nước đi đầu của AI là random.
        z = random_first_move
        if board[z * size + z] == '-':
            print("AI's turn:")
            board[z * size + z] = o
            Board.display(board, size)
            
            first = False
            count = count + 1
            if Check.final(board, size):
                return True
            
            else: 
                Player(board, size)
        else:
            AI(board, size)
            
    else:
        AIMove = bestMove(board, size) # từ nước thứ 2 sẽ là nước đi tính toán.
        board[AIMove[0] * size + AIMove[1]] = o
        
        print("AI's turn:")
        Board.display(board, size)
        Player(board, size)
    
        
        
        
# Hàm tính nước di chuyển tốt nhất cho AI.       
def bestMove(board, n):
    bestScore = -(math.inf)
    bestMove = None
    
    for l in range(n):
        for k in range(n):
            if board[l * n + k] == '-':
                # Make a copy of the board
                new_board = board[:]
                new_board[l * n + k] = o
                score = minimax(new_board, 0, False, -(math.inf), math.inf, n)
                if score > bestScore:
                    bestScore = score
                    bestMove = (l, k)
                    
    return bestMove

    
                
# Thuật toán Minimax Alpha Beta Pruning.
def minimax(board, depth, isMaxing, alpha, beta, n):
    result = Check.checkState(board, n)
    if result != None:
        return result
    
    if isMaxing:
        bestScore = -(math.inf)
        for l in range(n):
            for k in range(n):
                if board[l * n + k] == '-':
                    board[l * n + k] = o
                    score = minimax(board, depth + 1, False, alpha, beta, n)
                    board[l * n + k] = '-'  # Revert back the move
                    bestScore = max(score, bestScore)
                    alpha = max(alpha, score) 
                    if beta <= alpha:
                        break
        return bestScore
    
    else:
        bestScore = math.inf
        for l in range(n):
            for k in range(n):
                if board[l * n + k] == '-':
                    board[l * n + k] = x
                    score = minimax(board, depth + 1, True, alpha, beta, n)
                    board[l * n + k] = '-'  # Revert back the move
                    bestScore = min(score, bestScore) 
                    beta = min(beta, score) 
                    if beta <= alpha:
                        break
        return bestScore
     
        
    
            