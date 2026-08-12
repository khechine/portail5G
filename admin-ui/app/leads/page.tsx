'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';

interface Lead {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  governorate: string;
  plan: string;
  locale: string;
  created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadLeads = () => {
    setLoading(true);
    let url = `/leads/list/?search=${encodeURIComponent(search)}`;
    fetchWithAuth(url)
      .then((res) => res.json())
      .then((data) => {
        setLeads(data.results || []);
        setTotal(data.count || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLeads();
  }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cette demande ?')) return;
    try {
      await fetchWithAuth(`/leads/${id}/`, { method: 'DELETE' });
      loadLeads();
    } catch (err) {
      alert('Erreur lors de la suppression');
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
            <Link href="/site-config" className="block px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-lg transition">
              Config du site
            </Link>
            <Link href="/leads" className="block px-4 py-2 bg-slate-800 text-amber-400 font-semibold rounded-lg">
              Commandes / Leads
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Demandes de commande ({total})</h1>
            <p className="text-slate-400 text-sm mt-1">Gérez les prospects envoyés depuis le portail</p>
          </div>

          <a
            href="/api/leads/list/?export=csv"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition"
          >
            Exporter en CSV
          </a>
        </div>

        {/* Filter / Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-slate-200"
          />
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 uppercase text-xs text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Nom / Prénom</th>
                <th className="px-6 py-4">Téléphone</th>
                <th className="px-6 py-4">Gouvernorat</th>
                <th className="px-6 py-4">Offre</th>
                <th className="px-6 py-4">Langue</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Chargement...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Aucune demande trouvée</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 font-semibold text-white">
                      {lead.firstname} {lead.lastname}
                    </td>
                    <td className="px-6 py-4 font-mono">{lead.phone}</td>
                    <td className="px-6 py-4">{lead.governorate}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-md font-bold text-xs">
                        {lead.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 uppercase text-xs font-bold text-slate-400">{lead.locale}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(lead.created_at).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-400 hover:text-red-300 font-semibold text-xs transition"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
