'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';

export default function HomePageEditor() {
  const [locale, setLocale] = useState<'fr' | 'ar'>('fr');
  const [homeData, setHomeData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchWithAuth(`/home-page/?locale=${locale}`)
      .then((res) => res.json())
      .then((res) => {
        setHomeData(res.data || {});
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [locale]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchWithAuth(`/home-page/?locale=${locale}`, {
        method: 'PUT',
        body: JSON.stringify(homeData),
      });
      if (res.ok) alert('Page d’accueil mise à jour !');
      else alert('Erreur de sauvegarde');
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
            <Link href="/home-page" className="block px-4 py-2 bg-slate-800 text-amber-400 font-semibold rounded-lg">
              Page d'accueil (FR/AR)
            </Link>
            <Link href="/site-config" className="block px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-lg transition">
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
            <h1 className="text-3xl font-bold">Page d'accueil</h1>
            <p className="text-slate-400 text-sm mt-1">Édition des métas et des contenus des sections</p>
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
          <div className="p-8 text-center text-slate-500">Chargement...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">Méta SEO</h2>
              <div>
                <label className="block text-xs text-slate-400 font-semibold uppercase mb-1">Titre de la page</label>
                <input
                  type="text"
                  value={homeData.meta_title || ''}
                  onChange={(e) => setHomeData({ ...homeData, meta_title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold uppercase mb-1">Méta Description</label>
                <textarea
                  rows={3}
                  value={homeData.meta_description || ''}
                  onChange={(e) => setHomeData({ ...homeData, meta_description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Section Hero */}
            {homeData.hero && homeData.hero.slides && (
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">Section Hero (Bannières)</h2>
                {homeData.hero.slides.map((slide: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase">Slide {idx + 1}</h3>
                    <input
                      type="text"
                      placeholder="Titre"
                      value={slide.title || ''}
                      onChange={(e) => {
                        const newSlides = [...homeData.hero.slides];
                        newSlides[idx].title = e.target.value;
                        setHomeData({ ...homeData, hero: { ...homeData.hero, slides: newSlides } });
                      }}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-sm text-white"
                    />
                    <textarea
                      placeholder="Description"
                      rows={2}
                      value={slide.text || ''}
                      onChange={(e) => {
                        const newSlides = [...homeData.hero.slides];
                        newSlides[idx].text = e.target.value;
                        setHomeData({ ...homeData, hero: { ...homeData.hero, slides: newSlides } });
                      }}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-sm text-white"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Section À propos */}
            {homeData.about && (
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">Section À Propos</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase mb-1">Surtitre</label>
                    <input
                      type="text"
                      value={homeData.about.tagline || ''}
                      onChange={(e) => setHomeData({ ...homeData, about: { ...homeData.about, tagline: e.target.value } })}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase mb-1">Titre</label>
                    <input
                      type="text"
                      value={homeData.about.title || ''}
                      onChange={(e) => setHomeData({ ...homeData, about: { ...homeData.about, title: e.target.value } })}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold uppercase mb-1">Texte de présentation</label>
                  <textarea
                    rows={3}
                    value={homeData.about.text || ''}
                    onChange={(e) => setHomeData({ ...homeData, about: { ...homeData.about, text: e.target.value } })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>
            )}

            {/* Section Services */}
            {homeData.services && (
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">Section Services</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase mb-1">Titre</label>
                    <input
                      type="text"
                      value={homeData.services.title || ''}
                      onChange={(e) => setHomeData({ ...homeData, services: { ...homeData.services, title: e.target.value } })}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-semibold uppercase mb-1">Sous-titre</label>
                    <input
                      type="text"
                      value={homeData.services.subtitle || ''}
                      onChange={(e) => setHomeData({ ...homeData, services: { ...homeData.services, subtitle: e.target.value } })}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer la page'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
