import { ThemeProvider, FaceApiProvider } from './providers';
import { HomePage } from '@/pages/home';

export default function App() {
  return (
    <ThemeProvider>
      <FaceApiProvider>
        <div className="min-h-screen bg-dark-950 text-white">
          <HomePage />
        </div>
      </FaceApiProvider>
    </ThemeProvider>
  );
}