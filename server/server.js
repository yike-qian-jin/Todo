const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");
const Users = require("./models/Users");
const bcrypt = require('bcrypt');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
require("dotenv").config();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.db_URI)
    .then(() => {
        console.log("connected to db")
        app.listen(3001, () => {
            console.log("on port 3001")
        })
    }).catch((error) => {
        console.error("Error connecting to database:", error);
    });


app.get("/", async (req, res) => {

    const todos = await Todo.find();
    res.json(todos)
})

app.post("/new", async (req, res) => {
    try {
        const todo = await new Todo({
            text: req.body.text,
            userEmail: req.body.userEmail,
        })
        await todo.save();
        res.json(todo)
    } catch (error) {
        console.error(error)
    }
})

app.delete("/delete/:id", async (req, res) => {
    try {
        const result = await Todo.findByIdAndDelete(req.params.id)
        res.json(result)
    } catch (error) {
        console.error(error)
    }
})

app.delete("/deleteAll", async (req, res) => {
    try {
        const result = await Todo.deleteMany({});
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not delete items' });
    }
});

app.put("/complete/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id)
        todo.complete = !todo.complete;
        todo.save();
        res.json(todo)
    } catch (error) {
        console.error(error)
    }
})

app.post("/newUser", async (req, res) => {
    const email = req.body.email;
    const passwordHashed = await bcrypt.hash(req.body.password, 10)
    try {
        const newUser = new Users({ email, password: passwordHashed })
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error)
    }
})

app.post("/user", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "invalid credentials" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "invalid credentials" })
        }
        return res.status(200).json({ message: "Authentication successful", user });
    } catch (error) {
        console.error(error)
    }
})

app.use(notFound, errorHandler)