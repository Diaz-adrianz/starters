import { QueryProvider, ThemeProvider } from './providers';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { AuthInitializer } from '@/features/auth';

export function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light">
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
