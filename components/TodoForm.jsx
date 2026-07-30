"use client";

import { useState } from "react";
import { DueDateFields } from "@/components/DueDateFields";

export function TodoForm({ onAdd }) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [shake, setShake] = useState(false);

  function handleDateChange(value) {
    setDueDate(value);
    if (!value) setDueTime("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const dueAt = !dueDate ? null : dueTime ? `${dueDate}T${dueTime}` : dueDate;
    const added = onAdd(text, dueAt);
    if (added) {
      setText("");
      setDueDate("");
      setDueTime("");
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力..."
          aria-label="新しいタスク"
          className={`h-12 flex-1 rounded-lg border border-zinc-300 bg-white px-4 text-base text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 ${
            shake ? "animate-shake border-red-400" : ""
          }`}
        />
        <button
          type="submit"
          className="h-12 min-w-11 rounded-lg bg-blue-600 px-5 text-base font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          追加
        </button>
      </div>

      <DueDateFields
        date={dueDate}
        time={dueTime}
        onDateChange={handleDateChange}
        onTimeChange={setDueTime}
      />
    </form>
  );
}
