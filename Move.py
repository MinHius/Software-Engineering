import Check
import Board # type: ignore
import random
import math

x = 'X'
o = 'O'
first = True
count = 0

def Player(board, n): 
    
    if Check.final(board, n):
        return True
    
    else:   
        x1, y1 = input("Player's turn: ").split()
        x1 = int(x1)
        y1 = int(y1)
        
        board[x1 * n + y1] = x
        Board.display(board, n)
        AI(board, n)
       
          
        
def AI(board, n):  
    global first  
    global count
        
    if first == True or count <= 2 and n >= 4:
        random_first_move = random.randint(0, n - 1) # nước đi đầu của AI là random.
        z = random_first_move
        if board[z * n + z] == '-':
            print("AI's turn:")
            board[z*n + z] = o
            Board.display(board, n)
            
            first = False
            count = count + 1
            if Check.final(board, n):
                return True
            
            else: 
                Player(board, n)
        else:
            AI(board, n)
            
    else:
        AIMove = bestMove(board, n) # từ nước thứ 2 sẽ là nước đi tính toán.
        board[AIMove[0]*n + AIMove[1]] = o
        
        print("AI's turn:")
        Board.display(board, n)
        Player(board, n)
    
        
        
        
        
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
     
        
    
            