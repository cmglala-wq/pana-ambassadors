import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Sparkle from '../components/Sparkle';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 flex items-center justify-center px-5 pt-32 relative overflow-hidden">
        <Sparkle className="absolute top-1/4 left-1/4 w-6 animate-spinSlow opacity-50" color="#CFFF04"/>
        <Sparkle className="absolute bottom-1/3 right-1/4 w-4 animate-spinSlow [animation-delay:2s] opacity-50" color="#1E7FE0"/>
        <div className="text-center max-w-lg">
          <div className="font-display text-8xl gradient-text mb-4">404</div>
          <div className="font-display text-3xl mb-3">Esto no está en el mapa.</div>
          <p className="text-white/60 mb-8">La página que buscas no existe o se movió. Volvamos a tierra firme.</p>
          <Link to="/" className="btn-lime">Volver al inicio</Link>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
