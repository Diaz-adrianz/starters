import { AbilityProvider, QueryProvider, ThemeProvider } from './providers';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { Toaster } from '@/components/ui/sonner';

export function App() {
  return (
    <QueryProvider>
      <AbilityProvider>
        <ThemeProvider defaultTheme="light">
          <RouterProvider router={router} />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </AbilityProvider>
    </QueryProvider>
  );
}

export default App;
