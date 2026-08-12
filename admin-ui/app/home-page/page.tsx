'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { fetchWithAuth, logout } from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────────────────
interface HeroSlide {
  id?: number;
  badge: string;
  title: string;
  title_highlight: string;
  text: string;
  image?: string | null;
  btn_primary_label: string;
  btn_primary_url: string;
  btn_secondary_label: string;
  btn_secondary_url: string;
  order: number;
}

interface TrustItem {
  id?: number;
  value: string;
  label: string;
  order: number;
}

interface ServiceItem {
  id?: number;
  icon: string;
  title: string;
  description: string;
  features: { text: string }[];
  order: number;
}

interface PlanCard {
  id?: number;
  speed: string;
  speed_unit: string;
  speed_label: string;
  title: string;
  price: string;
  currency: string;
  period: string;
  badge: string;
  recommended: boolean;
  button_label: string;
  button_url: string;
  features: { text: string; included?: boolean }[];
  order: number;
}

interface PlanGroup {
  id?: number;
  name: string;
  order: number;
  cards: PlanCard[];
}

interface SpecRow {
  id?: number;
  label: string;
  value: string;
  highlight: boolean;
  order: number;
}

interface StepItem {
  id?: number;
  title: string;
  description: string;
  order: number;
}

interface FaqItem {
  id?: number;
  question: string;
  answer: string;
  order: number;
}

interface TestimonialItem {
  id?: number;
  quote: string;
  author: string;
  role: string;
  rating: number;
  order: number;
}

interface NewsItem {
  id?: number;
  title: string;
  excerpt: string;
  date: string;
  link: string;
  order: number;
}

interface HomeData {
  // SEO
  meta_title: string;
  meta_description: string;
  // Hero
  hero_enabled: boolean;
  hero_slides: HeroSlide[];
  // Trust
  trust_enabled: boolean;
  trust_items: TrustItem[];
  // About
  about_enabled: boolean;
  about_tagline: string;
  about_title: string;
  about_title_highlight: string;
  about_text: string;
  about_button_label: string;
  about_button_url: string;
  about_features: { text: string }[];
  // Services
  services_enabled: boolean;
  services_tagline: string;
  services_title: string;
  services_title_highlight: string;
  services_subtitle: string;
  services_items: ServiceItem[];
  // Plans
  plans_enabled: boolean;
  plans_tagline: string;
  plans_title: string;
  plans_title_highlight: string;
  plans_subtitle: string;
  plans_note: string;
  plans_groups: PlanGroup[];
  // Specs
  specs_enabled: boolean;
  specs_tagline: string;
  specs_title: string;
  specs_title_highlight: string;
  specs_rows: SpecRow[];
  // Steps
  steps_enabled: boolean;
  steps_tagline: string;
  steps_title: string;
  steps_title_highlight: string;
  steps_help_title: string;
  steps_help_text: string;
  steps_items: StepItem[];
  // FAQ
  faq_enabled: boolean;
  faq_tagline: string;
  faq_title: string;
  faq_title_highlight: string;
  faq_items: FaqItem[];
  // Testimonials
  testimonials_enabled: boolean;
  testimonials_tagline: string;
  testimonials_title: string;
  testimonials_title_highlight: string;
  testimonials_items: TestimonialItem[];
  // News
  news_enabled: boolean;
  news_tagline: string;
  news_title: string;
  news_title_highlight: string;
  news_items: NewsItem[];
  // CTA
  cta_enabled: boolean;
  cta_title: string;
  cta_subtitle: string;
  cta_btn_label: string;
  cta_btn_url: string;
  cta_btn_secondary_label: string;
  cta_btn_secondary_url: string;
}

const EMPTY_HOME: HomeData = {
  meta_title: '', meta_description: '',
  hero_enabled: true, hero_slides: [],
  trust_enabled: true, trust_items: [],
  about_enabled: true, about_tagline: '', about_title: '', about_title_highlight: '', about_text: '', about_button_label: '', about_button_url: '', about_features: [],
  services_enabled: true, services_tagline: '', services_title: '', services_title_highlight: '', services_subtitle: '', services_items: [],
  plans_enabled: true, plans_tagline: '', plans_title: '', plans_title_highlight: '', plans_subtitle: '', plans_note: '', plans_groups: [],
  specs_enabled: true, specs_tagline: '', specs_title: '', specs_title_highlight: '', specs_rows: [],
  steps_enabled: true, steps_tagline: '', steps_title: '', steps_title_highlight: '', steps_help_title: '', steps_help_text: '', steps_items: [],
  faq_enabled: true, faq_tagline: '', faq_title: '', faq_title_highlight: '', faq_items: [],
  testimonials_enabled: true, testimonials_tagline: '', testimonials_title: '', testimonials_title_highlight: '', testimonials_items: [],
  news_enabled: true, news_tagline: '', news_title: '', news_title_highlight: '', news_items: [],
  cta_enabled: true, cta_title: '', cta_subtitle: '', cta_btn_label: '', cta_btn_url: '', cta_btn_secondary_label: '', cta_btn_secondary_url: '',
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionCard({ title, icon, enabled, onToggle, children }: {
  title: string; icon: string; enabled: boolean;
  onToggle: (v: boolean) => void; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: '#1e293b', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#fbbf24' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} onClick={e => e.stopPropagation()}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#94a3b8' }}>
            <div
              onClick={() => onToggle(!enabled)}
              style={{
                width: 40, height: 22, borderRadius: 11, background: enabled ? '#f59e0b' : '#334155',
                position: 'relative', transition: 'background 0.2s', cursor: 'pointer'
              }}
            >
              <div style={{
                position: 'absolute', top: 2, left: enabled ? 20 : 2,
                width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s'
              }} />
            </div>
            {enabled ? 'Active' : 'Inactif'}
          </label>
          <span style={{ color: '#64748b', fontSize: 18, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
        </div>
      </div>
      {open && <div style={{ padding: 24 }}>{children}</div>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', background: '#020617', border: '1px solid #1e293b',
  borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box',
};
const textareaStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, minHeight: 80 };

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input style={inputStyle} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} />;
}
function TextArea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea style={{ ...textareaStyle, minHeight: rows * 26 }} value={value} onChange={e => onChange(e.target.value)} />;
}

function Grid({ cols = 2, children }: { cols?: number; children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>{children}</div>;
}

function CardBlock({ title, onRemove, children }: { title: string; onRemove: () => void; children: React.ReactNode }) {
  return (
    <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>{title}</span>
        <button onClick={onRemove} style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 6, padding: '2px 10px', cursor: 'pointer', fontSize: 13 }}>✕ Supprimer</button>
      </div>
      {children}
    </div>
  );
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'block', width: '100%', padding: '10px', background: 'rgba(245,158,11,0.08)', border: '1px dashed #f59e0b',
      borderRadius: 10, color: '#f59e0b', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginTop: 8
    }}>
      + {label}
    </button>
  );
}

function SaveBar({ saving }: { saving: boolean }) {
  return (
    <div style={{
      position: 'sticky', bottom: 24, zIndex: 10, display: 'flex', justifyContent: 'flex-end', padding: '16px 24px',
      background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)', borderRadius: 14, border: '1px solid #1e293b', boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
    }}>
      <button
        type="submit" disabled={saving}
        style={{
          padding: '12px 36px', background: saving ? '#92400e' : '#f59e0b', color: '#0f172a',
          fontWeight: 800, fontSize: 15, borderRadius: 10, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s', letterSpacing: '0.02em'
        }}
      >
        {saving ? '⏳ Enregistrement…' : '💾 Enregistrer toute la page'}
      </button>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ active }: { active: string }) {
  const links = [
    { href: '/dashboard', icon: '🏠', label: 'Tableau de bord' },
    { href: '/home-page', icon: '📄', label: "Page d'accueil" },
    { href: '/site-config', icon: '⚙️', label: 'Config du site' },
    { href: '/leads', icon: '📬', label: 'Commandes / Leads' },
  ];
  return (
    <aside style={{ width: 240, minHeight: '100vh', background: '#0f172a', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 16px' }}>
      <div>
        <div style={{ marginBottom: 32, paddingLeft: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b', letterSpacing: '-0.02em' }}>Box 5G</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Administration CMS</div>
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

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div style={{
      position: 'fixed', bottom: 100, right: 24, zIndex: 1000, padding: '14px 22px',
      background: type === 'success' ? '#065f46' : '#7f1d1d', border: `1px solid ${type === 'success' ? '#059669' : '#dc2626'}`,
      borderRadius: 12, color: '#fff', fontWeight: 600, fontSize: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      animation: 'slideIn 0.3s ease'
    }}>
      {type === 'success' ? '✅' : '❌'} {msg}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function HomePageEditor() {
  const [locale, setLocale] = useState<'fr' | 'ar'>('fr');
  const [data, setData] = useState<HomeData>(EMPTY_HOME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    setLoading(true);
    fetchWithAuth(`/home-page/?locale=${locale}`)
      .then(res => res.json())
      .then(res => {
        const d = res.data || {};
        // Map the flat Django fields + related arrays
        setData({
          meta_title: d.meta_title || '',
          meta_description: d.meta_description || '',
          hero_enabled: d.hero_enabled ?? true,
          // Hero slides come from serializer under d.hero.slides OR from hero_slides field
          hero_slides: (d.hero?.slides || []).map((s: any) => ({
            badge: s.badge || '',
            title: s.title || '',
            title_highlight: s.titleHighlight || '',
            text: s.text || '',
            image: s.image?.url || '',
            btn_primary_label: s.btnPrimaryLabel || '',
            btn_primary_url: s.btnPrimaryUrl || '',
            btn_secondary_label: s.btnSecondaryLabel || '',
            btn_secondary_url: s.btnSecondaryUrl || '',
            order: s.order ?? 0,
          })),
          trust_enabled: d.trust_enabled ?? d.trust?.enabled ?? true,
          trust_items: (d.trust?.items || []).map((t: any) => ({ value: t.value || '', label: t.label || '', order: t.order ?? 0 })),
          about_enabled: d.about_enabled ?? d.about?.enabled ?? true,
          about_tagline: d.about_tagline || d.about?.tagline || '',
          about_title: d.about_title || d.about?.title || '',
          about_title_highlight: d.about_title_highlight || d.about?.titleHighlight || '',
          about_text: d.about_text || d.about?.text || '',
          about_button_label: d.about_button_label || d.about?.buttonLabel || '',
          about_button_url: d.about_button_url || d.about?.buttonUrl || '',
          about_features: d.about_features || d.about?.features || [],
          services_enabled: d.services_enabled ?? d.services?.enabled ?? true,
          services_tagline: d.services_tagline || d.services?.tagline || '',
          services_title: d.services_title || d.services?.title || '',
          services_title_highlight: d.services_title_highlight || d.services?.titleHighlight || '',
          services_subtitle: d.services_subtitle || d.services?.subtitle || '',
          services_items: (d.services?.items || []).map((s: any) => ({
            icon: s.icon || '', title: s.title || '', description: s.description || '',
            features: s.features || [], order: s.order ?? 0,
          })),
          plans_enabled: d.plans_enabled ?? d.plans?.enabled ?? true,
          plans_tagline: d.plans_tagline || d.plans?.tagline || '',
          plans_title: d.plans_title || d.plans?.title || '',
          plans_title_highlight: d.plans_title_highlight || d.plans?.titleHighlight || '',
          plans_subtitle: d.plans_subtitle || d.plans?.subtitle || '',
          plans_note: d.plans_note || d.plans?.note || '',
          plans_groups: (d.plans?.groups || []).map((g: any) => ({
            name: g.name || '', order: g.order ?? 0,
            cards: (g.cards || []).map((c: any) => ({
              speed: c.speed || '', speed_unit: c.speedUnit || 'M', speed_label: c.speedLabel || '',
              title: c.title || '', price: c.price || '', currency: c.currency || 'DT',
              period: c.period || '', badge: c.badge || '', recommended: !!c.recommended,
              button_label: c.buttonLabel || 'Commander', button_url: c.buttonUrl || '#',
              features: c.features || [], order: c.order ?? 0,
            })),
          })),
          specs_enabled: d.specs_enabled ?? d.specs?.enabled ?? true,
          specs_tagline: d.specs_tagline || d.specs?.tagline || '',
          specs_title: d.specs_title || d.specs?.title || '',
          specs_title_highlight: d.specs_title_highlight || d.specs?.titleHighlight || '',
          specs_rows: (d.specs?.rows || []).map((r: any) => ({ label: r.label || '', value: r.value || '', highlight: !!r.highlight, order: r.order ?? 0 })),
          steps_enabled: d.steps_enabled ?? d.steps?.enabled ?? true,
          steps_tagline: d.steps_tagline || d.steps?.tagline || '',
          steps_title: d.steps_title || d.steps?.title || '',
          steps_title_highlight: d.steps_title_highlight || d.steps?.titleHighlight || '',
          steps_help_title: d.steps_help_title || d.steps?.helpTitle || '',
          steps_help_text: d.steps_help_text || d.steps?.helpText || '',
          steps_items: (d.steps?.steps || []).map((s: any) => ({ title: s.title || '', description: s.description || '', order: s.order ?? 0 })),
          faq_enabled: d.faq_enabled ?? d.faq?.enabled ?? true,
          faq_tagline: d.faq_tagline || d.faq?.tagline || '',
          faq_title: d.faq_title || d.faq?.title || '',
          faq_title_highlight: d.faq_title_highlight || d.faq?.titleHighlight || '',
          faq_items: (d.faq?.items || []).map((f: any) => ({ question: f.question || '', answer: f.answer || '', order: f.order ?? 0 })),
          testimonials_enabled: d.testimonials_enabled ?? d.testimonials?.enabled ?? true,
          testimonials_tagline: d.testimonials_tagline || d.testimonials?.tagline || '',
          testimonials_title: d.testimonials_title || d.testimonials?.title || '',
          testimonials_title_highlight: d.testimonials_title_highlight || d.testimonials?.titleHighlight || '',
          testimonials_items: (d.testimonials?.items || []).map((t: any) => ({ author: t.author || '', role: t.role || '', quote: t.quote || '', rating: t.rating ?? 5, order: t.order ?? 0 })),
          news_enabled: d.news_enabled ?? d.news?.enabled ?? true,
          news_tagline: d.news_tagline || d.news?.tagline || '',
          news_title: d.news_title || d.news?.title || '',
          news_title_highlight: d.news_title_highlight || d.news?.titleHighlight || '',
          news_items: (d.news?.items || []).map((n: any) => ({ title: n.title || '', excerpt: n.excerpt || '', date: n.date || '', link: n.link || '#', order: n.order ?? 0 })),
          cta_enabled: d.cta_enabled ?? d.cta?.enabled ?? true,
          cta_title: d.cta_title || d.cta?.title || '',
          cta_subtitle: d.cta_subtitle || d.cta?.subtitle || '',
          cta_btn_label: d.cta_btn_label || d.cta?.btnLabel || '',
          cta_btn_url: d.cta_btn_url || d.cta?.btnUrl || '',
          cta_btn_secondary_label: d.cta_btn_secondary_label || d.cta?.btnSecondaryLabel || '',
          cta_btn_secondary_url: d.cta_btn_secondary_url || d.cta?.btnSecondaryUrl || '',
        });
      })
      .catch(() => showToast("Erreur lors du chargement des données", 'error'))
      .finally(() => setLoading(false));
  }, [locale]);

  // Updaters helpers
  const set = (key: keyof HomeData, val: any) => setData(prev => ({ ...prev, [key]: val }));
  const setSlide = (idx: number, key: keyof HeroSlide, val: any) => {
    const slides = [...data.hero_slides];
    (slides[idx] as any)[key] = val;
    set('hero_slides', slides);
  };
  const setTrust = (idx: number, key: keyof TrustItem, val: any) => {
    const items = [...data.trust_items];
    (items[idx] as any)[key] = val;
    set('trust_items', items);
  };
  const setService = (idx: number, key: keyof ServiceItem, val: any) => {
    const items = [...data.services_items];
    (items[idx] as any)[key] = val;
    set('services_items', items);
  };
  const setGroup = (gi: number, key: keyof PlanGroup, val: any) => {
    const groups = [...data.plans_groups];
    (groups[gi] as any)[key] = val;
    set('plans_groups', groups);
  };
  const setCard = (gi: number, ci: number, key: keyof PlanCard, val: any) => {
    const groups = [...data.plans_groups];
    (groups[gi].cards[ci] as any)[key] = val;
    set('plans_groups', groups);
  };
  const setSpec = (idx: number, key: keyof SpecRow, val: any) => {
    const rows = [...data.specs_rows];
    (rows[idx] as any)[key] = val;
    set('specs_rows', rows);
  };
  const setStep = (idx: number, key: keyof StepItem, val: any) => {
    const items = [...data.steps_items];
    (items[idx] as any)[key] = val;
    set('steps_items', items);
  };
  const setFaq = (idx: number, key: keyof FaqItem, val: any) => {
    const items = [...data.faq_items];
    (items[idx] as any)[key] = val;
    set('faq_items', items);
  };
  const setTestimonial = (idx: number, key: keyof TestimonialItem, val: any) => {
    const items = [...data.testimonials_items];
    (items[idx] as any)[key] = val;
    set('testimonials_items', items);
  };
  const setNews = (idx: number, key: keyof NewsItem, val: any) => {
    const items = [...data.news_items];
    (items[idx] as any)[key] = val;
    set('news_items', items);
  };

  // Build payload matching Django flat model fields + JSON fallback fields
  const buildPayload = () => {
    const slides_json = data.hero_slides.map(s => ({
      badge: s.badge, title: s.title, titleHighlight: s.title_highlight, text: s.text,
      image: s.image ? { url: s.image } : null,
      btnPrimaryLabel: s.btn_primary_label, btnPrimaryUrl: s.btn_primary_url,
      btnSecondaryLabel: s.btn_secondary_label, btnSecondaryUrl: s.btn_secondary_url,
    }));
    return {
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      hero_enabled: data.hero_enabled,
      hero: { enabled: data.hero_enabled, slides: slides_json },
      trust_enabled: data.trust_enabled,
      trust: { enabled: data.trust_enabled, items: data.trust_items.map(t => ({ value: t.value, label: t.label })) },
      about_enabled: data.about_enabled,
      about_tagline: data.about_tagline, about_title: data.about_title,
      about_title_highlight: data.about_title_highlight, about_text: data.about_text,
      about_button_label: data.about_button_label, about_button_url: data.about_button_url,
      about_features: data.about_features,
      about: { enabled: data.about_enabled, tagline: data.about_tagline, title: data.about_title, titleHighlight: data.about_title_highlight, text: data.about_text, buttonLabel: data.about_button_label, buttonUrl: data.about_button_url, features: data.about_features },
      services_enabled: data.services_enabled,
      services_tagline: data.services_tagline, services_title: data.services_title,
      services_title_highlight: data.services_title_highlight, services_subtitle: data.services_subtitle,
      services: { enabled: data.services_enabled, tagline: data.services_tagline, title: data.services_title, titleHighlight: data.services_title_highlight, subtitle: data.services_subtitle, items: data.services_items.map(s => ({ icon: s.icon, title: s.title, description: s.description, features: s.features })) },
      plans_enabled: data.plans_enabled,
      plans_tagline: data.plans_tagline, plans_title: data.plans_title,
      plans_title_highlight: data.plans_title_highlight, plans_subtitle: data.plans_subtitle, plans_note: data.plans_note,
      plans: { enabled: data.plans_enabled, tagline: data.plans_tagline, title: data.plans_title, titleHighlight: data.plans_title_highlight, subtitle: data.plans_subtitle, note: data.plans_note, groups: data.plans_groups.map(g => ({ name: g.name, cards: g.cards.map(c => ({ speed: c.speed, speedUnit: c.speed_unit, speedLabel: c.speed_label, title: c.title, price: c.price, currency: c.currency, period: c.period, badge: c.badge, recommended: c.recommended, buttonLabel: c.button_label, buttonUrl: c.button_url, features: c.features })) })) },
      specs_enabled: data.specs_enabled,
      specs_tagline: data.specs_tagline, specs_title: data.specs_title, specs_title_highlight: data.specs_title_highlight,
      specs: { enabled: data.specs_enabled, tagline: data.specs_tagline, title: data.specs_title, titleHighlight: data.specs_title_highlight, rows: data.specs_rows.map(r => ({ label: r.label, value: r.value, highlight: r.highlight })) },
      steps_enabled: data.steps_enabled,
      steps_tagline: data.steps_tagline, steps_title: data.steps_title, steps_title_highlight: data.steps_title_highlight,
      steps_help_title: data.steps_help_title, steps_help_text: data.steps_help_text,
      steps: { enabled: data.steps_enabled, tagline: data.steps_tagline, title: data.steps_title, titleHighlight: data.steps_title_highlight, helpTitle: data.steps_help_title, helpText: data.steps_help_text, steps: data.steps_items.map(s => ({ title: s.title, description: s.description })) },
      faq_enabled: data.faq_enabled,
      faq_tagline: data.faq_tagline, faq_title: data.faq_title, faq_title_highlight: data.faq_title_highlight,
      faq: { enabled: data.faq_enabled, tagline: data.faq_tagline, title: data.faq_title, titleHighlight: data.faq_title_highlight, items: data.faq_items.map(f => ({ question: f.question, answer: f.answer })) },
      testimonials_enabled: data.testimonials_enabled,
      testimonials_tagline: data.testimonials_tagline, testimonials_title: data.testimonials_title, testimonials_title_highlight: data.testimonials_title_highlight,
      testimonials: { enabled: data.testimonials_enabled, tagline: data.testimonials_tagline, title: data.testimonials_title, titleHighlight: data.testimonials_title_highlight, items: data.testimonials_items.map(t => ({ author: t.author, role: t.role, quote: t.quote, rating: t.rating })) },
      news_enabled: data.news_enabled,
      news_tagline: data.news_tagline, news_title: data.news_title, news_title_highlight: data.news_title_highlight,
      news: { enabled: data.news_enabled, tagline: data.news_tagline, title: data.news_title, titleHighlight: data.news_title_highlight, items: data.news_items.map(n => ({ title: n.title, excerpt: n.excerpt, date: n.date, link: n.link })) },
      cta_enabled: data.cta_enabled,
      cta_title: data.cta_title, cta_subtitle: data.cta_subtitle,
      cta_btn_label: data.cta_btn_label, cta_btn_url: data.cta_btn_url,
      cta_btn_secondary_label: data.cta_btn_secondary_label, cta_btn_secondary_url: data.cta_btn_secondary_url,
      cta: { enabled: data.cta_enabled, title: data.cta_title, subtitle: data.cta_subtitle, btnLabel: data.cta_btn_label, btnUrl: data.cta_btn_url, btnSecondaryLabel: data.cta_btn_secondary_label, btnSecondaryUrl: data.cta_btn_secondary_url },
    };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchWithAuth(`/home-page/?locale=${locale}`, {
        method: 'PUT',
        body: JSON.stringify(buildPayload()),
      });
      if (res.ok) showToast("Page d'accueil mise à jour avec succès !", 'success');
      else showToast('Erreur de sauvegarde — vérifiez la console', 'error');
    } catch {
      showToast('Erreur réseau', 'error');
    } finally {
      setSaving(false);
    }
  };

  const newSlide = (): HeroSlide => ({ badge: '', title: '', title_highlight: '', text: '', image: '', btn_primary_label: '', btn_primary_url: '', btn_secondary_label: '', btn_secondary_url: '', order: data.hero_slides.length });
  const newTrust = (): TrustItem => ({ value: '', label: '', order: data.trust_items.length });
  const newService = (): ServiceItem => ({ icon: '⚡', title: '', description: '', features: [], order: data.services_items.length });
  const newGroup = (): PlanGroup => ({ name: 'Nouvelle offre', order: data.plans_groups.length, cards: [] });
  const newCard = (gi: number): PlanCard => ({ speed: '', speed_unit: 'M', speed_label: 'Débit descendant', title: '', price: '', currency: 'DT', period: '/ mois · 24 mois', badge: '', recommended: false, button_label: 'Commander', button_url: '#', features: [], order: data.plans_groups[gi]?.cards?.length ?? 0 });
  const newSpec = (): SpecRow => ({ label: '', value: '', highlight: false, order: data.specs_rows.length });
  const newStep = (): StepItem => ({ title: '', description: '', order: data.steps_items.length });
  const newFaq = (): FaqItem => ({ question: '', answer: '', order: data.faq_items.length });
  const newTestimonial = (): TestimonialItem => ({ author: '', role: '', quote: '', rating: 5, order: data.testimonials_items.length });
  const newNewsItem = (): NewsItem => ({ title: '', excerpt: '', date: '', link: '#', order: data.news_items.length });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        input, textarea, select { font-family: inherit; }
        input:focus, textarea:focus { border-color: #f59e0b !important; box-shadow: 0 0 0 2px rgba(245,158,11,0.15) !important; outline: none !important; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Sidebar active="/home-page" />

      <main style={{ flex: 1, padding: '40px 48px', maxWidth: 900, overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f1f5f9', margin: 0, letterSpacing: '-0.02em' }}>
              📄 Éditeur de la Page d'accueil
            </h1>
            <p style={{ fontSize: 13, color: '#475569', marginTop: 6 }}>
              Gérez toutes les sections, textes, liens et éléments de la page d'accueil
            </p>
          </div>
          {/* Locale switcher */}
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
            Chargement des données…
          </div>
        ) : (
          <form onSubmit={handleSave}>

            {/* ── 0. SEO ──────────────────────────────────────────────────────── */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                🔍 Référencement & Méta SEO
              </h2>
              <Grid>
                <Field label="Méta Titre (meta_title)">
                  <TextInput value={data.meta_title} onChange={v => set('meta_title', v)} placeholder="Ex: Topnet Box 5G - Internet ultra rapide" />
                </Field>
                <Field label="Méta Description">
                  <TextArea value={data.meta_description} onChange={v => set('meta_description', v)} rows={2} />
                </Field>
              </Grid>
            </div>

            {/* ── 1. Hero Slider ──────────────────────────────────────────────── */}
            <SectionCard title="Hero Slider — Bannières principales" icon="🎯" enabled={data.hero_enabled} onToggle={v => set('hero_enabled', v)}>
              {data.hero_slides.map((slide, idx) => (
                <CardBlock key={idx} title={`Slide ${idx + 1}${slide.badge ? ` — ${slide.badge}` : ''}`} onRemove={() => set('hero_slides', data.hero_slides.filter((_, i) => i !== idx))}>
                  <Grid>
                    <Field label="Badge (ex: ✨ Nouveau)">
                      <TextInput value={slide.badge} onChange={v => setSlide(idx, 'badge', v)} />
                    </Field>
                    <Field label="Titre surbrillance (highlight)">
                      <TextInput value={slide.title_highlight} onChange={v => setSlide(idx, 'title_highlight', v)} />
                    </Field>
                  </Grid>
                  <Field label="Titre principal">
                    <TextArea value={slide.title} onChange={v => setSlide(idx, 'title', v)} rows={2} />
                  </Field>
                  <Field label="Texte descriptif">
                    <TextArea value={slide.text} onChange={v => setSlide(idx, 'text', v)} rows={2} />
                  </Field>
                  <Field label="URL de l'image">
                    <TextInput value={slide.image || ''} onChange={v => setSlide(idx, 'image', v)} placeholder="/media/hero/image.jpg" />
                  </Field>
                  <Grid cols={2}>
                    <Field label="Libellé Bouton 1"><TextInput value={slide.btn_primary_label} onChange={v => setSlide(idx, 'btn_primary_label', v)} /></Field>
                    <Field label="URL Bouton 1"><TextInput value={slide.btn_primary_url} onChange={v => setSlide(idx, 'btn_primary_url', v)} /></Field>
                    <Field label="Libellé Bouton 2"><TextInput value={slide.btn_secondary_label} onChange={v => setSlide(idx, 'btn_secondary_label', v)} /></Field>
                    <Field label="URL Bouton 2"><TextInput value={slide.btn_secondary_url} onChange={v => setSlide(idx, 'btn_secondary_url', v)} /></Field>
                  </Grid>
                </CardBlock>
              ))}
              <AddBtn label="Ajouter un slide" onClick={() => set('hero_slides', [...data.hero_slides, newSlide()])} />
            </SectionCard>

            {/* ── 2. Bandeau Confiance ────────────────────────────────────────── */}
            <SectionCard title="Bandeau de Confiance — Stats" icon="📊" enabled={data.trust_enabled} onToggle={v => set('trust_enabled', v)}>
              {data.trust_items.map((item, idx) => (
                <CardBlock key={idx} title={`Stat ${idx + 1}`} onRemove={() => set('trust_items', data.trust_items.filter((_, i) => i !== idx))}>
                  <Grid>
                    <Field label="Valeur (ex: 5G + 4G)"><TextInput value={item.value} onChange={v => setTrust(idx, 'value', v)} /></Field>
                    <Field label="Libellé (ex: Réseau hybride)"><TextInput value={item.label} onChange={v => setTrust(idx, 'label', v)} /></Field>
                  </Grid>
                </CardBlock>
              ))}
              <AddBtn label="Ajouter une stat" onClick={() => set('trust_items', [...data.trust_items, newTrust()])} />
            </SectionCard>

            {/* ── 3. À Propos ──────────────────────────────────────────────────── */}
            <SectionCard title="Section À Propos" icon="ℹ️" enabled={data.about_enabled} onToggle={v => set('about_enabled', v)}>
              <Grid cols={3}>
                <Field label="Tagline / Surtitre"><TextInput value={data.about_tagline} onChange={v => set('about_tagline', v)} /></Field>
                <Field label="Titre principal"><TextInput value={data.about_title} onChange={v => set('about_title', v)} /></Field>
                <Field label="Titre surbrillance"><TextInput value={data.about_title_highlight} onChange={v => set('about_title_highlight', v)} /></Field>
              </Grid>
              <Field label="Texte de présentation"><TextArea value={data.about_text} onChange={v => set('about_text', v)} rows={4} /></Field>
              <Grid>
                <Field label="Libellé Bouton"><TextInput value={data.about_button_label} onChange={v => set('about_button_label', v)} /></Field>
                <Field label="URL Bouton"><TextInput value={data.about_button_url} onChange={v => set('about_button_url', v)} /></Field>
              </Grid>
            </SectionCard>

            {/* ── 4. Services ──────────────────────────────────────────────────── */}
            <SectionCard title="Section Services / Usages" icon="⚡" enabled={data.services_enabled} onToggle={v => set('services_enabled', v)}>
              <Grid cols={3}>
                <Field label="Tagline"><TextInput value={data.services_tagline} onChange={v => set('services_tagline', v)} /></Field>
                <Field label="Titre principal"><TextInput value={data.services_title} onChange={v => set('services_title', v)} /></Field>
                <Field label="Titre surbrillance"><TextInput value={data.services_title_highlight} onChange={v => set('services_title_highlight', v)} /></Field>
              </Grid>
              <Field label="Sous-titre"><TextArea value={data.services_subtitle} onChange={v => set('services_subtitle', v)} rows={2} /></Field>
              {data.services_items.map((item, idx) => (
                <CardBlock key={idx} title={`Service ${idx + 1}${item.title ? ` — ${item.title}` : ''}`} onRemove={() => set('services_items', data.services_items.filter((_, i) => i !== idx))}>
                  <Grid cols={3}>
                    <Field label="Icône / Emoji"><TextInput value={item.icon} onChange={v => setService(idx, 'icon', v)} placeholder="⚡" /></Field>
                    <Field label="Titre du service"><TextInput value={item.title} onChange={v => setService(idx, 'title', v)} /></Field>
                    <Field label="Description"><TextInput value={item.description} onChange={v => setService(idx, 'description', v)} /></Field>
                  </Grid>
                </CardBlock>
              ))}
              <AddBtn label="Ajouter un service" onClick={() => set('services_items', [...data.services_items, newService()])} />
            </SectionCard>

            {/* ── 5. Offres & Tarifs ───────────────────────────────────────────── */}
            <SectionCard title="Offres & Tarifs" icon="💰" enabled={data.plans_enabled} onToggle={v => set('plans_enabled', v)}>
              <Grid cols={3}>
                <Field label="Tagline"><TextInput value={data.plans_tagline} onChange={v => set('plans_tagline', v)} /></Field>
                <Field label="Titre principal"><TextInput value={data.plans_title} onChange={v => set('plans_title', v)} /></Field>
                <Field label="Titre surbrillance"><TextInput value={data.plans_title_highlight} onChange={v => set('plans_title_highlight', v)} /></Field>
              </Grid>
              <Grid>
                <Field label="Sous-titre"><TextArea value={data.plans_subtitle} onChange={v => set('plans_subtitle', v)} rows={2} /></Field>
                <Field label="Note de bas de page"><TextArea value={data.plans_note} onChange={v => set('plans_note', v)} rows={2} /></Field>
              </Grid>
              {data.plans_groups.map((group, gi) => (
                <CardBlock key={gi} title={`Onglet : ${group.name}`} onRemove={() => set('plans_groups', data.plans_groups.filter((_, i) => i !== gi))}>
                  <Field label="Nom de l'onglet (ex: 30M, 50M, 100M)">
                    <TextInput value={group.name} onChange={v => setGroup(gi, 'name', v)} />
                  </Field>
                  {group.cards.map((card, ci) => (
                    <div key={ci} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: 14, marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>Carte {ci + 1} — {card.title || 'Sans titre'}</span>
                        <button onClick={() => { const g = [...data.plans_groups]; g[gi].cards = g[gi].cards.filter((_, i) => i !== ci); set('plans_groups', g); }} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>✕ Supprimer</button>
                      </div>
                      <Grid cols={3}>
                        <Field label="Débit (ex: 50)"><TextInput value={card.speed} onChange={v => setCard(gi, ci, 'speed', v)} /></Field>
                        <Field label="Unité (ex: M)"><TextInput value={card.speed_unit} onChange={v => setCard(gi, ci, 'speed_unit', v)} /></Field>
                        <Field label="Libellé débit"><TextInput value={card.speed_label} onChange={v => setCard(gi, ci, 'speed_label', v)} /></Field>
                      </Grid>
                      <Grid>
                        <Field label="Nom du forfait"><TextInput value={card.title} onChange={v => setCard(gi, ci, 'title', v)} /></Field>
                        <Field label="Badge (ex: ⭐ Recommandé)"><TextInput value={card.badge} onChange={v => setCard(gi, ci, 'badge', v)} /></Field>
                      </Grid>
                      <Grid cols={3}>
                        <Field label="Prix (ex: 69.9)"><TextInput value={card.price} onChange={v => setCard(gi, ci, 'price', v)} /></Field>
                        <Field label="Devise (ex: DT)"><TextInput value={card.currency} onChange={v => setCard(gi, ci, 'currency', v)} /></Field>
                        <Field label="Période (ex: / mois · 24 mois)"><TextInput value={card.period} onChange={v => setCard(gi, ci, 'period', v)} /></Field>
                      </Grid>
                      <Grid>
                        <Field label="Libellé Bouton"><TextInput value={card.button_label} onChange={v => setCard(gi, ci, 'button_label', v)} /></Field>
                        <Field label="URL Bouton"><TextInput value={card.button_url} onChange={v => setCard(gi, ci, 'button_url', v)} /></Field>
                      </Grid>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8', cursor: 'pointer', marginTop: 4 }}>
                        <input type="checkbox" checked={card.recommended} onChange={e => setCard(gi, ci, 'recommended', e.target.checked)} style={{ accentColor: '#f59e0b' }} />
                        Marquer comme recommandé
                      </label>
                    </div>
                  ))}
                  <AddBtn label="Ajouter une carte" onClick={() => { const g = [...data.plans_groups]; g[gi].cards = [...g[gi].cards, newCard(gi)]; set('plans_groups', g); }} />
                </CardBlock>
              ))}
              <AddBtn label="Ajouter un groupe / onglet" onClick={() => set('plans_groups', [...data.plans_groups, newGroup()])} />
            </SectionCard>

            {/* ── 6. Fiche Technique ───────────────────────────────────────────── */}
            <SectionCard title="Fiche Technique — Spécifications" icon="📋" enabled={data.specs_enabled} onToggle={v => set('specs_enabled', v)}>
              <Grid cols={3}>
                <Field label="Tagline"><TextInput value={data.specs_tagline} onChange={v => set('specs_tagline', v)} /></Field>
                <Field label="Titre principal"><TextInput value={data.specs_title} onChange={v => set('specs_title', v)} /></Field>
                <Field label="Titre surbrillance"><TextInput value={data.specs_title_highlight} onChange={v => set('specs_title_highlight', v)} /></Field>
              </Grid>
              {data.specs_rows.map((row, idx) => (
                <CardBlock key={idx} title={`Ligne ${idx + 1}`} onRemove={() => set('specs_rows', data.specs_rows.filter((_, i) => i !== idx))}>
                  <Grid>
                    <Field label="Libellé"><TextInput value={row.label} onChange={v => setSpec(idx, 'label', v)} /></Field>
                    <Field label="Valeur"><TextInput value={row.value} onChange={v => setSpec(idx, 'value', v)} /></Field>
                  </Grid>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8', cursor: 'pointer' }}>
                    <input type="checkbox" checked={row.highlight} onChange={e => setSpec(idx, 'highlight', e.target.checked)} style={{ accentColor: '#f59e0b' }} />
                    Mettre en valeur (highlight)
                  </label>
                </CardBlock>
              ))}
              <AddBtn label="Ajouter une ligne" onClick={() => set('specs_rows', [...data.specs_rows, newSpec()])} />
            </SectionCard>

            {/* ── 7. Étapes ────────────────────────────────────────────────────── */}
            <SectionCard title="Étapes de mise en marche" icon="🚀" enabled={data.steps_enabled} onToggle={v => set('steps_enabled', v)}>
              <Grid cols={3}>
                <Field label="Tagline"><TextInput value={data.steps_tagline} onChange={v => set('steps_tagline', v)} /></Field>
                <Field label="Titre principal"><TextInput value={data.steps_title} onChange={v => set('steps_title', v)} /></Field>
                <Field label="Titre surbrillance"><TextInput value={data.steps_title_highlight} onChange={v => set('steps_title_highlight', v)} /></Field>
              </Grid>
              <Grid>
                <Field label="Titre encadré aide"><TextInput value={data.steps_help_title} onChange={v => set('steps_help_title', v)} /></Field>
                <Field label="Texte encadré aide"><TextArea value={data.steps_help_text} onChange={v => set('steps_help_text', v)} rows={2} /></Field>
              </Grid>
              {data.steps_items.map((step, idx) => (
                <CardBlock key={idx} title={`Étape ${idx + 1}${step.title ? ` — ${step.title}` : ''}`} onRemove={() => set('steps_items', data.steps_items.filter((_, i) => i !== idx))}>
                  <Field label="Titre de l'étape"><TextInput value={step.title} onChange={v => setStep(idx, 'title', v)} /></Field>
                  <Field label="Description"><TextArea value={step.description} onChange={v => setStep(idx, 'description', v)} rows={2} /></Field>
                </CardBlock>
              ))}
              <AddBtn label="Ajouter une étape" onClick={() => set('steps_items', [...data.steps_items, newStep()])} />
            </SectionCard>

            {/* ── 8. FAQ ───────────────────────────────────────────────────────── */}
            <SectionCard title="FAQ — Questions / Réponses" icon="❓" enabled={data.faq_enabled} onToggle={v => set('faq_enabled', v)}>
              <Grid cols={3}>
                <Field label="Tagline"><TextInput value={data.faq_tagline} onChange={v => set('faq_tagline', v)} /></Field>
                <Field label="Titre principal"><TextInput value={data.faq_title} onChange={v => set('faq_title', v)} /></Field>
                <Field label="Titre surbrillance"><TextInput value={data.faq_title_highlight} onChange={v => set('faq_title_highlight', v)} /></Field>
              </Grid>
              {data.faq_items.map((item, idx) => (
                <CardBlock key={idx} title={`Q${idx + 1}${item.question ? ` — ${item.question.slice(0, 40)}…` : ''}`} onRemove={() => set('faq_items', data.faq_items.filter((_, i) => i !== idx))}>
                  <Field label="Question"><TextInput value={item.question} onChange={v => setFaq(idx, 'question', v)} /></Field>
                  <Field label="Réponse"><TextArea value={item.answer} onChange={v => setFaq(idx, 'answer', v)} rows={3} /></Field>
                </CardBlock>
              ))}
              <AddBtn label="Ajouter une question" onClick={() => set('faq_items', [...data.faq_items, newFaq()])} />
            </SectionCard>

            {/* ── 9. Témoignages ───────────────────────────────────────────────── */}
            <SectionCard title="Témoignages / Avis clients" icon="💬" enabled={data.testimonials_enabled} onToggle={v => set('testimonials_enabled', v)}>
              <Grid cols={3}>
                <Field label="Tagline"><TextInput value={data.testimonials_tagline} onChange={v => set('testimonials_tagline', v)} /></Field>
                <Field label="Titre principal"><TextInput value={data.testimonials_title} onChange={v => set('testimonials_title', v)} /></Field>
                <Field label="Titre surbrillance"><TextInput value={data.testimonials_title_highlight} onChange={v => set('testimonials_title_highlight', v)} /></Field>
              </Grid>
              {data.testimonials_items.map((item, idx) => (
                <CardBlock key={idx} title={`Avis ${idx + 1}${item.author ? ` — ${item.author}` : ''}`} onRemove={() => set('testimonials_items', data.testimonials_items.filter((_, i) => i !== idx))}>
                  <Grid>
                    <Field label="Nom du client"><TextInput value={item.author} onChange={v => setTestimonial(idx, 'author', v)} /></Field>
                    <Field label="Statut / Offre souscrite"><TextInput value={item.role} onChange={v => setTestimonial(idx, 'role', v)} /></Field>
                  </Grid>
                  <Field label="Citation / Avis"><TextArea value={item.quote} onChange={v => setTestimonial(idx, 'quote', v)} rows={2} /></Field>
                  <Field label="Note (1 à 5)">
                    <input type="number" min={1} max={5} value={item.rating} onChange={e => setTestimonial(idx, 'rating', parseInt(e.target.value))}
                      style={{ ...inputStyle, width: 80 }} />
                  </Field>
                </CardBlock>
              ))}
              <AddBtn label="Ajouter un avis" onClick={() => set('testimonials_items', [...data.testimonials_items, newTestimonial()])} />
            </SectionCard>

            {/* ── 10. Actualités ───────────────────────────────────────────────── */}
            <SectionCard title="Actualités / Nouveautés" icon="📰" enabled={data.news_enabled} onToggle={v => set('news_enabled', v)}>
              <Grid cols={3}>
                <Field label="Tagline"><TextInput value={data.news_tagline} onChange={v => set('news_tagline', v)} /></Field>
                <Field label="Titre principal"><TextInput value={data.news_title} onChange={v => set('news_title', v)} /></Field>
                <Field label="Titre surbrillance"><TextInput value={data.news_title_highlight} onChange={v => set('news_title_highlight', v)} /></Field>
              </Grid>
              {data.news_items.map((item, idx) => (
                <CardBlock key={idx} title={`Article ${idx + 1}${item.title ? ` — ${item.title.slice(0, 35)}` : ''}`} onRemove={() => set('news_items', data.news_items.filter((_, i) => i !== idx))}>
                  <Grid>
                    <Field label="Titre de l'article"><TextInput value={item.title} onChange={v => setNews(idx, 'title', v)} /></Field>
                    <Field label="Date d'affichage (ex: 12 Aug 2026)"><TextInput value={item.date} onChange={v => setNews(idx, 'date', v)} /></Field>
                  </Grid>
                  <Field label="Extrait / Résumé"><TextArea value={item.excerpt} onChange={v => setNews(idx, 'excerpt', v)} rows={2} /></Field>
                  <Field label="Lien vers l'article"><TextInput value={item.link} onChange={v => setNews(idx, 'link', v)} placeholder="https://..." /></Field>
                </CardBlock>
              ))}
              <AddBtn label="Ajouter un article" onClick={() => set('news_items', [...data.news_items, newNewsItem()])} />
            </SectionCard>

            {/* ── 11. CTA Final ───────────────────────────────────────────────── */}
            <SectionCard title="Call To Action — Bandeau final" icon="🎯" enabled={data.cta_enabled} onToggle={v => set('cta_enabled', v)}>
              <Grid>
                <Field label="Titre principal"><TextInput value={data.cta_title} onChange={v => set('cta_title', v)} /></Field>
                <Field label="Sous-titre"><TextInput value={data.cta_subtitle} onChange={v => set('cta_subtitle', v)} /></Field>
              </Grid>
              <Grid cols={2}>
                <Field label="Libellé Bouton 1"><TextInput value={data.cta_btn_label} onChange={v => set('cta_btn_label', v)} /></Field>
                <Field label="URL Bouton 1"><TextInput value={data.cta_btn_url} onChange={v => set('cta_btn_url', v)} /></Field>
                <Field label="Libellé Bouton 2"><TextInput value={data.cta_btn_secondary_label} onChange={v => set('cta_btn_secondary_label', v)} /></Field>
                <Field label="URL Bouton 2"><TextInput value={data.cta_btn_secondary_url} onChange={v => set('cta_btn_secondary_url', v)} /></Field>
              </Grid>
            </SectionCard>

            <SaveBar saving={saving} />
          </form>
        )}
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
