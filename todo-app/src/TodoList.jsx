import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./TodoList.css";

const FILTERS = ["All", "Active", "Completed"];

export default function TodoList() {
  const [todos, setTodos] = useState([
    { task: "Welcome to TaskFlow! ✨", id: uuidv4(), isDone: false },
    { task: "Click the checkbox to mark done", id: uuidv4(), isDone: false },
    { task: "Click the trash icon to delete", id: uuidv4(), isDone: true },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  const addNewTask = () => {
    const trimmed = newTodo.trim();
    if (!trimmed) {
      setError("Please enter a task before adding.");
      return;
    }
    setTodos((prev) => [
      ...prev,
      { task: trimmed, id: uuidv4(), isDone: false },
    ]);
    setNewTodo("");
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addNewTask();
  };

  const updateTodoValue = (e) => {
    setNewTodo(e.target.value);
    if (error) setError("");
  };

  const deleteTodo = (id) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const toggleDone = (id) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))
    );

  const markAllDone = () =>
    setTodos((prev) => prev.map((t) => ({ ...t, isDone: true })));

  const clearCompleted = () =>
    setTodos((prev) => prev.filter((t) => !t.isDone));

  const filtered = todos.filter((t) => {
    if (filter === "Active") return !t.isDone;
    if (filter === "Completed") return t.isDone;
    return true;
  });

  const doneCount = todos.filter((t) => t.isDone).length;
  const totalCount = todos.length;
  const progress = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  return (
    <div className="tf-wrapper">
      <header className="tf-header">
        <div className="tf-header-top">
          <div className="tf-logo">
            <span className="tf-logo-icon">⚡</span>
            <span className="tf-logo-text">TaskFlow</span>
          </div>
          <div className="tf-stats">
            <span className="tf-stats-badge">
              {doneCount}/{totalCount} done
            </span>
          </div>
        </div>
        <p className="tf-subtitle">Stay focused. Stay productive.</p>

        <div className="tf-progress-track">
          <div
            className="tf-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="tf-progress-label">{progress}% complete</span>
      </header>

      <div className="tf-input-section">
        <div className={`tf-input-row ${error ? "tf-input-row--error" : ""}`}>
          <input
            id="new-todo-input"
            className="tf-input"
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={updateTodoValue}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <button
            id="add-task-btn"
            className="tf-btn-add"
            onClick={addNewTask}
            title="Add task"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add
          </button>
        </div>
        {error && <p className="tf-error">{error}</p>}
      </div>

      <div className="tf-filters" role="tablist" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button
            key={f}
            id={`filter-${f.toLowerCase()}`}
            role="tab"
            className={`tf-filter-btn ${filter === f ? "tf-filter-btn--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="tf-list" aria-label="Todo list">
        {filtered.length === 0 ? (
          <li className="tf-empty">
            <span className="tf-empty-icon">🎉</span>
            <span>
              {filter === "Completed"
                ? "No completed tasks yet."
                : filter === "Active"
                ? "All tasks are done!"
                : "No tasks yet. Add one above!"}
            </span>
          </li>
        ) : (
          filtered.map((todo) => (
            <li
              key={todo.id}
              className={`tf-item ${todo.isDone ? "tf-item--done" : ""}`}
            >
              <button
                id={`check-${todo.id}`}
                className={`tf-checkbox ${todo.isDone ? "tf-checkbox--checked" : ""}`}
                onClick={() => toggleDone(todo.id)}
                aria-label={todo.isDone ? "Mark as active" : "Mark as done"}
              >
                {todo.isDone && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>

              <span className="tf-item-text">{todo.task}</span>

              <button
                id={`delete-${todo.id}`}
                className="tf-btn-delete"
                onClick={() => deleteTodo(todo.id)}
                aria-label="Delete task"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>
            </li>
          ))
        )}
      </ul>

      {todos.length > 0 && (
        <div className="tf-footer">
          <span className="tf-footer-info">
            {todos.filter((t) => !t.isDone).length} item
            {todos.filter((t) => !t.isDone).length !== 1 ? "s" : ""} left
          </span>
          <div className="tf-footer-actions">
            {todos.some((t) => !t.isDone) && (
              <button id="mark-all-btn" className="tf-btn-ghost" onClick={markAllDone}>
                Mark all done
              </button>
            )}
            {doneCount > 0 && (
              <button id="clear-completed-btn" className="tf-btn-ghost tf-btn-ghost--danger" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </div>
        </div>
      )}

      <footer className="tf-attribution">
        Built with
        <span className="tf-heart" aria-label="love">♥</span>
        by <span className="tf-author">Atul Rao</span>
      </footer>
    </div>
  );
}