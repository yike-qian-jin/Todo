const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    complete: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now(),
    },
    user_id: String,
})

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;