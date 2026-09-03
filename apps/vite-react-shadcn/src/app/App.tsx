import { ThemeProvider } from './providers';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';

export function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
