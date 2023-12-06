import "./App.css";
import { useState, useEffect, useRef } from "react";
import Login from "./components/Login";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "./features/userSlice";
const BASE_API = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const popupRef = useRef(null);
  const inputRef = useRef(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    getTodos();
    document.addEventListener("click", handleOutsideClick);
    return () => {
      // Cleanup: remove event listener when component unmounts
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setPopupActive(false);
    }
  };

  const handleAddPopupClick = (e) => {
    e.stopPropagation();
    setPopupActive(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

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

  const hideCompleted = () => {
    setTodos((todos) => todos.filter((todo) => todo.complete !== true));
  };

  const deleteAll = async () => {
    await fetch(BASE_API + "/deleteAll", { method: "DELETE" }).then(
      (res) => res.json
    );
    setTodos([]);
  };

  if (user === null) {
    return <Login />;
  }
  return (
    <div className="app">
      <nav>
        <h1>Welcome</h1>
        <button className="logout" onClick={() => dispatch(logout())}>
          Log Out
        </button>
      </nav>
      <div className="nav">
        <h4>Your Tasks</h4>
        <button className="filter__button" onClick={hideCompleted}>
          Hide completed
        </button>
        <button className="filter__button" onClick={getTodos}>
          Show all
        </button>
        <button className="filter__button delete__all" onClick={deleteAll}>
          Delete all
        </button>
      </div>
      <div className="todos__container">
        {todos.map((todo) => (
          <div className="todos" key={todo._id}>
            <div
              className={`todo ${todo.complete ? "is-complete" : ""}`}
              onClick={() => completeTodo(todo._id)}
            >
              <div className="checkbox"></div>
              <div className="text">{todo.text}</div>
            </div>
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
              X
            </div>
          </div>
        ))}
      </div>
      <div className="addPopup" onClick={handleAddPopupClick}>
        +
      </div>
      {popupActive ? (
        <div className="popup" ref={popupRef}>
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            X
          </div>
          <h3 className="content">add task</h3>
          <input
            type="text"
            ref={inputRef}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo();
              } else if (e.key === "Escape") {
                setPopupActive(false);
              }
            }}
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
