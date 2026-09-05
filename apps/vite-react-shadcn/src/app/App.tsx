import { QueryProvider, ThemeProvider } from './providers';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { AuthInitializer } from '@/features/auth';
import { Toaster } from '@/components/ui/sonner';

export function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light">
        <AuthInitializer>
          <RouterProvider router={router} />
          <Toaster position="top-center" expand richColors />
        </AuthInitializer>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
