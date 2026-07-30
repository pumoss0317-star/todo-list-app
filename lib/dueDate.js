export const DUE_AT_PATTERN = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/;

export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDueAt(dueAt) {
  if (!dueAt) return null;

  const [datePart, timePart] = dueAt.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const hasTime = Boolean(timePart);
  const [hour, minute] = hasTime ? timePart.split(":").map(Number) : [0, 0];

  return {
    dateKey: datePart,
    hasTime,
    date: new Date(year, month - 1, day, hour, minute),
  };
}

export function formatDueBadge(dueAt) {
  const parsed = parseDueAt(dueAt);
  if (!parsed) return "";

  const { date, hasTime } = parsed;
  const datePart = `${date.getMonth() + 1}/${date.getDate()}`;
  if (!hasTime) return datePart;

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${datePart} ${hh}:${mm}`;
}

export function isOverdue(todo) {
  if (todo.completed || !todo.dueAt) return false;

  const parsed = parseDueAt(todo.dueAt);
  if (!parsed) return false;

  const { date, hasTime } = parsed;
  if (hasTime) return date < new Date();

  const startOfNextDay = new Date(date);
  startOfNextDay.setDate(startOfNextDay.getDate() + 1);
  return startOfNextDay <= new Date();
}
