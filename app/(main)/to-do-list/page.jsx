"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Check } from "lucide-react";

const SimpleToDo = () => {
  // ✅ Lazy load todos from localStorage
  const [todos, setTodos] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("todos");
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error("Error loading todos from localStorage", e);
      }
    }
    return [];
  });

  const [inputValue, setInputValue] = useState("");

  // ✅ Save todos to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        deleted: false,
      };
      setTodos((prev) => [...prev, newTodo]);
      setInputValue("");
    }
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => {
      const updated = prev.filter((todo) => todo.id !== id);
      localStorage.setItem("todos", JSON.stringify(updated));
      return updated;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTodo();
  };

  return (
    <div className="max-w-2xl md:max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Simple To-Do List
      </h1>

      {/* Add Todo Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add
        </button>
      </div>

      {/* Todo List */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No tasks yet. Add one above!
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${
                todo.deleted
                  ? "bg-red-50 border-red-200"
                  : todo.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <button
                onClick={() => toggleComplete(todo.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  todo.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 hover:border-green-500"
                }`}
              >
                {todo.completed && <Check size={16} />}
              </button>

              <span
                className={`flex-1 ${
                  todo.deleted
                    ? "line-through text-red-500"
                    : todo.completed
                    ? "line-through text-green-600"
                    : "text-gray-800"
                }`}
              >
                {todo.text}
              </span>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {todos.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total: {todos.length}</span>
            <span>Completed: {todos.filter((t) => t.completed).length}</span>
            <span>Deleted: {todos.filter((t) => t.deleted).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleToDo;
