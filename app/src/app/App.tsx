import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from '@/contexts';

export function App() {
  return (
    <AppProvider persistState={true}>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
