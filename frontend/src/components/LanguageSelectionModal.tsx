import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardActionArea,
  Dialog,
  DialogContent,
  Grid,
} from '@mui/material';
import { Language as LanguageIcon, Check as CheckIcon } from '@mui/icons-material';
import type { SupportedLanguage } from '@/types';
import { SUPPORTED_LANGUAGES } from '@/constants/languages';
import { saveLanguagePreference } from '@/lib/storage';

interface LanguageSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Language Selection Modal Component
 *
 * 初回訪問時または言語設定がない場合に表示されるモーダル
 * ユーザーの母国語を選択し、翻訳表示の言語として使用する
 */
export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  open,
  onClose,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage | null>(null);

  const handleLanguageSelect = (languageCode: SupportedLanguage) => {
    setSelectedLanguage(languageCode);
  };

  const handleConfirm = () => {
    if (selectedLanguage) {
      saveLanguagePreference(selectedLanguage);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        // Backdropクリックやエスケープキーでは閉じない（言語選択必須）
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
        onClose();
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: 'linear-gradient(135deg, #7A9C5E 0%, #C9A573 100%)',
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              mb: 2,
            }}
          >
            <LanguageIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          </Box>

          <Typography variant="h4" component="h2" color="white" mb={1}>
            母国語を選択してください
          </Typography>

          <Typography variant="body1" color="rgba(255, 255, 255, 0.9)">
            選択した言語で日本語の翻訳が表示されます
          </Typography>
        </Box>

        {/* Language Grid */}
        <Card sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.95)', p: 2 }}>
          <Grid container spacing={2}>
            {SUPPORTED_LANGUAGES.map(language => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={language.code}>
                <Card
                  sx={{
                    position: 'relative',
                    border: '2px solid',
                    borderColor:
                      selectedLanguage === language.code
                        ? 'primary.main'
                        : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor:
                        selectedLanguage === language.code
                          ? 'primary.main'
                          : 'rgba(122, 156, 94, 0.3)',
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleLanguageSelect(language.code)}
                    sx={{ p: 2 }}
                  >
                    <Box textAlign="center">
                      <Typography variant="h3" component="div" mb={1}>
                        {language.flag}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        color="text.primary"
                        mb={0.5}
                      >
                        {language.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {language.englishName}
                      </Typography>
                    </Box>

                    {/* Check Mark */}
                    {selectedLanguage === language.code && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'primary.main',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckIcon sx={{ fontSize: 16, color: 'white' }} />
                      </Box>
                    )}
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>

        {/* Confirm Button */}
        <Button
          variant="contained"
          color="warning"
          size="large"
          fullWidth
          onClick={handleConfirm}
          disabled={!selectedLanguage}
          sx={{
            py: 1.5,
            fontWeight: 'bold',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'white',
            },
            '&:disabled': {
              bgcolor: 'rgba(255, 255, 255, 0.5)',
              color: 'rgba(122, 156, 94, 0.5)',
            },
          }}
        >
          {selectedLanguage ? '確定' : '言語を選択してください'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelectionModal;
