"use client";

import { useState } from "react";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { TimelineView } from "@/components/TimelineView";
import { ViewToggle } from "@/components/ViewToggle";
import { UndoToast } from "@/components/UndoToast";
import { useTodos } from "@/hooks/useTodos";

export default function Home() {
  const {
    todos,
    isLoaded,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    lastDeleted,
    undoDelete,
  } = useTodos();

  const [view, setView] = useState("list");

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            ToDo リスト
          </h1>
          {isLoaded && todos.length > 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {todos.length}件中 {completedCount}件完了
            </p>
          )}
        </header>

        <TodoForm onAdd={addTodo} />

        <ViewToggle view={view} onChange={setView} />

        {view === "list" ? (
          <TodoList
            isLoaded={isLoaded}
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        ) : (
          <TimelineView
            isLoaded={isLoaded}
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        )}
      </main>

      <UndoToast lastDeleted={lastDeleted} onUndo={undoDelete} />
    </div>
  );
}
