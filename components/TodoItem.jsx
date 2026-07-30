"use client";

import { useEffect, useRef, useState } from "react";
import { DueDateFields } from "@/components/DueDateFields";
import { formatDueBadge, isOverdue } from "@/lib/dueDate";

const EXIT_ANIMATION_MS = 180;

function splitDueAt(dueAt) {
  if (!dueAt) return { date: "", time: "" };
  const [date, time] = dueAt.split("T");
  return { date, time: time ?? "" };
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDueDate, setEditDueDate] = useState("");
  const [editDueTime, setEditDueTime] = useState("");
  const [shake, setShake] = useState(false);
  const textInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) textInputRef.current?.focus();
  }, [isEditing]);

  function handleDelete() {
    setIsRemoving(true);
    setTimeout(() => onDelete(todo.id), EXIT_ANIMATION_MS);
  }

  function startEdit() {
    const { date, time } = splitDueAt(todo.dueAt);
    setEditText(todo.text);
    setEditDueDate(date);
    setEditDueTime(time);
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setShake(false);
  }

  function saveEdit() {
    const dueAt = !editDueDate
      ? null
      : editDueTime
        ? `${editDueDate}T${editDueTime}`
        : editDueDate;
    const saved = onEdit(todo.id, { text: editText, dueAt });
    if (saved) {
      setIsEditing(false);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }

  function handleEditDateChange(value) {
    setEditDueDate(value);
    if (!value) setEditDueTime("");
  }

  function handleClearDue() {
    setEditDueDate("");
    setEditDueTime("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  }

  if (isEditing) {
    return (
      <li className="flex flex-col gap-2 rounded-lg border border-blue-300 bg-white px-3 py-2 dark:border-blue-700 dark:bg-zinc-900">
        <input
          ref={textInputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="タスクを編集"
          className={`h-11 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-base text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 ${
            shake ? "animate-shake border-red-400" : ""
          }`}
        />

        <div className="flex flex-wrap items-center gap-2">
          <DueDateFields
            date={editDueDate}
            time={editDueTime}
            onDateChange={handleEditDateChange}
            onTimeChange={setEditDueTime}
          />
          {(editDueDate || editDueTime) && (
            <button
              type="button"
              onClick={handleClearDue}
              className="text-sm text-zinc-500 hover:underline dark:text-zinc-400"
            >
              クリア
            </button>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={cancelEdit}
            className="h-10 rounded-lg px-4 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={saveEdit}
            className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            保存
          </button>
        </div>
      </li>
    );
  }

  const dueBadge = formatDueBadge(todo.dueAt);
  const overdue = isOverdue(todo);

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

      <div className="min-w-0 flex-1">
        <span
          className={`block break-words text-base transition-colors ${
            todo.completed
              ? "text-zinc-400 line-through dark:text-zinc-600"
              : "text-zinc-900 dark:text-zinc-50"
          }`}
        >
          {todo.text}
        </span>
        {dueBadge && (
          <span
            className={`text-xs ${
              overdue
                ? "text-red-600 dark:text-red-400"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {dueBadge}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={startEdit}
        aria-label={`${todo.text} を編集`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
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
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
        </svg>
      </button>

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
