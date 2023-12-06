import "./App.css";
import { useState, useEffect } from "react";
const BASE_API = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    await fetch(BASE_API)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error(error));
  };

  const completeTodo = async (id) => {
    const data = await fetch(BASE_API + "/complete/" + id, {
      method: "PUT",
    }).then((res) => res.json());
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };

  const deleteTodo = async (id) => {
    const data = await fetch(BASE_API + "/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());
    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  const addTodo = async () => {
    const data = await fetch(BASE_API + "/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());
    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("");
  };

  return (
    <div className="app">
      <h1>Welcome</h1>
      <h4>Your Tasks</h4>
      <div className="todos">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className={`todo ${todo.complete ? "is-complete" : ""}`}
          >
            <div
              className="checkbox"
              onClick={() => completeTodo(todo._id)}
            ></div>
            <div className="text">{todo.text}</div>
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
              X
            </div>
          </div>
        ))}
      </div>
      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>
      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            X
          </div>
          <h3 className="content">add task</h3>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="add-todo-input"
          />
          <button className="button" onClick={addTodo}>
            create task
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
