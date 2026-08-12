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
      if (res.ok) alert('Page d’accueil mise à jour avec succès !');
      else alert('Erreur de sauvegarde');
    } catch (err) {
      alert('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/media/upload/', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        callback(data.url);
      } else {
        alert("Erreur lors de l'envoi de l'image");
      }
    } catch (err) {
      alert("Erreur réseau lors de l'upload");
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
      <main className="flex-1 p-10 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Éditeur de la Page d'accueil</h1>
            <p className="text-slate-400 text-sm mt-1">Gestion modulaire et granulaire de toutes les sections</p>
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
          <div className="p-8 text-center text-slate-500">Chargement de la page d'accueil...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            {/* 1. Méta SEO */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">1. Référencement & Méta SEO</h2>
              <div>
                <label className="block text-xs text-slate-400 font-semibold uppercase mb-1">Méta Titre (meta_title)</label>
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
                  rows={2}
                  value={homeData.meta_description || ''}
                  onChange={(e) => setHomeData({ ...homeData, meta_description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </div>

            {/* 2. Hero Slider */}
            {homeData.hero && (
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h2 className="text-lg font-bold text-amber-400">2. Hero Slider (Bannières principales)</h2>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={homeData.hero.enabled ?? true}
                      onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, enabled: e.target.checked } })}
                      className="rounded accent-amber-500"
                    />
                    Section activée
                  </label>
                </div>

                {homeData.hero.slides?.map((slide: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-500 uppercase">Slide {idx + 1}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Badge</label>
                        <input
                          type="text"
                          value={slide.badge || ''}
                          onChange={(e) => {
                            const slides = [...homeData.hero.slides];
                            slides[idx].badge = e.target.value;
                            setHomeData({ ...homeData, hero: { ...homeData.hero, slides } });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Titre surbrillance (Title Highlight)</label>
                        <input
                          type="text"
                          value={slide.titleHighlight || ''}
                          onChange={(e) => {
                            const slides = [...homeData.hero.slides];
                            slides[idx].titleHighlight = e.target.value;
                            setHomeData({ ...homeData, hero: { ...homeData.hero, slides } });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Titre principal</label>
                      <textarea
                        rows={2}
                        value={slide.title || ''}
                        onChange={(e) => {
                          const slides = [...homeData.hero.slides];
                          slides[idx].title = e.target.value;
                          setHomeData({ ...homeData, hero: { ...homeData.hero, slides } });
                        }}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Texte descriptif</label>
                      <textarea
                        rows={2}
                        value={slide.text || ''}
                        onChange={(e) => {
                          const slides = [...homeData.hero.slides];
                          slides[idx].text = e.target.value;
                          setHomeData({ ...homeData, hero: { ...homeData.hero, slides } });
                        }}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-sm text-white"
                      />
                    </div>

                    {/* Boutons du slide */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-900">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Libellé Bouton 1</label>
                        <input
                          type="text"
                          value={slide.btnPrimaryLabel || ''}
                          onChange={(e) => {
                            const slides = [...homeData.hero.slides];
                            slides[idx].btnPrimaryLabel = e.target.value;
                            setHomeData({ ...homeData, hero: { ...homeData.hero, slides } });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">URL Bouton 1</label>
                        <input
                          type="text"
                          value={slide.btnPrimaryUrl || ''}
                          onChange={(e) => {
                            const slides = [...homeData.hero.slides];
                            slides[idx].btnPrimaryUrl = e.target.value;
                            setHomeData({ ...homeData, hero: { ...homeData.hero, slides } });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Libellé Bouton 2</label>
                        <input
                          type="text"
                          value={slide.btnSecondaryLabel || ''}
                          onChange={(e) => {
                            const slides = [...homeData.hero.slides];
                            slides[idx].btnSecondaryLabel = e.target.value;
                            setHomeData({ ...homeData, hero: { ...homeData.hero, slides } });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">URL Bouton 2</label>
                        <input
                          type="text"
                          value={slide.btnSecondaryUrl || ''}
                          onChange={(e) => {
                            const slides = [...homeData.hero.slides];
                            slides[idx].btnSecondaryUrl = e.target.value;
                            setHomeData({ ...homeData, hero: { ...homeData.hero, slides } });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-sm text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Section Tarifs & Offres (Plans) */}
            {homeData.plans && (
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h2 className="text-lg font-bold text-amber-400">3. Section Offres & Tarifs (Plans)</h2>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={homeData.plans.enabled ?? true}
                      onChange={(e) => setHomeData({ ...homeData, plans: { ...homeData.plans, enabled: e.target.checked } })}
                      className="rounded accent-amber-500"
                    />
                    Section activée
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Titre principal</label>
                    <input
                      type="text"
                      value={homeData.plans.title || ''}
                      onChange={(e) => setHomeData({ ...homeData, plans: { ...homeData.plans, title: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Titre surbrillance</label>
                    <input
                      type="text"
                      value={homeData.plans.titleHighlight || ''}
                      onChange={(e) => setHomeData({ ...homeData, plans: { ...homeData.plans, titleHighlight: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-sm text-white"
                    />
                  </div>
                </div>

                {/* Groupes d'onglets (30M, 50M, 100M) */}
                {homeData.plans.groups?.map((group: any, gIdx: number) => (
                  <div key={gIdx} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-amber-500 uppercase">Onglet / Débit : {group.name}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {group.cards?.map((card: any, cIdx: number) => (
                        <div key={cIdx} className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Carte {cIdx + 1}</span>
                          <input
                            type="text"
                            placeholder="Nom du forfait"
                            value={card.title || ''}
                            onChange={(e) => {
                              const groups = [...homeData.plans.groups];
                              groups[gIdx].cards[cIdx].title = e.target.value;
                              setHomeData({ ...homeData, plans: { ...homeData.plans, groups } });
                            }}
                            className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Prix"
                              value={card.price || ''}
                              onChange={(e) => {
                                const groups = [...homeData.plans.groups];
                                groups[gIdx].cards[cIdx].price = e.target.value;
                                setHomeData({ ...homeData, plans: { ...homeData.plans, groups } });
                              }}
                              className="w-1/2 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="Badge (ex: Populaire)"
                              value={card.badge || ''}
                              onChange={(e) => {
                                const groups = [...homeData.plans.groups];
                                groups[gIdx].cards[cIdx].badge = e.target.value;
                                setHomeData({ ...homeData, plans: { ...homeData.plans, groups } });
                              }}
                              className="w-1/2 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Section FAQ */}
            {homeData.faq && (
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h2 className="text-lg font-bold text-amber-400">4. Section FAQ (Questions fréquentes)</h2>
                </div>

                {homeData.faq.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                    <input
                      type="text"
                      placeholder="Question"
                      value={item.question || ''}
                      onChange={(e) => {
                        const items = [...homeData.faq.items];
                        items[idx].question = e.target.value;
                        setHomeData({ ...homeData, faq: { ...homeData.faq, items } });
                      }}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-sm text-white font-semibold"
                    />
                    <textarea
                      placeholder="Réponse"
                      rows={2}
                      value={item.answer || ''}
                      onChange={(e) => {
                        const items = [...homeData.faq.items];
                        items[idx].answer = e.target.value;
                        setHomeData({ ...homeData, faq: { ...homeData.faq, items } });
                      }}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-sm text-white"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Bouton de sauvegarde final */}
            <div className="flex justify-end sticky bottom-6 bg-slate-950/80 p-4 backdrop-blur-md rounded-xl border border-slate-800 shadow-2xl">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition disabled:opacity-50 text-base shadow-lg"
              >
                {saving ? 'Enregistrement des modifications...' : 'Enregistrer toute la page'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
