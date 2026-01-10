import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { components } from './components';

/**
 * Lingo Keeper JP - Theme 3: Nature Inspired
 *
 * デザインコンセプト:
 * - 自然をイメージした落ち着いた色調
 * - グリーン系配色で目の疲れを軽減
 * - 和の要素を取り入れたデザイン
 * - 長時間学習に最適な配色
 * - 集中力を高める効果
 *
 * 技術スタック:
 * - MUI v6
 * - TypeScript 5
 * - Noto Sans JP（日本語フォント）
 *
 * 使い方:
 * ```tsx
 * import { ThemeProvider } from '@mui/material/styles';
 * import CssBaseline from '@mui/material/CssBaseline';
 * import theme from './theme';
 *
 * function App() {
 *   return (
 *     <ThemeProvider theme={theme}>
 *       <CssBaseline />
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */

// MUIテーマの作成
const theme: Theme = createTheme({
  // カラーパレット
  palette,

  // タイポグラフィ（日本語対応）
  typography,

  // コンポーネントスタイルオーバーライド
  components,

  // ブレークポイント（レスポンシブ対応）
  breakpoints: {
    values: {
      xs: 0,      // モバイル（小）
      sm: 600,    // モバイル（大）/ タブレット（小）
      md: 960,    // タブレット（大）
      lg: 1280,   // デスクトップ（小）
      xl: 1920,   // デスクトップ（大）
    },
  },

  // シェイプ（デフォルトのborderRadius）
  shape: {
    borderRadius: 8,  // 自然な丸み
  },

  // スペーシング（デフォルト: 8px）
  spacing: 8,

  // z-index階層
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },

  // トランジション設定
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

// デフォルトエクスポート
export default theme;

/**
 * カスタムカラーの型拡張（必要に応じて使用）
 *
 * 例: テーマに独自のカラーを追加したい場合
 *
 * ```ts
 * declare module '@mui/material/styles' {
 *   interface Palette {
 *     accent: Palette['primary'];
 *   }
 *   interface PaletteOptions {
 *     accent?: PaletteOptions['primary'];
 *   }
 * }
 * ```
 */

/**
 * 次のステップ:
 *
 * 1. index.htmlにGoogleフォントを追加:
 *    <link rel="preconnect" href="https://fonts.googleapis.com">
 *    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 *    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
 *
 * 2. main.tsx または App.tsx でテーマを適用:
 *    import { ThemeProvider } from '@mui/material/styles';
 *    import CssBaseline from '@mui/material/CssBaseline';
 *    import theme from './theme';
 *
 * 3. ダークモード実装（オプション）:
 *    - useMemoとuseStateでモード切り替え
 *    - paletteのmodeプロパティを'light' | 'dark'で制御
 */
