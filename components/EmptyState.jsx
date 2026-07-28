export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-3xl dark:bg-zinc-800">
        📝
      </div>
      <p className="text-base font-medium text-zinc-700 dark:text-zinc-300">
        タスクはまだありません
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        上の入力欄から最初のタスクを追加してみましょう
      </p>
    </div>
  );
}
