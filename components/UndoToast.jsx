export function UndoToast({ lastDeleted, onUndo }) {
  if (!lastDeleted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
    >
      <div className="flex items-center gap-4 rounded-lg bg-zinc-900 px-4 py-3 text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
        <span className="truncate max-w-[50vw]">
          「{lastDeleted.item.text}」を削除しました
        </span>
        <button
          type="button"
          onClick={onUndo}
          className="shrink-0 font-medium text-blue-400 hover:underline dark:text-blue-600"
        >
          元に戻す
        </button>
      </div>
    </div>
  );
}
