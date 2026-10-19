import React from 'react';
import { Camera, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0C] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center mb-4">
            <Camera className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-black text-2xl text-white mb-2">CHINNI DIGITALS</h2>
          <p className="text-zinc-400 text-sm max-w-md mb-6">
            Something unexpected occurred while rendering the page. Click below to refresh.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Website</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
