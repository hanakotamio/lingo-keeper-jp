import type { TypographyVariantsOptions } from '@mui/material/styles';

/**
 * Theme 3: Nature Inspired タイポグラフィ設定
 *
 * 日本語フォント対応:
 * - Noto Sans JP: Googleフォント（推奨）
 * - フォールバック: システムフォント（ヒラギノ、游ゴシック、メイリオなど）
 *
 * 設計思想:
 * - 長時間学習に適した読みやすさ
 * - 日本語学習アプリとして適切な文字サイズ
 * - レスポンシブ対応（モバイル・デスクトップ）
 */
export const typography: TypographyVariantsOptions = {
  // フォントファミリー: 日本語優先
  fontFamily: [
    'Noto Sans JP',           // Googleフォント（推奨）
    '-apple-system',          // macOS/iOS
    'BlinkMacSystemFont',     // Chrome on macOS
    'Segoe UI',               // Windows
    'Hiragino Sans',          // macOS (JP)
    'Hiragino Kaku Gothic ProN', // macOS (JP)
    'Yu Gothic',              // Windows (JP)
    'Meiryo',                 // Windows (JP)
    'sans-serif',             // フォールバック
  ].join(','),

  // 基本フォントサイズ: 16px（ブラウザデフォルト）
  fontSize: 16,

  // フォントウェイト定義
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,

  // h1: ページタイトル（大見出し）
  h1: {
    fontSize: '2.5rem',       // 40px
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.01562em',
    color: '#2C3E2E',         // ダークグリーングレー
  },

  // h2: セクションタイトル（中見出し）
  h2: {
    fontSize: '2rem',         // 32px
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.00833em',
    color: '#2C3E2E',
  },

  // h3: サブセクションタイトル（小見出し）
  h3: {
    fontSize: '1.75rem',      // 28px
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0em',
    color: '#2C3E2E',
  },

  // h4: カードタイトルなど
  h4: {
    fontSize: '1.5rem',       // 24px
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.00735em',
    color: '#2C3E2E',
  },

  // h5: サブタイトル
  h5: {
    fontSize: '1.25rem',      // 20px
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: '0em',
    color: '#2C3E2E',
  },

  // h6: 小さなタイトル
  h6: {
    fontSize: '1.125rem',     // 18px
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: '0.0075em',
    color: '#2C3E2E',
  },

  // subtitle1: サブタイトル（太字）
  subtitle1: {
    fontSize: '1rem',         // 16px
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.00938em',
    color: '#5A6C57',         // ミディアムグリーングレー
  },

  // subtitle2: サブタイトル（細字）
  subtitle2: {
    fontSize: '0.875rem',     // 14px
    fontWeight: 500,
    lineHeight: 1.57,
    letterSpacing: '0.00714em',
    color: '#5A6C57',
  },

  // body1: 本文（標準）
  body1: {
    fontSize: '1rem',         // 16px
    fontWeight: 400,
    lineHeight: 1.75,
    letterSpacing: '0.00938em',
    color: '#2C3E2E',
  },

  // body2: 本文（小さめ）
  body2: {
    fontSize: '0.875rem',     // 14px
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0.01071em',
    color: '#5A6C57',
  },

  // button: ボタンテキスト
  button: {
    fontSize: '0.875rem',     // 14px
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'none',    // 大文字変換なし（日本語に適切）
  },

  // caption: キャプション（説明文）
  caption: {
    fontSize: '0.75rem',      // 12px
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
    color: '#5A6C57',
  },

  // overline: オーバーライン（ラベル）
  overline: {
    fontSize: '0.75rem',      // 12px
    fontWeight: 500,
    lineHeight: 2.66,
    letterSpacing: '0.08333em',
    textTransform: 'uppercase',
    color: '#5A6C57',
  },
};

/**
 * Googleフォント読み込み用のHTMLタグ
 *
 * index.htmlの<head>内に以下を追加してください:
 *
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 * <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
 *
 * または、CSS内でインポート:
 *
 * @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap');
 */
