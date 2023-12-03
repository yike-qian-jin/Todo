const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");
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
        })
        todo.save();
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