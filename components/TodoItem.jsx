"use client";

import { useState } from "react";

const EXIT_ANIMATION_MS = 180;

export function TodoItem({ todo, onToggle, onDelete }) {
  const [isRemoving, setIsRemoving] = useState(false);

  function handleDelete() {
    setIsRemoving(true);
    setTimeout(() => onDelete(todo.id), EXIT_ANIMATION_MS);
  }

  return (
    <li
      className={`flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2 transition-all duration-200 ease-in dark:border-zinc-800 dark:bg-zinc-900 ${
        isRemoving ? "-translate-x-2 opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <label className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`${todo.text} を完了にする`}
          className="h-6 w-6 cursor-pointer accent-blue-600"
        />
      </label>

      <span
        className={`min-w-0 flex-1 break-words text-base transition-colors ${
          todo.completed
            ? "text-zinc-400 line-through dark:text-zinc-600"
            : "text-zinc-900 dark:text-zinc-50"
        }`}
      >
        {todo.text}
      </span>

      <button
        type="button"
        onClick={handleDelete}
        aria-label={`${todo.text} を削除`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      </button>
    </li>
  );
}
