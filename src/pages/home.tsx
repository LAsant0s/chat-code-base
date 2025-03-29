import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">Bem-vindo ao Chat App</h1>
      <div className="space-y-4">
        <Link 
          to="/login" 
          className="block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Fazer Login
        </Link>
        <Link 
          to="/chat" 
          className="block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
        >
          Ir para o Chat
        </Link>
      </div>
    </div>
  );
} 