import React, { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText ] = useState("");

  const addTodo = () => {
    if (input.trim() === "") return;
    const newTodo = {
      id: Date.now(),
      text: input,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInput("");
  };

  const deleteTodo = (id) => {
    if (editId === id) {
      setEditId(null);
      setEditText("");
    };
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) => 
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    if (editText.trim() === "") return;
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const handleAddKeyDown = (e) => {
    if (e.key === "Enter") addTodo();
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === "Enter") saveEdit(id);
  };

  return (
    <div className="container">
      <h1 className="title">To-Do 리스트</h1>
      <div className="inputWrap">
        <input 
        type="text"
        placeholder="할 일을 입력하세요."
        value={input}
        onChange={(e) => setInput(e.target.value)} 
        onKeyDown={handleAddKeyDown}
        className="input"
        />

        <button onClick={addTodo} className="addButton">
          추가
        </button>
      </div>

      <ul className="list">
        {todos.length === 0 ? (
          <p className="emptyText">등록된 할 일이 없습니다.</p>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className="listItem">
              {editId === todo.id ? (
                <div className="editWrap">
                  <input 
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                  className="editInput"
                  />
                  
                  <div className="buttonGroup">
                    <button
                      onClick={() => saveEdit(todo.id)}
                      className="saveButton"
                      >
                        저장
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="cancelButton"
                      >
                        취소
                      </button>
                  </div>
                </div>
              ) : (

                <>
                  <span
                    onClick={() => toggleTodo(todo.id)}
                    className={`todoText ${
                      todo.completed ? "completed" : ""
                    }`}
                  >
                    {todo.text}
                  </span>

                  <div className="buttonGroup">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="completedButton"
                      >
                        {todo.completed ? "취소" : "완료"}
                      </button>

                      <button
                      onClick={() =>
                        startEdit(todo.id, todo.text)
                      }
                      className="editButton"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="deleteButton"
                        >
                          삭제
                        </button>
                      </div>
                    </>
                )}
              </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;