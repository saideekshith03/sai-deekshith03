import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Camera, Lock, User, Shield, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage = () => {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      await login(username, password);
      const redirectUrl = searchParams.get('redirect') || '/admin/dashboard';
      navigate(redirectUrl);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-red-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-amber-500/10 blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-xl shadow-red-950 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            CHINNI <span className="text-red-500">DIGITALS</span>
          </h1>
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            Studio Owner Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-500" /> Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-500" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-red-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>{isLoading ? 'Verifying...' : 'Sign In to Dashboard'}</span>
            </button>
          </form>

          {/* Quick Demo Credentials Tip */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 text-[11px] text-zinc-400 space-y-1">
            <div className="font-bold text-zinc-300">Default Studio Admin Access:</div>
            <div className="font-mono text-zinc-400 flex items-center justify-between">
              <span>User: <strong className="text-white">admin</strong></span>
              <span>Pass: <strong className="text-white">admin123</strong></span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            &larr; Back to Public Studio Website
          </Link>
        </div>
      </div>
    </div>
  );
};
