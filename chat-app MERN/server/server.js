//No use Backup Server File
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')

const app=express();
app.use(express.json());
app.use(cors());

const MONGO_URI="mongodb+srv://varadezscarl_db_user:chatbot1@cluster0.v2qycu8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
.then(() => console.log("Mongo Connected"))
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

app.listen(5000,() => console.log("Server has started"));

