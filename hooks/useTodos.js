"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { DUE_AT_PATTERN } from "@/lib/dueDate";

const STORAGE_KEY = "todos";
const UNDO_TIMEOUT_MS = 5000;
const EMPTY_TODOS = [];

let todosSnapshot = EMPTY_TODOS;
let listeners = [];

function isValidTodo(item) {
  return (
    item &&
    typeof item.id === "string" &&
    typeof item.text === "string" &&
    typeof item.completed === "boolean"
  );
}

function normalizeDueAt(value) {
  return typeof value === "string" && DUE_AT_PATTERN.test(value) ? value : null;
}

function readFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isValidTodo)
      .map((item) => ({ ...item, dueAt: normalizeDueAt(item.dueAt) }));
  } catch {
    return [];
  }
}

function persist(todos) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // ストレージが使えない環境（プライベートモード等）では保存を諦める
  }
}

// サーバー/クライアント間のハイドレーション不整合を避けるため、
// 初期スナップショットは EMPTY_TODOS のまま保持し、
// クライアントでの初回 getSnapshot() 呼び出し時にだけ localStorage を読む。
function ensureInitialized() {
  if (todosSnapshot !== EMPTY_TODOS || typeof window === "undefined") return;
  todosSnapshot = readFromStorage();
}

function commit(next) {
  todosSnapshot = next;
  persist(next);
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  ensureInitialized();
  return todosSnapshot;
}

function getServerSnapshot() {
  return EMPTY_TODOS;
}

export function useTodos() {
  const todos = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLoaded = todos !== EMPTY_TODOS;

  const [lastDeleted, setLastDeleted] = useState(null);
  const undoTimerRef = useRef(null);

  const addTodo = useCallback((text, dueAt = null) => {
    const trimmed = text.trim();
    if (!trimmed) return false;
    const newTodo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
      dueAt: normalizeDueAt(dueAt),
    };
    commit([newTodo, ...todosSnapshot]);
    return true;
  }, []);

  const toggleTodo = useCallback((id) => {
    commit(
      todosSnapshot.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }, []);

  const editTodo = useCallback((id, updates) => {
    const normalized = {};
    if (updates.text !== undefined) {
      const trimmed = updates.text.trim();
      if (!trimmed) return false;
      normalized.text = trimmed;
    }
    if (updates.dueAt !== undefined) {
      normalized.dueAt = normalizeDueAt(updates.dueAt);
    }

    commit(
      todosSnapshot.map((t) => (t.id === id ? { ...t, ...normalized } : t))
    );
    return true;
  }, []);

  const deleteTodo = useCallback((id) => {
    const index = todosSnapshot.findIndex((t) => t.id === id);
    if (index === -1) return;
    const item = todosSnapshot[index];

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setLastDeleted({ item, index });
    undoTimerRef.current = setTimeout(() => {
      setLastDeleted(null);
    }, UNDO_TIMEOUT_MS);

    commit(todosSnapshot.filter((t) => t.id !== id));
  }, []);

  const undoDelete = useCallback(() => {
    setLastDeleted((current) => {
      if (!current) return current;
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      const next = [...todosSnapshot];
      next.splice(Math.min(current.index, next.length), 0, current.item);
      commit(next);
      return null;
    });
  }, []);

  return {
    todos,
    isLoaded,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    lastDeleted,
    undoDelete,
  };
}
