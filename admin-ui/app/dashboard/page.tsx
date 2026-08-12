'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchWithAuth, logout } from '@/lib/api';

export default function DashboardPage() {
  const [leadsCount, setLeadsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/leads/list/?page_size=1')
      .then((res) => res.json())
      .then((data) => {
        setLeadsCount(data.count || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-amber-500 mb-8">Admin Box 5G</h2>
          <nav className="space-y-2">
            <Link href="/dashboard" className="block px-4 py-2 bg-slate-800 text-amber-400 font-semibold rounded-lg">
              Tableau de bord
            </Link>
            <Link href="/home-page" className="block px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-lg transition">
              Page d'accueil (FR/AR)
            </Link>
            <Link href="/site-config" className="block px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-lg transition">
              Config du site
            </Link>
            <Link href="/leads" className="block px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-lg transition flex justify-between items-center">
              <span>Commandes / Leads</span>
              {leadsCount !== null && (
                <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
                  {leadsCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        <button
          onClick={logout}
          className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-semibold text-sm transition"
        >
          Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm font-medium">Demandes totales</p>
            <p className="text-4xl font-extrabold text-amber-500 mt-2">
              {loading ? '...' : leadsCount}
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm font-medium">Statut API Backend</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-semibold text-emerald-400">Opérationnel</span>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm font-medium">Langues gérées</p>
            <p className="text-xl font-bold text-slate-200 mt-2">Français (FR) & العربيّة (AR)</p>
          </div>
        </div>
      </main>
    </div>
  );
}
