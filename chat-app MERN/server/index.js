//Main Server File
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);
app.use(express.json());




//Register/Signup Function


app.use(express.json());
app.use(cors());
//MongoDB Connection
const MONGO_URI="mongodb+srv://varadezscarl_db_user:chatbot1@cluster0.v2qycu8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("Connection Error", err));


const UserSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});
const User = mongoose.model("User",UserSchema)

app.post("/signup", async (req, res) => {
    try{
    const user = new User(req.body);
    await user.save();
    res.json(user);

} catch(err) {
    if (err.code == 11000){
        res.status(400).json({error: "Username must be unique"});
        
    } else{
        res.status(500).json({error: "Failed to save user"})
    }
}
});

app.get("/signup", async (req, res) => {
    const users = new User.find();
    res.json(users);

});




//End of Register/Signup Function


//Login Function
app.post("/", async (req, res) => {
  const{ name, password} = req.body;

//Secure Password
  const securePassword = Buffer.from(password).toString("base64");



  try{
    const user = await User.findOne({name});
    if (!user) return res.status(400).json({error: "User not found"});


    if (securePassword !== user.password){
      return res.status(400).json({error: "Invalid password"});
      
    }
    res.json({message: "Login Successful", user: { name: user.name}});
  } catch(err){
    res.json(500).json({error: "Server error"});
  }
});

//End of Login Function

//Connect/Disconnect Users
io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server is running.`));