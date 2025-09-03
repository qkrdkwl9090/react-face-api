import { FaceDetectionPanel } from '@/widgets/face-detection-panel';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(56,189,248,0.05)_60deg,transparent_120deg)]"></div>
      </div>

      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <header className="text-center mb-16">          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-slate-300 bg-clip-text text-transparent mb-4 tracking-tight">
            Face API.js
          </h1>
          
          <h2 className="text-xl md:text-2xl font-light text-slate-300 mb-6">
            Demo Application
          </h2>
        </header>
        
        {/* Main Panel */}
        <div className="max-w-7xl mx-auto">
          <FaceDetectionPanel />
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-slate-500">
          <p className="text-sm">
            Powered by Face-api.js • Built with React & TypeScript
          </p>
        </footer>
      </main>
    </div>
  );
}