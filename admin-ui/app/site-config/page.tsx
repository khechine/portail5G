'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth, logout } from '@/lib/api';
import Link from 'next/link';

interface SiteConfig {
  site_name: string;
  primary_color: string;
  primary_dark: string;
  em_color: string;
  heading_color: string;
  text_color: string;
  light_bg: string;
  border_color: string;
  dark_bg: string;
  body_font: string;
  heading_font: string;
  arabic_font: string;
  phone: string;
  email: string;
  address: string;
  topbar_left: string;
  cta_label: string;
  cta_url: string;
  lang_label: string;
  footer_about: string;
  copyright: string;
}

const DEFAULTS: SiteConfig = {
  site_name: '',
  primary_color: '#e2418c',
  primary_dark: '#c93578',
  em_color: '#e2418c',
  heading_color: '#251444',
  text_color: '#737177',
  light_bg: '#F7F5F1',
  border_color: '#E6E2D9',
  dark_bg: '#251444',
  body_font: 'Outfit',
  heading_font: 'Outfit',
  arabic_font: 'Cairo',
  phone: '',
  email: '',
  address: '',
  topbar_left: '',
  cta_label: '',
  cta_url: '',
  lang_label: '',
  footer_about: '',
  copyright: '',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', background: '#020617', border: '1px solid #1e293b',
  borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit',
};
const textareaStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, minHeight: 80 };
const PRESETS = ['#e2418c', '#e2418c', '#251444', '#1a73e8', '#22c55e', '#ef4444'];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 4 }}>
        {label}
      </label>
      {hint && <p style={{ fontSize: 11, color: '#475569', marginBottom: 6, marginTop: 0 }}>{hint}</p>}
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} style={inputStyle} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} />;
}

function Grid({ cols = 2, children }: { cols?: number; children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>{children}</div>;
}

function ColorField({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  const [hex, setHex] = useState(value || '#000000');
  useEffect(() => { setHex(value || '#000000'); }, [value]);

  const handleHex = (raw: string) => {
    setHex(raw);
    if (/^#[0-9A-Fa-f]{6}$/.test(raw)) onChange(raw);
  };
  const handlePicker = (raw: string) => { setHex(raw); onChange(raw); };
  const safeHex = hex.startsWith('#') && hex.length === 7 ? hex : '#000000';

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 4 }}>{label}</label>
      {hint && <p style={{ fontSize: 11, color: '#475569', marginBottom: 6, marginTop: 0 }}>{hint}</p>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', flexShrink: 0, width: 44, height: 38, borderRadius: 8, background: hex, border: '2px solid #1e293b', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          <input type="color" value={safeHex} onChange={e => handlePicker(e.target.value)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
        </div>
        <input type="text" value={hex} onChange={e => handleHex(e.target.value)} maxLength={7}
          style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '0.05em', flex: 1 }} placeholder="#000000" />
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {PRESETS.map(p => (
            <button key={p} type="button" onClick={() => { setHex(p); onChange(p); }} title={p}
              style={{ width: 22, height: 22, borderRadius: 5, background: p, border: hex === p ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', padding: 0 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: '#1e293b', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#fbbf24' }}>{title}</span>
        </div>
        <span style={{ color: '#64748b', fontSize: 18, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </div>
      {open && <div style={{ padding: 24 }}>{children}</div>}
    </div>
  );
}

function Sidebar({ active }: { active: string }) {
  const links = [
    { href: '/dashboard', icon: '🏠', label: 'Tableau de bord' },
    { href: '/home-page', icon: '📄', label: "Page d'accueil" },
    { href: '/site-config', icon: '⚙️', label: 'Config du site' },
    { href: '/leads', icon: '📬', label: 'Commandes / Leads' },
  ];
  return (
    <aside style={{ width: 240, minHeight: '100vh', background: '#0f172a', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 16px', flexShrink: 0 }}>
      <div>
        <div style={{ marginBottom: 32, paddingLeft: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b', letterSpacing: '-0.02em' }}>Box 5G</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Administration CMS</div>
        </div>
        <nav>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 4,
              background: active === l.href ? 'rgba(245,158,11,0.12)' : 'transparent',
              color: active === l.href ? '#fbbf24' : '#94a3b8',
              fontWeight: active === l.href ? 700 : 400, fontSize: 14, textDecoration: 'none', transition: 'all 0.15s'
            }}>
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <button onClick={logout} style={{ padding: '10px', background: 'rgba(239,68,68,0.08)', border: 'none', borderRadius: 10, color: '#f87171', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
        🚪 Déconnexion
      </button>
    </aside>
  );
}

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div style={{
      position: 'fixed', bottom: 100, right: 24, zIndex: 1000, padding: '14px 22px',
      background: type === 'success' ? '#065f46' : '#7f1d1d',
      border: `1px solid ${type === 'success' ? '#059669' : '#dc2626'}`,
      borderRadius: 12, color: '#fff', fontWeight: 600, fontSize: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      {type === 'success' ? '✅' : '❌'} {msg}
    </div>
  );
}

function ColorPreview({ cfg }: { cfg: SiteConfig }) {
  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 20, marginBottom: 24 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 14 }}>
        Aperçu en temps réel
      </p>
      <div style={{ background: cfg.light_bg, borderRadius: 10, padding: 20, marginBottom: 12 }}>
        <h2 style={{ fontFamily: cfg.heading_font || 'Outfit', color: cfg.heading_color, margin: 0, fontSize: 22, fontWeight: 800 }}>
          Internet ultra rapide{' '}
          <em style={{ fontStyle: 'normal', color: cfg.em_color }}>5G Box</em>
          {' '}pour votre foyer
        </h2>
        <p style={{ color: cfg.text_color, marginTop: 10, fontSize: 14 }}>Profitez d'une connexion stable et performante.</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button style={{ background: cfg.primary_color, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 13, cursor: 'default' }}>Commander</button>
          <button style={{ background: 'transparent', color: cfg.heading_color, border: `1.5px solid ${cfg.border_color}`, borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 13, cursor: 'default' }}>En savoir plus</button>
        </div>
      </div>
      <div style={{ background: cfg.dark_bg, borderRadius: 10, padding: '12px 20px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ color: cfg.primary_color, fontWeight: 800, fontSize: 16 }}>✦</span>
        <span style={{ color: '#fff', fontSize: 13, opacity: 0.85 }}>Topbar / Footer — fond sombre</span>
        <span style={{ marginLeft: 'auto', color: cfg.primary_color, fontWeight: 700, fontSize: 13 }}>Bouton principal</span>
      </div>
    </div>
  );
}

export default function SiteConfigPage() {
  const [locale, setLocale] = useState<'fr' | 'ar'>('fr');
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    setLoading(true);
    fetchWithAuth(`/site-config/?locale=${locale}`)
      .then(r => r.json())
      .then(res => {
        const d = res.data || {};
        setCfg({
          site_name: d.site_name || '',
          primary_color: d.primary_color || '#e2418c',
          primary_dark: d.primary_dark || '#c93578',
          em_color: d.em_color || d.primary_color || '#e2418c',
          heading_color: d.heading_color || '#251444',
          text_color: d.text_color || '#737177',
          light_bg: d.light_bg || '#F7F5F1',
          border_color: d.border_color || '#E6E2D9',
          dark_bg: d.dark_bg || '#251444',
          body_font: d.body_font || 'Outfit',
          heading_font: d.heading_font || 'Outfit',
          arabic_font: d.arabic_font || 'Cairo',
          phone: d.phone || '',
          email: d.email || '',
          address: d.address || '',
          topbar_left: d.topbar_left || '',
          cta_label: d.cta_label || '',
          cta_url: d.cta_url || '',
          lang_label: d.lang_label || '',
          footer_about: d.footer_about || '',
          copyright: d.copyright || '',
        });
      })
      .catch(() => showToast('Erreur de chargement de la config', 'error'))
      .finally(() => setLoading(false));
  }, [locale]);

  const set = (key: keyof SiteConfig, val: string) => setCfg(prev => ({ ...prev, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchWithAuth(`/site-config/?locale=${locale}`, {
        method: 'PUT',
        body: JSON.stringify(cfg),
      });
      if (res.ok) showToast('Configuration enregistrée avec succès !', 'success');
      else showToast('Erreur lors de la sauvegarde', 'error');
    } catch {
      showToast('Erreur réseau', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        input, textarea { font-family: inherit; }
        input:focus, textarea:focus { border-color: #f59e0b !important; box-shadow: 0 0 0 2px rgba(245,158,11,0.15) !important; outline: none !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Sidebar active="/site-config" />

      <main style={{ flex: 1, padding: '40px 48px', maxWidth: 860, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f1f5f9', margin: 0, letterSpacing: '-0.02em' }}>⚙️ Configuration du site</h1>
            <p style={{ fontSize: 13, color: '#475569', marginTop: 6 }}>Couleurs, typographie, identité, contacts et navigation</p>
          </div>
          <div style={{ display: 'flex', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 4, gap: 4 }}>
            {(['fr', 'ar'] as const).map(l => (
              <button key={l} onClick={() => setLocale(l)} style={{
                padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
                background: locale === l ? '#f59e0b' : 'transparent', color: locale === l ? '#0f172a' : '#94a3b8', transition: 'all 0.15s'
              }}>
                {l === 'fr' ? '🇫🇷 Français' : '🇹🇳 العربية'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #1e293b', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            Chargement de la configuration…
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <ColorPreview cfg={cfg} />

            {/* ── Palette ───────────────────────────────────────────────────── */}
            <Section icon="🎨" title="Palette de couleurs">
              {/* em_color — highlighted */}
              <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span>✨</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>Couleur des mots en surbrillance (&lt;em&gt;) dans les titres</span>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
                  Appliquée aux éléments en &lt;em&gt; (ex: &lt;em&gt;Profitez.&lt;/em&gt;, &lt;em&gt;sans fibre&lt;/em&gt;) :{' '}
                  <code style={{ background: '#0f172a', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', color: '#f59e0b' }}>
                    h2 em, .section__title em, .hero__title em
                  </code>
                </p>
                <ColorField label="Couleur &lt;em&gt; dans les titres" value={cfg.em_color} onChange={v => set('em_color', v)} />
              </div>

              <Grid>
                <ColorField label="Couleur principale (accents & boutons)" hint="Boutons (.btn--primary), surtitres (.tagline), bannière newsletter, badges" value={cfg.primary_color} onChange={v => set('primary_color', v)} />
                <ColorField label="Couleur principale sombre (hover)" hint="Survol des boutons principaux" value={cfg.primary_dark} onChange={v => set('primary_dark', v)} />
              </Grid>
              <Grid>
                <ColorField label="Couleur des titres" hint="h1, h2, h3, liens nav, sous-titres…" value={cfg.heading_color} onChange={v => set('heading_color', v)} />
                <ColorField label="Couleur du texte courant" hint="Paragraphes, descriptions, détails des offres" value={cfg.text_color} onChange={v => set('text_color', v)} />
              </Grid>
              <Grid>
                <ColorField label="Fond clair" hint="Sections alternées" value={cfg.light_bg} onChange={v => set('light_bg', v)} />
                <ColorField label="Fond sombre" hint="Topbar, header, footer" value={cfg.dark_bg} onChange={v => set('dark_bg', v)} />
              </Grid>
              <ColorField label="Couleur des bordures" hint="Séparateurs, bords de cartes, inputs" value={cfg.border_color} onChange={v => set('border_color', v)} />
            </Section>

            {/* ── Typographie ───────────────────────────────────────────────── */}
            <Section icon="🔤" title="Typographie">
              <Grid cols={3}>
                <Field label="Police du corps" hint="Textes, paragraphes">
                  <TextInput value={cfg.body_font} onChange={v => set('body_font', v)} placeholder="Outfit" />
                </Field>
                <Field label="Police des titres" hint="h1, h2, h3, nav">
                  <TextInput value={cfg.heading_font} onChange={v => set('heading_font', v)} placeholder="Outfit" />
                </Field>
                <Field label="Police arabe" hint="Version RTL">
                  <TextInput value={cfg.arabic_font} onChange={v => set('arabic_font', v)} placeholder="Cairo" />
                </Field>
              </Grid>
              <p style={{ fontSize: 12, color: '#475569' }}>
                💡 Utilisez des polices{' '}
                <a href="https://fonts.google.com" target="_blank" rel="noreferrer" style={{ color: '#f59e0b' }}>Google Fonts</a>
                {' '}(ex: Outfit, Cairo, Inter, Roboto…)
              </p>
            </Section>

            {/* ── Identité ──────────────────────────────────────────────────── */}
            <Section icon="🏢" title="Identité du site">
              <Field label="Nom du site">
                <TextInput value={cfg.site_name} onChange={v => set('site_name', v)} placeholder="Topnet Box 5G" />
              </Field>
            </Section>

            {/* ── Coordonnées ───────────────────────────────────────────────── */}
            <Section icon="📞" title="Coordonnées">
              <Grid>
                <Field label="Téléphone"><TextInput value={cfg.phone} onChange={v => set('phone', v)} placeholder="+216 XX XXX XXX" /></Field>
                <Field label="Email"><TextInput value={cfg.email} onChange={v => set('email', v)} type="email" placeholder="contact@topnet.tn" /></Field>
              </Grid>
              <Field label="Adresse postale">
                <TextInput value={cfg.address} onChange={v => set('address', v)} placeholder="Rue X, Tunis, Tunisie" />
              </Field>
            </Section>

            {/* ── Navigation ────────────────────────────────────────────────── */}
            <Section icon="🧭" title="Navigation & Header">
              <Field label="Texte topbar gauche" hint="Petite barre d'info en haut">
                <TextInput value={cfg.topbar_left} onChange={v => set('topbar_left', v)} placeholder="📞 Assistance 24h/24 — +216 71 000 000" />
              </Field>
              <Grid>
                <Field label="Libellé bouton CTA header">
                  <TextInput value={cfg.cta_label} onChange={v => set('cta_label', v)} placeholder="Commander maintenant" />
                </Field>
                <Field label="URL bouton CTA header">
                  <TextInput value={cfg.cta_url} onChange={v => set('cta_url', v)} placeholder="#commander" />
                </Field>
              </Grid>
              <Field label="Libellé sélecteur de langue">
                <TextInput value={cfg.lang_label} onChange={v => set('lang_label', v)} placeholder="العربية" />
              </Field>
            </Section>

            {/* ── Footer ────────────────────────────────────────────────────── */}
            <Section icon="🦶" title="Footer">
              <Field label="Texte à propos (footer)" hint="Paragraphe de présentation">
                <textarea style={textareaStyle} value={cfg.footer_about} onChange={e => set('footer_about', e.target.value)} rows={3} placeholder="Topnet Box 5G vous offre une connexion ultra-rapide…" />
              </Field>
              <Field label="Texte de copyright">
                <TextInput value={cfg.copyright} onChange={v => set('copyright', v)} placeholder="© 2026 Topnet. Tous droits réservés." />
              </Field>
            </Section>

            {/* ── Save ──────────────────────────────────────────────────────── */}
            <div style={{
              position: 'sticky', bottom: 24, zIndex: 10, display: 'flex', justifyContent: 'flex-end', padding: '16px 24px',
              background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)', borderRadius: 14, border: '1px solid #1e293b', boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}>
              <button type="submit" disabled={saving} style={{
                padding: '12px 36px', background: saving ? '#92400e' : '#f59e0b', color: '#0f172a',
                fontWeight: 800, fontSize: 15, borderRadius: 10, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
              }}>
                {saving ? '⏳ Enregistrement…' : '💾 Enregistrer la configuration'}
              </button>
            </div>
          </form>
        )}
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
