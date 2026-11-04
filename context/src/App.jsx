
import React, { createContext, useContext, useMemo, useState } from "react";
import "./App.css";

// Context 생성
const TodoContext = createContext(null);

// 전역 상태 관리 Provider
function TodoProvider({ children }) {
  const [todos, setTodos] = useState([
    { id: 1, text: "React 복습하기", completed: false },
    { id: 2, text: "Context API 이해하기", completed: true },
    { id: 3, text: "상태 관리 예제 만들기", completed: false },
  ]);

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  // 할 일 추가
  const addTodo = () => {
    const trimmed = input.trim();

    if (!trimmed) return;

    const newTodo = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
  };

  // 완료 상태 변경
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  // 할 일 삭제
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // 완료 항목 전체 삭제
  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  // 필터링
  const filteredTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }, [todos, filter]);

  // 할 일 개수 계산
  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = totalCount - completedCount;

  // Context로 전달할 값
  const value = {
    todos,
    input,
    filter,
    filteredTodos,
    totalCount,
    completedCount,
    activeCount,
    setInput,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}

// Context 사용을 위한 커스텀 Hook
function useTodo() {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error("useTodo는 TodoProvider 내부에서 사용해야 합니다.");
  }

  return context;
}

// 상단 제목 및 통계
function Header() {
  const { totalCount, activeCount, completedCount } = useTodo();

  return (
    <header className="todoHeader">
      <h1 className="todoTitle">Context API 상태 관리 앱</h1>

      <p className="todoSubtitle">
        Context API로 전역 상태를 관리하는 To-Do 예제입니다.
      </p>

      <div className="summaryRow">
        <div className="summaryCard">
          <p className="summaryLabel">전체</p>
          <strong className="summaryValue">{totalCount}</strong>
        </div>

        <div className="summaryCard">
          <p className="summaryLabel">진행중</p>
          <strong className="summaryValue">{activeCount}</strong>
        </div>

        <div className="summaryCard">
          <p className="summaryLabel">완료</p>
          <strong className="summaryValue">{completedCount}</strong>
        </div>
      </div>
    </header>
  );
}

// 할 일 입력
function TodoInput() {
  const { input, setInput, addTodo } = useTodo();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      addTodo();
    }
  };

  return (
    <div className="inputSection">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="할 일을 입력하세요"
        aria-label="새 할 일"
        className="todoInput"
      />

      <button
        type="button"
        onClick={addTodo}
        className="addButton"
      >
        추가
      </button>
    </div>
  );
}

// 필터 버튼
function FilterButtons() {
  const { filter, setFilter, clearCompleted, completedCount } = useTodo();

  return (
    <div className="filterWrap">
      <div className="filterButtons">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`filterButton ${filter === "all" ? "active" : ""}`}
        >
          전체
        </button>

        <button
          type="button"
          onClick={() => setFilter("active")}
          className={`filterButton ${filter === "active" ? "active" : ""}`}
        >
          진행중
        </button>

        <button
          type="button"
          onClick={() => setFilter("completed")}
          className={`filterButton ${filter === "completed" ? "active" : ""}`}
        >
          완료
        </button>
      </div>

      <button
        type="button"
        onClick={clearCompleted}
        className="clearButton"
        disabled={completedCount === 0}
      >
        완료 항목 삭제
      </button>
    </div>
  );
}

// 할 일 목록
function TodoList() {
  const { filteredTodos } = useTodo();

  if (filteredTodos.length === 0) {
    return (
      <div className="emptyBox">
        현재 표시할 할 일이 없습니다.
      </div>
    );
  }

  return (
    <div className="todoList">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

// 개별 할 일 항목
function TodoItem({ todo }) {
  const { toggleTodo, deleteTodo } = useTodo();

  return (
    <div className="todoCard">
      <label className="todoLeft">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />

        <span className={`todoText ${todo.completed ? "completed" : ""}`}>
          {todo.text}
        </span>
      </label>

      <button
        type="button"
        onClick={() => deleteTodo(todo.id)}
        className="deleteButton"
      >
        삭제
      </button>
    </div>
  );
}

// 화면 구성
function AppContent() {
  return (
    <div className="todoPage">
      <div className="todoContainer">
        <Header />
        <TodoInput />
        <FilterButtons />
        <TodoList />
      </div>
    </div>
  );
}

// 최상위 App
function App() {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
}

export default App;
