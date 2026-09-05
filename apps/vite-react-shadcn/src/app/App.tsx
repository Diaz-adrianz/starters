import { QueryProvider, ThemeProvider } from './providers';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { Toaster } from '@/components/ui/sonner';

export function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light">
        <RouterProvider router={router} />
        <Toaster position="top-center" expand richColors />
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
