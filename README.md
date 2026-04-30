# medical-QA Ver0.1

nyanta-medical 問診UI 改善・自動検査

問診票で、スマホでも入力しやすく、アクセシビリティ検査まで自動化できるようにした改善版です。

対象: https://manualine.tech/nyanta/medical

確認できた実ページ情報:

- `nyanta-medical 問診票`
- `v0.6`
- `あと25問`
- `質問を変える` 導線

このフォルダには、医療問診UIとして優先度が高い改善を反映したローカル版と、自動検査を入れています。

## 改善した点

- `label` / `input` の明示的な紐付け
- 選択肢には `fieldset` / `legend` を使用
- 入力進捗の表示
- `localStorage` による自動保存
- エラー文言の具体化
- `role="alert"` と `aria-invalid` による支援技術対応
- エラー時に該当項目へスクロール
- 44px以上のタップ領域
- WCAG AA を想定したコントラスト
- Playwright + axe-core の自動検査

## 実行

```bash
npm install
npm run build
npm run codex:check
```

開発表示:

```bash
npm run dev
```

## 実サイトに入れる場合の優先順

1. 入力部品をこの改善版の構造に寄せる
2. 全25問を同じ質問データ形式に移す
3. 保存先がサーバーの場合も、送信前の一時保存は `localStorage` で保持する
4. CIで `npm run codex:check` を実行する
5. Lighthouse と axe DevTools で公開URLを追加確認する
