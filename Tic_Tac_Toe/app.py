from flask import Flask, redirect, render_template, request, session, url_for
from flask_socketio import SocketIO, join_room, leave_room, emit, send
import random
from string import ascii_uppercase
from flask_mysqldb import MySQL
import time
import sqlite3

app = Flask(__name__)
app.config["SECRET_KEY"] = "kjdfhgkdjfhkgh"
socketio = SocketIO(app)

# Set MySQL data
connect = sqlite3.connect('database.db')
connect.execute( 
    'CREATE TABLE IF NOT EXISTS accounts(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, rankpoint INTEGER NOT NULL)')

# Dictionary to store game state for each room
rooms = {}
size_picked = 0
waiting_player_normal = {}  # dict luu cac player dang tim tran normal
waiting_player_rank = {}  # dict luu cac player dang tim tran rank
host_join = {}  # luu cac cap session id cua host va join trong rank.
host_join_normal = {}
waiting_player_custom = {}

def generate_unique_code(length):
    length = int(length)
    while True:
        code = ""
        for _ in range(length):
            code += random.choice(ascii_uppercase)
        
        if code not in rooms:
            break
    return code



# Route for the menu page
@app.route("/")
def menu():
    return render_template('main_pages/first_page.html')

# Route for mode selection page
@app.route("/mode", methods=['POST'])
def mode():
    if request.method == "POST":
        mode = request.form.get('mode')  # Get the selected mode
        if mode == "Computer":
            return render_template('main_pages/computer_mode.html')    
    return render_template('main_pages/login.html') 
    
    


@app.route("/customize", methods=['POST'])
def size():
    if request.method == "POST":
        size = request.form.get('size')  # Get the selected mode
        global size_picked
        size_picked = int(size)

        difficulty = request.form.get('difficulty')  # Get the selected mode
        if size_picked == 4:
            if difficulty != 'easy':
                return render_template('main_pages/computer_mode.html', error = "Due to computational limits, gameboards larger than 3 will be in easy mode.", size = size_picked)
            return render_template('gameboards/4x4.html', difficulty = difficulty)
        if size_picked == 5:
            if difficulty != 'easy':
                return render_template('main_pages/computer_mode.html', error = "Due to computational limits, gameboards larger than 3 will be in easy mode.", size = size_picked)
            return render_template('gameboards/5x5.html', difficulty = difficulty)
        if size_picked == 6:
            if difficulty != 'easy':
                return render_template('main_pages/computer_mode.html', error = "Due to computational limits, gameboards larger than 3 will be in easy mode.", size = size_picked)
            return render_template('gameboards/6x6.html', difficulty = difficulty)
    return render_template('gameboards/3x3.html', difficulty = difficulty)
        




@app.route("/login", methods = ['POST', 'GET'])  # chu y la minh ko lay email ma la username de unique
def login():
    message = ''
    if request.method == 'POST' and 'name' in request.form and 'password' in request.form:
        password = request.form['password']
        userName = request.form['name']
        with sqlite3.connect('database.db') as users:
            cursor = users.cursor()
            cursor.execute(
            'SELECT * FROM accounts WHERE username = ? AND password = ?',
                  (userName, password,))
            user = cursor.fetchone()
        if user:
            session['loggedin'] = True
            session['userid'] = user[0]
            session['name'] = user[1]  # chu y cai nay 
            message = 'Logged in successfully !'
            cursor.execute('SELECT rankpoint FROM accounts WHERE userName = ?', (userName,))   # select diem cua nguoi choi 
            point = cursor.fetchone()[0]      
            cursor.execute("SELECT COUNT(*) FROM accounts WHERE rankpoint > ?", (point,))  # dem so nguoi choi hon point nguoi choi bh
            higher_rank_players = cursor.fetchone()[0]
            player_rank = higher_rank_players + 1
            return render_template('main_pages/multi.html',
                                   message=message, player_point = point, userName = userName, player_rank = player_rank)
        else:
            message = 'Please enter correct username / password !'
    return render_template('main_pages/login.html',
                           message=message)

# Logout session
@app.route('/logout')
def logout():
    session.pop('loggedin', None)
    session.pop('userid', None)
    session.pop('name', None)
    return redirect(url_for('login'))



@app.route('/register', methods=['GET', 'POST'])
def register():
    message = ''
    if request.method == 'POST' and 'name' in request.form and 'password' in request.form:
        userName = request.form['name']
        password = request.form['password']
        with sqlite3.connect('database.db') as users:
            cursor = users.cursor()
            cursor.execute('SELECT * FROM accounts WHERE username = ?', (userName, ))
            account = cursor.fetchone()
            if account:
                message = 'Account already exists !'
            elif not userName or not password:
                message = 'Please fill out the form !'
            else:
                cursor.execute('INSERT INTO accounts (username, password, rankpoint) VALUES (?, ?, 1000)', (userName, password,))
                users.commit()
                message = 'You have successfully registered !'
                return render_template('main_pages/login.html')
    elif request.method == 'POST':
        message = 'Please fill out the form !'
    return render_template('main_pages/register.html', message=message)


@app.route("/multi", methods= ['POST', 'GET'])
def multi():  
    if request.method == "POST":
        mode = request.form.get('mode')
        if mode == "Custom":
            return render_template('main_pages/custom.html')
        elif mode == "Normal":
            return redirect(url_for('waiting_normal'))
        else:
            return redirect(url_for('waiting_rank'))
    return render_template("main_pages/multi.html")

@app.route("/waiting_normal", methods = ["POST", "GET"])
def waiting_normal():
    playerID = session.get('userid')
    playerName = session.get('name')
    try:
        while True:
            time.sleep(2)
            print(waiting_player_normal)
            if waiting_player_normal and playerID not in waiting_player_normal:
                opponent_id, room = waiting_player_normal.popitem()    # loi o cai nay
                print("1111")
                session["room"] = room    # session cua th join(th tim sau)
                session['host'] = opponent_id
                session['join'] = playerID 
                with sqlite3.connect("database.db") as users:
                    cursor = users.cursor()
                    cursor.execute("SELECT username FROM accounts WHERE id = ?", (opponent_id,))
                    session['hostName'] = cursor.fetchone()[0]
                host_join_normal[opponent_id] = playerID
                return redirect(url_for("room"))
            else:   
                room = generate_unique_code(4)
                rooms[room] = {"members": 0}
                waiting_player_normal[playerID] = room
                session["room"] = room           # session cua th tao room truoc(find trc)
                session['host'] = playerID
                session['hostName'] = playerName
                return redirect(url_for("room"))
            
    except Exception as e:
        print(f"loi: {e}")
        
@app.route("/waiting_rank", methods = ["POST", "GET"])
def waiting_rank():
    playerID = session.get('userid')
    playerName = session.get('name')
    print(playerID)
    
    # tim trong database thang nao thoa man dieu kien 
    query1 = f"SELECT rankpoint FROM accounts WHERE id = {playerID}"
    with sqlite3.connect("database.db") as users:
        cursor = users.cursor()
        cursor.execute(query1)
        player_rankpoint = cursor.fetchone()[0]

        min_range = player_rankpoint - 1000
        max_range = player_rankpoint + 1000  # khoang tim kiem doi thu
                
        # tao truy van sql
        query2 = f"SELECT * FROM accounts WHERE rankpoint >= {min_range} AND rankpoint <= {max_range}"
        cursor.execute(query2)
        opponents = cursor.fetchall()   # day la danh sach cac dict, moi dict la 1 hang (day la cac player co range diem phu hop)
        try:
            while True:
                check = False
                for opponent in opponents:    # xet tung thang player co range diem phu hop xem co dang find ko
                    opponent_id = opponent[0]
                    opponent_name = opponent[1]
                    time.sleep(2)
                    print(waiting_player_rank)
                    # co th find va th oppo_id dang xet lai thuoc hang cho.
                    if waiting_player_rank and opponent_id in waiting_player_rank:
                        opponent_id, room = waiting_player_rank.popitem()    
                        print("1111")
                        session["room"] = room    # session cua th join(th tim sau)
                        session['join'] = playerID
                        session['host'] = opponent_id
                        host_join[opponent_id] = playerID 
                        session['hostName'] = opponent_name
                        return redirect(url_for("room_rank"))
                    # co thang dang find nma (th oppo_id ko nam trong hang cho) or (th oppo_id la thang thuoc range nhung th find thi out range) 
                    elif waiting_player_rank and opponent_id not in waiting_player_rank:  
                        continue
                    # ko ai find
                    elif not waiting_player_rank:   
                        room = generate_unique_code(4)
                        rooms[room] = {"members": 0}
                        waiting_player_rank[playerID] = room
                        session["room"] = room           # session cua th tao room truoc(find trc)
                        session['host'] = playerID
                        session['hostName'] = playerName
                        return redirect(url_for("room_rank"))
                if not check:   # find xong het 1 luot roi nma ko thay ai thoa man dieu kien (kp la ko ai find ma la ko tim dc ai thoa man dieu kien)
                    room = generate_unique_code(4)
                    rooms[room] = {"members": 0}
                    waiting_player_rank[playerID] = room
                    session["room"] = room           # session cua th tao room truoc(find trc)
                    session['host'] = playerID
                    session['hostName'] = playerName
                    return redirect(url_for("room_rank"))
                
        except Exception as e:
            print(f"loi: {e}")           
    
@app.route("/custom", methods = ['POST', 'GET'])
def custom():
    playerID = session.get('userid')
    if request.method == 'POST':
        code = request.form.get("code")
        join = request.form.get("join", False)
        create = request.form.get("create", False)
        if join != False and not code:
            return render_template('main_pages/custom.html', error = "Please enter a room code!", code = code)
        room = code
        if create != False:
            room = generate_unique_code(4)  
            rooms[room] = {"members": 0}
        elif code not in rooms:    
            return render_template('main_pages/custom.html', error = "Room does not exist!", code = code)
        session["room"] = room
        if create != False:
            session['role'] = "X"
            session['host'] = playerID
            session['join'] = None
            waiting_player_custom[playerID] = room
        else:
            session['role'] = "O"
            session['host'] = None
            session['join'] = playerID
            opponent_id, room = waiting_player_custom.popitem()
            with sqlite3.connect("database.db") as users:
                cursor = users.cursor()
                cursor.execute("SELECT username FROM accounts WHERE id = ?", (opponent_id,))
                host_name = cursor.fetchone()[0]
                session['hostName'] = host_name
        return redirect(url_for("room"))     
              
    return render_template('main_pages/custom.html')

 
@socketio.on('x_win')
def x_win():
    id = session.get('userid')
    print("x")
    if id in host_join:   # th host nhan
        host_id = id
        join_id = host_join[host_id]
    else:   # th join nhan 
        join_id = id
        host_id = session.get('host')
    # truy van mysql player host
    with sqlite3.connect("database.db") as users:
        cursor = users.cursor()
        cursor.execute("SELECT rankpoint FROM accounts WHERE id = ?", (host_id,))
        result1 = cursor.fetchone()
        current_points1 = result1[0]
        # them diem th win
        update_point1 = current_points1 + 50   # thuc ra la win + 50 + 50 vi cai su kien x_win nay duoc gui tu ca 2 client xong no dc chay 2 lan
        cursor.execute("UPDATE accounts SET rankpoint = ? WHERE id = ?", (update_point1, host_id))
        # tru diem th thua
        cursor.execute("SELECT rankpoint FROM accounts WHERE id = ?", (join_id,))
        result2 = cursor.fetchone()
        current_points2 = result2[0]
        update_point2 = current_points2 - 50
        cursor.execute("UPDATE accounts SET rankpoint = ? WHERE id = ?", (update_point2, join_id))
        users.commit()


@socketio.on('o_win')
def o_win():
    id = session.get('userid')
    print("o")
    if id in host_join:   # th host nhan
        host_id = id
        join_id = host_join[host_id]
    else:   # th join nhan 
        join_id = id
        host_id = session.get('host')
    # truy van mysql player host
    with sqlite3.connect("database.db") as users:
        cursor = users.cursor()
        cursor.execute("SELECT rankpoint FROM accounts WHERE id = ?", (host_id,))
        result1 = cursor.fetchone()
        current_points1 = result1[0]
        # them diem th win
        update_point1 = current_points1 - 50   # thuc ra la win + 50 + 50 vi cai su kien x_win nay duoc gui tu ca 2 client xong no dc chay 2 lan
        cursor.execute("UPDATE accounts SET rankpoint = ? WHERE id = ?", (update_point1, host_id))
        # tru diem th thua
        cursor.execute("SELECT rankpoint FROM accounts WHERE id = ?", (join_id,))
        result2 = cursor.fetchone()
        current_points2 = result2[0]
        update_point2 = current_points2 + 50
        cursor.execute("UPDATE accounts SET rankpoint = ? WHERE id = ?", (update_point2, join_id))
        users.commit()

@app.route("/room")
def room():
    room = session.get("room")
    if room is None or session.get("name") is None or room not in rooms:
        return redirect(url_for("multi"))
    return render_template("gameboards/room.html", room = room, size = 25)

@app.route("/room_rank")
def room_rank():
    room = session.get("room")
    if room is None or session.get("name") is None or room not in rooms:
        return redirect(url_for("multi"))
    return render_template("gameboards/room_rank.html", room = room, size = 25)


@socketio.on("connect")
def connect(auth):
    room = session.get("room")
    name = session.get("name")
    id = session.get("userid")
    if not room or not name:
        return
    if room not in rooms:
        leave_room(room)
        return
    join_room(room)
    send({"name": name, "message": "has entered the room"}, to = room)
    rooms[room]["members"] += 1
    if rooms[room]["members"] == 1:
        session['host'] = id
        print("s")
    elif rooms[room]["members"] == 2: 
        session['join'] = id
        print("d")
        host_name = session.get('hostName') 
        print("da gui")
        emit('update_info', {'host_name' : host_name, 'join_name' : name}, to = room)
    print(f"so nguoi trong room {rooms[room]["members"]} ten la {name}")
    print(rooms)
    print(f"{name} joined room {room}")
    
@socketio.on('makeMove')
def handle_move(data):
    room = session.get("room")
    id = session.get("userid")
    if id in host_join:   # th host rank nhan
        print('55')
        join_id = host_join[id]
        session['host'] = id
        session['join'] = join_id
    if id in host_join_normal: # th host normal nhan
        print('44')
        join_id = host_join_normal[id]
        session['host'] = id
        session['join'] = join_id
    if data['content'] == "X" and (data['turn'] % 2 == 0) and (id == session.get("host")): # neu ten trung voi th host thi choi X dc thoi
        data['turn'] += 1
        emit('moveMade', data, to= room)   # emit la phat su kien 'move' cho client, gui move cho room
    elif data['content'] == "O" and (data['turn'] % 2 != 0) and (id == session.get("join")): # neu ten trung voi th join thi choi O dc thoi
        data['turn'] += 1
        emit('moveMade', data, to= room)
    else:
        pass
    

@socketio.on("disconnect")
def disconnect():
    room = session.get("room")
    name = session.get("name")
    id = session.get('userid')
    leave_room(room)
    
    if room in rooms:
        rooms[room]["members"] -= 1
        if rooms[room]["members"] <= 0:
            del rooms[room]
    print(host_join)
    print(host_join_normal)
    if id in host_join:  # id la thang host rank
        host_join.pop(id)
    else:   # id la thang join rank
        host_id = session.get('host') 
        host_join.pop(host_id, None)
    if id in host_join_normal:  # id la thang host
        host_join_normal.pop(id)
    else:   # id la thang join
        host_id = session.get('host')
    send({"name": name, "message": "has left the room"}, to = room)
    print(f"{name} left room {room}")
 
      
# Start the server    
if __name__ == '__main__':
    socketio.run(app, debug = True, allow_unsafe_werkzeug=True)
    
   
   
   
   
   
   
   
