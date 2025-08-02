# T-Forms: 高機能オンラインフォームビルダー

**T-Forms**は、Googleフォームのような直感的なUIと、モダンな技術スタックによる高い拡張性・保守性を両立したオープンソースのフォーム作成・集計アプリです。
ユーザ認証はFirebase AuthをデータベースはFirebase Firestoreを使用しています。

## 主な特徴

- **多様な質問タイプ**
  - テキスト入力
  - メールアドレス入力（バリデーション付き）
  - 単一選択（ラジオボタン）
  - 複数選択（チェックボックス）
  - 5段階評価（星）
- **質問ごとに必須設定可能**
- **ドラッグ&ドロップで質問順を並べ替え**
- **多言語対応（日本語・英語）**
  - ブラウザ言語自動判定＆地球アイコンで切替
- **認証機能**
  - Firebase Auth（メール/パスワード・Googleログイン）
- **アクセス制御**
  - 自分のフォームだけ編集・削除・結果閲覧可能
- **Firestoreによるリアルタイム保存**
- **回答集計のグラフ化**
  - テキスト/メール: 一覧表示
  - ラジオ/チェックボックス: 棒グラフ
  - 評価: 円グラフ
- **CSV/Excelエクスポート**
  - 結果画面からワンクリックで全回答をCSVまたはExcel（.xlsx）でダウンロード
- **QRコード共有**
  - フォーム一覧からワンクリックで投票ページURLのQRコードを表示・サイズ調整可能
- **リアルタイム集計**
  - 回答結果はFirestoreのonSnapshotで自動更新
- **レスポンシブデザイン**
- **型安全・ESLint完全対応**
- **Firebase Hostingデプロイ対応**

## 技術スタック

- React (TypeScript)
- Material-UI (MUI)
- React Router
- Vite
- Zustand
- Recharts
- react-i18next / i18next / i18next-browser-languagedetector
- Firebase (Auth, Firestore, Hosting)
- ESLint / TypeScript ESLint

## ディレクトリ構成

```
t-forms/
├── public/
│   └── locales/      # 多言語対応の翻訳ファイル
│       ├── en/
│       └── ja/
├── src/
│   ├── components/
│   │   ├── pages/      # 各ページのコンポーネント
│   │   └── ui/         # 再利用可能なUIコンポーネント（例: LanguageSwitcher）
│   ├── store/          # Zustandストア
│   ├── types/          # 型定義
│   ├── App.tsx         # ルートとルーティング
│   ├── i18n.ts         # i18next設定
│   └── main.tsx        # エントリーポイント
└── ...
```

## 回答集計のグラフ表示

- **ラジオボタン/チェックボックス:** 棒グラフ (BarChart)
- **評価（星）:** 円グラフ (PieChart)
- **テキスト/メール:** 一覧表示

## i18n（多言語対応）

- `public/locales/ja/translation.json` と `public/locales/en/translation.json` で管理
- ブラウザの言語を自動判定し、地球アイコンで切り替え可能
- 翻訳キーを追加する際は、両言語ファイルに同じキーを追加

## Firestoreセキュリティルール

- forms: 全員が閲覧可能、作成者のみ編集・削除・結果閲覧可能
- responses: フォーム作成者のみ閲覧可能

## デプロイと最適化

- Viteの自動コード分割 + React.lazy/Suspenseで高速初期ロード
- chunkSizeWarningLimitを調整
- Firebase Hostingへの最適なデプロイが可能

## CSV/Excelエクスポート

- 結果画面からワンクリックで全回答をCSVまたはExcel（.xlsx）でダウンロード
- チェックボックスの値はカンマ区切りの選択肢ラベルとして出力
- Excelエクスポートはexceljs + file-saverで安全に実装

## 開発と運用手順

1. `npm install`
2. `.env` にFirebase設定を記述
3. `npm run dev` でローカル起動
4. `npm run build` → `firebase deploy --only hosting` で本番環境にデプロイ

