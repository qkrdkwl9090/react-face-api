import { ThemeProvider, FaceApiProvider } from './providers';
import { HomePage } from '@/pages/home';

export default function App() {
  return (
    <ThemeProvider>
      <FaceApiProvider>
        <div className="min-h-screen">
          <HomePage />
        </div>
      </FaceApiProvider>
    </ThemeProvider>
  );
}