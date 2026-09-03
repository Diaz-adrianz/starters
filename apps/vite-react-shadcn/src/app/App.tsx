import { QueryProvider, ThemeProvider } from './providers';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';

export function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
