import { AbilityProvider, QueryProvider, ThemeProvider } from './providers';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export function App() {
  return (
    <QueryProvider>
      <AbilityProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <RouterProvider router={router} />
            <Toaster position="top-center" richColors />
          </TooltipProvider>
        </ThemeProvider>
      </AbilityProvider>
    </QueryProvider>
  );
}

export default App;
