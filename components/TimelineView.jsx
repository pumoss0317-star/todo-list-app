"use client";

import { useState } from "react";
import { EmptyState } from "./EmptyState";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { TodoItem } from "./TodoItem";
import { parseDueAt, toDateKey } from "@/lib/dueDate";

const HOUR_START = 6;
const HOUR_END = 24;
const HOUR_HEIGHT_PX = 60;
const ITEM_HEIGHT_PX = 60;
const TRACK_HEIGHT_PX = (HOUR_END - HOUR_START) * HOUR_HEIGHT_PX;
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

function shiftDay(dateKey, delta) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return toDateKey(new Date(y, m - 1, d + delta));
}

function formatDayLabel(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(y, m - 1, d));
}

const navButtonClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800";

export function TimelineView({ isLoaded, todos, onToggle, onDelete, onEdit }) {
  const [currentDayKey, setCurrentDayKey] = useState(() => toDateKey(new Date()));

  if (!isLoaded) return <LoadingSkeleton />;
  if (todos.length === 0) return <EmptyState />;

  const timedToday = [];
  const allDayToday = [];
  const noDueDate = [];

  for (const todo of todos) {
    if (!todo.dueAt) {
      noDueDate.push(todo);
      continue;
    }
    const parsed = parseDueAt(todo.dueAt);
    if (!parsed || parsed.dateKey !== currentDayKey) continue;
    if (parsed.hasTime) {
      timedToday.push({ todo, date: parsed.date });
    } else {
      allDayToday.push(todo);
    }
  }

  const isToday = currentDayKey === toDateKey(new Date());
  const dayHasNothing = timedToday.length === 0 && allDayToday.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentDayKey((k) => shiftDay(k, -1))}
          aria-label="前日"
          className={navButtonClass}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {formatDayLabel(currentDayKey)}
          </span>
          {!isToday && (
            <button
              type="button"
              onClick={() => setCurrentDayKey(toDateKey(new Date()))}
              className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              今日
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCurrentDayKey((k) => shiftDay(k, 1))}
          aria-label="翌日"
          className={navButtonClass}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {allDayToday.length > 0 && (
        <ul className="flex flex-col gap-2">
          {allDayToday.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      )}

      <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="flex">
          <div className="flex shrink-0 flex-col text-right text-xs text-zinc-400 dark:text-zinc-500">
            {HOURS.map((hour) => (
              <div key={hour} style={{ height: HOUR_HEIGHT_PX }} className="pr-2 pt-0.5">
                {hour}:00
              </div>
            ))}
          </div>

          <div className="relative flex-1" style={{ height: TRACK_HEIGHT_PX }}>
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute inset-x-0 border-t border-zinc-100 dark:border-zinc-800"
                style={{ top: (hour - HOUR_START) * HOUR_HEIGHT_PX }}
              />
            ))}

            {dayHasNothing ? (
              <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-zinc-400 dark:text-zinc-500">
                この日の予定はありません
              </p>
            ) : (
              timedToday.map(({ todo, date }) => {
                const rawTop =
                  (date.getHours() + date.getMinutes() / 60 - HOUR_START) * HOUR_HEIGHT_PX;
                const top = Math.min(Math.max(rawTop, 0), TRACK_HEIGHT_PX - ITEM_HEIGHT_PX);
                return (
                  <div key={todo.id} className="absolute inset-x-0 px-2" style={{ top }}>
                    <TodoItem
                      todo={todo}
                      onToggle={onToggle}
                      onDelete={onDelete}
                      onEdit={onEdit}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {noDueDate.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            期限なしのタスク
          </h2>
          <ul className="flex flex-col gap-2">
            {noDueDate.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
