import type { Components, Theme } from '@mui/material/styles';

/**
 * Theme 3: Nature Inspired コンポーネントスタイルオーバーライド
 *
 * デザインコンセプト:
 * - 自然な丸みを持つボーダーラジウス
 * - 柔らかいシャドウ効果
 * - 和のミニマルデザイン
 * - アクセシビリティ重視（コントラスト比確保）
 */
export const components: Components<Omit<Theme, 'components'>> = {
  // ボタン
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,               // 自然な丸み
        textTransform: 'none',         // 日本語に適切（大文字変換なし）
        fontWeight: 500,
        padding: '10px 24px',
        transition: 'all 0.3s ease',   // スムーズなアニメーション
        boxShadow: 'none',             // デフォルトはシャドウなし
        '&:hover': {
          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)', // ホバー時にグリーンのシャドウ
          transform: 'translateY(-2px)', // 浮き上がる効果
        },
        '&:active': {
          transform: 'translateY(0)',  // クリック時は元に戻す
        },
      },
      contained: {
        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.15)', // 少しシャドウをつける
        '&:hover': {
          boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
        },
      },
      outlined: {
        borderWidth: 2,                // 太めのボーダー
        '&:hover': {
          borderWidth: 2,
          backgroundColor: 'rgba(76, 175, 80, 0.04)', // ホバー時の背景色
        },
      },
    },
    defaultProps: {
      disableElevation: false,         // エレベーションは有効（カスタムシャドウを使用）
    },
  },

  // カード
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,              // 大きめの丸み（自然な印象）
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', // 柔らかいシャドウ
        transition: 'all 0.3s ease',
        border: '1px solid rgba(76, 175, 80, 0.1)', // 淡いグリーンのボーダー
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-4px)', // ホバー時に浮き上がる
        },
      },
    },
  },

  // ペーパー（ダイアログ、ドロワーなど）
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        backgroundImage: 'none',       // グラデーション背景を無効化
      },
      elevation1: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      elevation2: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      elevation3: {
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
      },
    },
  },

  // テキストフィールド
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          backgroundColor: '#FFFFFF',  // 白背景（入力しやすさ重視）
          transition: 'all 0.2s ease',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4CAF50',    // ホバー時にグリーン
            borderWidth: 2,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4CAF50',
            borderWidth: 2,
          },
        },
        '& .MuiInputLabel-root': {
          '&.Mui-focused': {
            color: '#4CAF50',          // フォーカス時のラベル色
          },
        },
      },
    },
  },

  // チップ
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,              // 丸みのあるチップ
        fontWeight: 500,
      },
      filled: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)', // グリーンの淡い背景
        color: '#388E3C',              // ダークグリーンのテキスト
        '&:hover': {
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
        },
      },
    },
  },

  // アラート
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
      },
      standardSuccess: {
        backgroundColor: 'rgba(102, 187, 106, 0.1)', // 薄いグリーン
        color: '#388E3C',
        '& .MuiAlert-icon': {
          color: '#66BB6A',
        },
      },
      standardError: {
        backgroundColor: 'rgba(229, 115, 115, 0.1)', // 薄いレッド
        color: '#C62828',
        '& .MuiAlert-icon': {
          color: '#E57373',
        },
      },
      standardWarning: {
        backgroundColor: 'rgba(255, 183, 77, 0.1)', // 薄いアンバー
        color: '#F57C00',
        '& .MuiAlert-icon': {
          color: '#FFB74D',
        },
      },
      standardInfo: {
        backgroundColor: 'rgba(100, 181, 246, 0.1)', // 薄いブルー
        color: '#1976D2',
        '& .MuiAlert-icon': {
          color: '#64B5F6',
        },
      },
    },
  },

  // アプリバー
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', // 柔らかいシャドウ
      },
      colorPrimary: {
        backgroundColor: '#4CAF50',    // プライマリグリーン
      },
    },
  },

  // ドロワー
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: '1px solid rgba(76, 175, 80, 0.1)', // 淡いグリーンのボーダー
        backgroundColor: '#FAFAF8',  // オフホワイト背景
      },
    },
  },

  // リスト項目
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        margin: '4px 8px',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(76, 175, 80, 0.08)', // グリーンのホバー背景
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(76, 175, 80, 0.16)', // グリーンの選択背景
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.24)',
          },
        },
      },
    },
  },

  // タブ
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',         // 日本語に適切
        fontWeight: 500,
        minHeight: 48,
        '&.Mui-selected': {
          color: '#4CAF50',            // 選択時はグリーン
        },
      },
    },
  },

  // スイッチ
  MuiSwitch: {
    styleOverrides: {
      root: {
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: '#4CAF50',            // ONの時はグリーン
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: '#4CAF50',
        },
      },
    },
  },

  // ダイアログ
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 12,              // 大きめの丸み
      },
    },
  },

  // リンク
  MuiLink: {
    styleOverrides: {
      root: {
        color: '#4CAF50',              // グリーン
        textDecorationColor: 'rgba(76, 175, 80, 0.4)',
        transition: 'all 0.2s ease',
        '&:hover': {
          color: '#388E3C',            // ダークグリーン
          textDecorationColor: '#388E3C',
        },
      },
    },
  },

  // ツールチップ
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: '#2C3E2E',    // ダークグリーングレー
        fontSize: '0.875rem',
        borderRadius: 4,
      },
      arrow: {
        color: '#2C3E2E',
      },
    },
  },

  // プログレスバー
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
      },
      bar: {
        borderRadius: 4,
        backgroundColor: '#4CAF50',
      },
    },
  },
};
