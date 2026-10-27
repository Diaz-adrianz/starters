import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ConfirmProvider } from '@/components/shared/confirm';
import { ThemeProvider } from './providers/theme.provider';
import { QueryProvider } from './providers/query.provider';
import { AbilityProvider } from './providers/ability.provider';

export function App() {
  return (
    <QueryProvider>
      <AbilityProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <ConfirmProvider>
              <RouterProvider router={router} />
              <Toaster position="top-center" richColors />
            </ConfirmProvider>
          </TooltipProvider>
        </ThemeProvider>
      </AbilityProvider>
    </QueryProvider>
  );
}

export default App;
