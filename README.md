# ToDo リスト Web アプリ

Next.js（App Router）+ JavaScript + Tailwind CSS で作った、シンプルなToDoリストアプリです。

## 機能

- タスクの追加・完了マーク・削除
- `localStorage` によるデータ永続化（ブラウザを閉じても保持）
- UI/UXの5つの落とし穴への対策
  - 空状態: タスク0件時に案内メッセージを表示
  - フィードバック: 追加/削除のトランジション、空文字入力時のシェイクアニメーション
  - 誤操作防止: 削除は「元に戻す」トースト付き（5秒間取り消し可能）
  - コントラスト/タップ領域: ボタン・チェックボックスは44px以上の十分なタップ領域
  - ローディング/エラー状態: 初回読み込み中はスケルオン表示、破損データはフォールバック

## 技術スタック

- Next.js (App Router) / React
- JavaScript
- Tailwind CSS
- localStorage（`useSyncExternalStore` によるハイドレーション安全な実装）

## 開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いて確認できます。

## ビルド

```bash
npm run build
```
