from flask import Flask, redirect, render_template, request, session, url_for
from flask_socketio import SocketIO, join_room, leave_room, emit, send
import random
from string import ascii_uppercase

app = Flask(__name__)
app.config["SECRET_KEY"] = "kjdfhgkdjfhkgh"
socketio = SocketIO(app)

# Dictionary to store game state for each room
rooms = {}
size_picked = 0

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
    return render_template('menu.html')

# Route for mode selection page
@app.route("/mode", methods=['POST'])
def mode():
    if request.method == "POST":
        mode = request.form.get('mode')  # Get the selected mode
        if mode == "Single Player":
            return render_template('size.html')  
    return render_template('home.html') 
    
    


@app.route("/size", methods=['POST'])
def size():
    if request.method == "POST":
        size = request.form.get('size')  # Get the selected mode
        global size_picked
        size_picked = int(size)
        return render_template('difficulty.html')

@app.route("/difficulty", methods=['POST'])
def difficulty():
    if request.method == "POST":
        difficulty = request.form.get('difficulty')  # Get the selected mode
        if size_picked == 4:
            return render_template('4x4.html', difficulty = difficulty)
        if size_picked == 5:
            return render_template('5x5.html', difficulty = difficulty)
        if size_picked == 6:
            return render_template('6x6.html', difficulty = difficulty)
    return render_template('3x3.html', difficulty = difficulty)
        
    

@app.route("/game", methods=['POST'])
def game():
    return render_template('room.html')





@app.route("/home", methods = ['POST'])
def home():
    session.clear()
    if request.method == "POST":
        name = request.form.get("name")
        code = request.form.get("code")
        join = request.form.get("join", False)
        create = request.form.get("create", False)
        
        if not name:
            return render_template('home.html', error = "Please enter a name!", code = code, name = name)
        if join != False and not code:
            return render_template('home.html', error = "Please enter a room code!", code = code, name = name)
        room = code
        if create != False:
            room = generate_unique_code(4)  
            rooms[room] = {"members": 0}
        elif code not in rooms:    
            return render_template('home.html', error = "Room does not exist!", code = code, name = name)
              
        session["room"] = room
        session["name"] = name 
        return redirect(url_for("room"))     
              
    return render_template('home.html')


@app.route("/room")
def room():
    room = session.get("room")
    if room is None or session.get("name") is None or room not in rooms:
        return redirect(url_for("home")) 
    return render_template("room.html", room = room, size = 25)


@socketio.on("connect")
def connect(auth):
    room = session.get("room")
    name = session.get("name")
    if not room or not name:
        return
    if room not in rooms:
        leave_room(room)
        return
    
    join_room(room)
    send({"name": name, "message": "has entered the room"}, to = room)
    rooms[room]["members"] += 1
    print(f"{name} joined room {room}")

@socketio.on("disconnect")
def disconnect():
    room = session.get("room")
    name = session.get("name")
    leave_room(room)
    
    if room in rooms:
        rooms[room]["members"] -= 1
        if rooms[room]["members"] <= 0:
            del rooms[room]
    
    send({"name": name, "message": "has left the room"}, to = room)
    print(f"{name} left room {room}")
 
      
# Start the server    
if __name__ == '__main__':
    socketio.run(app, debug = True)
    
   
   
   
   
   
