import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-8">Página não encontrada</h2>
      <p className="text-lg mb-8 text-center max-w-md">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Voltar para Home
      </Link>
    </div>
  );
} 