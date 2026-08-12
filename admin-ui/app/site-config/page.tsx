'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';

export default function SiteConfigPage() {
  const [locale, setLocale] = useState<'fr' | 'ar'>('fr');
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchWithAuth(`/site-config?locale=${locale}`)
      .then((res) => res.json())
      .then((res) => {
        setConfig(res.data || {});
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [locale]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchWithAuth(`/site-config?locale=${locale}`, {
        method: 'PUT',
        body: JSON.stringify(config),
      });
      if (res.ok) alert('Configuration enregistrée avec succès !');
      else alert('Erreur lors de la sauvegarde');
    } catch (err) {
      alert('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-amber-500 mb-8">Admin Box 5G</h2>
          <nav className="space-y-2">
            <Link href="/dashboard" className="block px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-lg transition">
              Tableau de bord
            </Link>
            <Link href="/home-page" className="block px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-lg transition">
              Page d'accueil (FR/AR)
            </Link>
            <Link href="/site-config" className="block px-4 py-2 bg-slate-800 text-amber-400 font-semibold rounded-lg">
              Config du site
            </Link>
            <Link href="/leads" className="block px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-lg transition">
              Commandes / Leads
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Configuration du site</h1>
            <p className="text-slate-400 text-sm mt-1">Identité, contacts et navigation</p>
          </div>

          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setLocale('fr')}
              className={`px-4 py-1.5 rounded-md font-bold text-sm transition ${locale === 'fr' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
            >
              Français (FR)
            </button>
            <button
              onClick={() => setLocale('ar')}
              className={`px-4 py-1.5 rounded-md font-bold text-sm transition ${locale === 'ar' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
            >
              العربية (AR)
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Chargement de la configuration...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">Identité</h2>
              <div>
                <label className="block text-xs text-slate-400 font-semibold uppercase mb-1">Nom du site</label>
                <input
                  type="text"
                  value={config.site_name || ''}
                  onChange={(e) => setConfig({ ...config, site_name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">Coordonnées</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold uppercase mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={config.phone || ''}
                    onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={config.email || ''}
                    onChange={(e) => setConfig({ ...config, email: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold uppercase mb-1">Adresse</label>
                <input
                  type="text"
                  value={config.address || ''}
                  onChange={(e) => setConfig({ ...config, address: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
