import { AbilityProvider, QueryProvider, ThemeProvider } from './providers';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ConfirmProvider } from '@/components/shared/confirm';

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
