import type { Meta, StoryObj } from '@storybook/react';
import { LoginPage } from '@/pages/LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof LoginPage> = {
  title: 'Pages/LoginPage',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Story />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoginPage>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ログインページのデフォルト表示',
      },
    },
  },
};

export const WithError: Story = {
  play: async ({ canvasElement }) => {
    const emailInput = canvasElement.querySelector('input[type="email"]') as HTMLInputElement;
    const passwordInput = canvasElement.querySelector('input[type="password"]') as HTMLInputElement;
    const submitButton = canvasElement.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (emailInput && passwordInput && submitButton) {
      emailInput.value = 'wrong@example.com';
      passwordInput.value = 'wrongpassword';
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
  parameters: {
    docs: {
      description: {
        story: '認証エラーが発生する場合のシナリオ',
      },
    },
  },
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ログイン処理中の状態',
      },
    },
  },
};
