//db : rAMqdRGyghe9SRWm
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo")

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://jawadkoko147:rAMqdRGyghe9SRWm@cluster0.lnsac4x.mongodb.net/")
    .then(() => console.log("connected to db"))
    .catch(error => console.log(error))

app.listen(3001, () => {
    console.log("listening on port 3001")
})

app.get("/", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos)
})

app.post("/new", async (req, res) => {
    try {
        const todo = await new Todo({
            text: req.body.text,
        });
        todo.save();
        res.json(todo);
    } catch (error) {
        console.error(error);
    }
})


app.delete("/delete/:id", async (req, res) => {
    try {
        const result = await Todo.findByIdAndDelete(req.params.id)
        res.json(result)
    } catch (error) {
        console.error(error);
    }
})

app.get("/complete/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        todo.complete = !todo.complete;
        await todo.save();
        res.json(todo);
    } catch (error) {
        console.error(error);

    }
})
