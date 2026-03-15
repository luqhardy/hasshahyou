<!-- markdownlint-disable MD033 MD025 -->
# Hassha Hyō (発車標) - Train Departure Board

*Read this in other languages: [English](#english) | [日本語](#日本語)*

<a id="english"></a>

A Vue 3 web application that simulates a Japanese train station departure board (Hassha Hyō / 発車標). It features a realistic LED-style display with multi-language support (Japanese/English), scrolling text animations, and station selection. The project is designed to integrate with the Public Transportation Open Data Center (ODPT) via Vercel Serverless Functions.

## Features

- 🚉 **Realistic Display**: Accurately simulates train station LED boards using the "DotGothic16" font.
- 🌍 **Bilingual Support**: Instantly toggle between Japanese (日本語) and English.
- 🚆 **Routing & Selection**: Choose between various lines and stations (e.g., Tokyo Metro Ginza Line, JR East Yamanote Line).
- 📡 **Serverless API Integration**: Includes an API endpoint (`/api/trains`) built with Vercel Serverless Functions to serve train timetable data (currently mock data, preparing for actual ODPT API integration).
- 🏃 **Scrolling Marquee**: Features smooth CSS-animated scrolling text for boarding information and announcements.

## Tech Stack

- **Frontend**: Vue 3 (Composition API), Vite, TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router
- **Backend / API**: Vercel Serverless Functions (Node.js)
- **Testing**: Vitest (Unit Tests), Playwright (E2E Tests)
- **Linting & Formatting**: ESLint, Oxlint, Prettier

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.19.0 or higher)

### Installation

Install the project dependencies:

```sh
npm install
```

## Development

Run the frontend development server with Hot-Module Replacement (HMR).

```sh
npm run dev
```

*Note: Since the API routes are located in the `api/` directory, if you want to test the serverless functions locally alongside the Vue app, it is highly recommended to run the app using the [Vercel CLI](https://vercel.com/docs/cli):*

```sh
npx vercel dev
```

## Scripts & Commands

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Testing

Run Unit Tests with [Vitest](https://vitest.dev/):

```sh
npm run test:unit
```

Run End-to-End Tests with [Playwright](https://playwright.dev):

```sh
# Install browsers for the first run if you haven't already
npx playwright install

# Run E2E tests
npm run test:e2e
```

### Linting and Formatting

Run linters (ESLint & Oxlint):

```sh
npm run lint
```

Format code with Prettier:

```sh
npm run format
```

## Disclaimer

**Data Source:** Public Transportation Open Data Center (公共交通オープンデータセンター).
This application uses open data provided by public transportation operators.

**⚠️ Important:** The transit operators (e.g., JR, Tokyo Metro) are not responsible for this application. Please **do not contact station staff or the railway companies** regarding the information displayed here.

---

<a id="日本語"></a>

# Hassha Hyō (発車標) - 列車発車案内表示板

日本の駅の電光掲示板（発車標）を再現したVue 3ウェブアプリケーションです。リアルなLED風の表示、多言語対応（日本語・英語）、スクロールするテキストアニメーション、駅選択機能を備えています。このプロジェクトは、Vercel Serverless Functionsを通じて公共交通オープンデータセンター（ODPT）と連携するように設計されています。

## 機能

- 🚉 **リアルな表示**: "DotGothic16" フォントを使用して、駅のLED掲示板を正確にシミュレートします。
- 🌍 **バイリンガル対応**: 日本語と英語を瞬時に切り替え可能。
- 🚆 **路線・駅の選択**: さまざまな路線や駅（例：東京メトロ銀座線、JR東日本山手線）を選択できます。
- 📡 **サーバーレスAPI連携**: 列車の時刻表データを提供するVercel Serverless Functions（`/api/trains`）を利用したAPIエンドポイントが含まれています（現在はモックデータですが、実際のODPT APIとの連携を準備中です）。
- 🏃 **スクロールマーキー**: スムーズなCSSアニメーションによる、乗車案内やアナウンスのスクロールテキスト機能を搭載しています。

## 技術スタック

- **フロントエンド**: Vue 3 (Composition API), Vite, TypeScript
- **状態管理**: Pinia
- **ルーティング**: Vue Router
- **バックエンド / API**: Vercel Serverless Functions (Node.js)
- **テスト**: Vitest (単体テスト), Playwright (E2Eテスト)
- **リンター & フォーマッター**: ESLint, Oxlint, Prettier

## プロジェクトのセットアップ

### 必須環境

- [Node.js](https://nodejs.org/) (v20.19.0 以上)

### インストール

プロジェクトの依存関係をインストールします：

```sh
npm install
```

## 開発

Hot-Module Replacement (HMR) が有効なフロントエンド開発サーバーを起動します。

```sh
npm run dev
```

*注意：APIルートは `api/` ディレクトリに配置されているため、Vueアプリと一緒にローカルでサーバーレス関数をテストする場合は、[Vercel CLI](https://vercel.com/docs/cli) を使用してアプリを実行することを強くお勧めします：*

```sh
npx vercel dev
```

## スクリプトとコマンド

### 本番用の型チェック、コンパイル、および最小化

```sh
npm run build
```

### テスト

Vitestを使用した単体テストの実行：

```sh
npm run test:unit
```

Playwrightを使用したE2Eテストの実行：

```sh
# 初回のみブラウザをインストール
npx playwright install

# E2Eテストを実行
npm run test:e2e
```

### リンターとフォーマッター

リンター（ESLint & Oxlint）の実行：

```sh
npm run lint
```

Prettierでコードをフォーマット：

```sh
npm run format
```

## 免責事項

**データソース:** 公共交通オープンデータセンター。
本アプリケーションは、公共交通事業者が提供するオープンデータを使用しています。

**⚠️ 重要:** 交通機関（例：JR、東京メトロなど）は本アプリケーションに関与していません。ここに表示される情報について、**駅係員や鉄道会社へのお問い合わせはお控えください**。
