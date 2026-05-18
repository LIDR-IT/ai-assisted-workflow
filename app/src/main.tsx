import { createRoot } from 'react-dom/client';
import { App } from './app/App.tsx';
import './styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found. Make sure your HTML file has an element with id='root'");
}
createRoot(rootElement).render(<App />);
