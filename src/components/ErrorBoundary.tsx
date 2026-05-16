import { Component, ReactNode } from 'react';

type State = { error: Error | null; info?: string };

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error('[Pana Ambassadors] caught error', error, info);
    this.setState({ error, info: info.componentStack });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center px-5 text-white">
          <div className="max-w-2xl w-full rounded-3xl glass-strong p-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-red-400 font-bold mb-3">Algo se rompió</div>
            <h1 className="font-display text-3xl mb-3">Error en el render</h1>
            <p className="text-white/60 mb-4 text-sm">Comparte este detalle con el equipo:</p>
            <pre className="rounded-2xl bg-black/40 border border-white/10 p-4 text-xs text-red-200 overflow-x-auto whitespace-pre-wrap">
              {this.state.error.message}
              {'\n\n'}
              {this.state.error.stack?.slice(0, 2000)}
              {this.state.info ? '\n\nComponent stack:\n' + this.state.info : ''}
            </pre>
            <div className="mt-5 flex gap-2">
              <button onClick={() => { this.setState({ error: null }); window.location.reload(); }} className="btn-lime !py-2.5 !px-4 text-sm">Reintentar</button>
              <a href="/" className="btn-ghost !py-2.5 !px-4 text-sm">Volver al inicio</a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
