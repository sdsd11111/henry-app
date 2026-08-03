'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Dumbbell, Shield, Award, Users, RefreshCw, LogOut, CheckCircle, Plus } from 'lucide-react';

export default function Home() {
  // App state
  const [viewMode, setViewMode] = useState<'client' | 'vip' | 'coach'>('client');
  const [user, setUser] = useState<any>(null);
  
  // Modals state
  const [showCoachLoginModal, setShowCoachLoginModal] = useState(false);
  const [showVipLoginModal, setShowVipLoginModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);

  // Form states
  const [coachUsername, setCoachUsername] = useState('henry_coach');
  const [coachPassword, setCoachPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // VIP Login state
  const [vipUsername, setVipUsername] = useState('');
  const [vipPassword, setVipPassword] = useState('');
  const [vipLoginError, setVipLoginError] = useState('');

  // Clients state
  const [clients, setClients] = useState<any[]>([]);

  // Handle Coach Login
  const handleCoachLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login_coach',
          username: coachUsername,
          password: coachPassword
        })
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setViewMode('coach');
        setShowCoachLoginModal(false);
      } else {
        setLoginError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setLoginError('Error de conexión al servidor Vercel / Next.js');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle VIP Login
  const handleVipLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setVipLoginError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login_vip',
          username: vipUsername,
          password: vipPassword
        })
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setViewMode('vip');
        setShowVipLoginModal(false);
      } else {
        setVipLoginError(data.message || 'Credenciales VIP incorrectas');
      }
    } catch (err) {
      setVipLoginError('Error de conexión al servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setViewMode('client');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold tracking-wide text-lg text-white">TEAM HENRY CASTILLO</h1>
              <p className="text-xs text-slate-400 font-medium">Plataforma de Entrenamiento Personalizado</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-3">
            {user?.role === 'coach' ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Coach: {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Salir
                </button>
              </div>
            ) : user?.role === 'vip' ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> VIP: {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowVipLoginModal(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-md shadow-purple-600/20 flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" /> Portal VIP
                </button>
                <button
                  onClick={() => setShowCoachLoginModal(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" /> Panel Coach
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {viewMode === 'coach' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-amber-400" /> Panel de Control de Coach
                </h2>
                <p className="text-sm text-slate-400 mt-1">Gestión de atletas, rutinas diarias y seguimiento de progresos.</p>
              </div>
              <button
                onClick={() => setShowNewClientModal(true)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" /> Registrar Nuevo Atleta
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Atletas de Piso</div>
                <div className="text-3xl font-extrabold text-white">0</div>
                <p className="text-xs text-slate-500">Asistencia y control directo</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider">Clientes VIP</div>
                <div className="text-3xl font-extrabold text-purple-300">0</div>
                <p className="text-xs text-slate-500">Acceso a portal exclusivo</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Base de Datos</div>
                <div className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 mt-2">
                  <CheckCircle className="w-4 h-4" /> Conectado a StackCP MySQL
                </div>
                <p className="text-xs text-slate-500">Sincronización Serverless en Vercel</p>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'client' && (
          <div className="text-center py-16 space-y-6">
            <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 mb-2">
              <Dumbbell className="w-12 h-12" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Bienvenido al Portal de Entrenamiento
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Selecciona tu modalidad de acceso en la barra superior. Si eres Coach, ingresa mediante el Panel Coach. Si eres Cliente VIP, accede con tus credenciales asignadas.
            </p>
          </div>
        )}
      </div>

      {/* Modal: Coach Login */}
      {showCoachLoginModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Acceso al Panel Coach</h3>
              <p className="text-xs text-slate-400">Ingresa tus credenciales autorizadas de entrenador</p>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center font-medium">
                {loginError}
              </div>
            )}

            <form onSubmit={handleCoachLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Usuario Coach
                </label>
                <input
                  type="text"
                  value={coachUsername}
                  onChange={(e) => setCoachUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  placeholder="Ej: henry_coach"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Contraseña
                </label>
                <input
                  type="password"
                  value={coachPassword}
                  onChange={(e) => setCoachPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCoachLoginModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © 2026 Team Henry Castillo — Desarrollado en Next.js & React para Vercel
      </footer>
    </main>
  );
}
