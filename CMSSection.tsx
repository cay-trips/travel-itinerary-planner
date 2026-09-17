import React, { useState } from 'react';

interface CMSSectionProps {
  content: Record<string, string>;
  onSaveContent: (entries: { key: string; value: string }[]) => Promise<void>;
  onUploadAsset: (file: File, key: string) => Promise<void>;
  onBack: () => void;
  formError?: string | null;
}

export const CMSSection: React.FC<CMSSectionProps> = ({
  content,
  onSaveContent,
  onUploadAsset,
  onBack,
  formError,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({ ...content });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fields = [
    { key: 'brand.name', label: 'Brand Name', defaultVal: 'CAY Trips' },
    { key: 'login.headline', label: 'Login Headline', defaultVal: 'Autonomous Expeditions. Zero Friction.' },
    { key: 'login.subtext', label: 'Login Subtext', defaultVal: 'Powered by Supabase real-time infrastructure.' },
    { key: 'menu.headline', label: 'Main Menu Header', defaultVal: 'Where to next, explorer?' },
    { key: 'menu.subtext', label: 'Main Menu Subtext', defaultVal: 'Execute expedition budgets, split group debts, and review live meteorology.' },
    { key: 'about.body', label: 'About Us Body Copy', defaultVal: 'CAY Trips solves real group travel friction.' },
  ];

  const handleChange = (key: string, val: string) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const entries = Object.keys(formData).map((k) => ({ key: k, value: formData[k] }));
      await onSaveContent(entries);
    } finally {
      setSaving(false);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUploadAsset(file, key);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-24 text-white">
      <div className="mb-10">
        <div className="flex items-center gap-2 font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-2">
          <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
            MAIN MENU
          </button>
          <span>/</span>
          <span>CMS TELEMETRY</span>
        </div>
        <h1 className="font-mono text-3xl sm:text-5xl font-normal tracking-tight uppercase">
          SITE TEXT & BRANDING
        </h1>
        <p className="font-mono text-xs sm:text-sm text-white/50 mt-2">
          Update application headlines, copy, and visual assets persisted in Supabase.
        </p>
      </div>

      {formError && (
        <div className="mb-6 p-4 bg-red-950/60 border border-red-500/40 rounded-xl font-mono text-xs text-red-300">
          ⚠ {formError}
        </div>
      )}

      {/* Asset Upload Deck */}
      <div className="p-6 sm:p-8 bg-white/[0.03] border border-white/15 rounded-2xl mb-8 space-y-4">
        <div className="font-mono text-xs text-[#E3A008] uppercase tracking-widest">
          LOGO & FOUNDER ASSETS // SUPABASE STORAGE
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-black/60 border border-white/10 rounded-xl space-y-2">
            <span className="font-mono text-xs text-white block">Custom Brand Logo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e, 'brand.logo_url')}
              className="text-xs font-mono text-white/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-mono file:bg-[#E3A008] file:text-black cursor-pointer"
            />
          </div>
          <div className="p-4 bg-black/60 border border-white/10 rounded-xl space-y-2">
            <span className="font-mono text-xs text-white block">Founder 1 Portrait</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e, 'founder1.photo_url')}
              className="text-xs font-mono text-white/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-mono file:bg-[#E3A008] file:text-black cursor-pointer"
            />
          </div>
        </div>
        {uploading && (
          <div className="font-mono text-xs text-[#E3A008] animate-pulse">
            TRANSMITTING ASSET TO SUPABASE STORAGE 'site-assets'...
          </div>
        )}
      </div>

      {/* Text Copy Editor */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 bg-white/[0.03] border border-white/15 rounded-2xl space-y-6">
        <div className="font-mono text-xs text-[#E3A008] uppercase tracking-widest mb-2">
          CMS STRINGS & HEADLINES
        </div>

        {fields.map((f) => (
          <div key={f.key} className="space-y-1">
            <label className="block font-mono text-xs text-white/70 uppercase">
              {f.label}
            </label>
            <input
              type="text"
              value={formData[f.key] ?? f.defaultVal}
              onChange={(e) => handleChange(f.key, e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl font-mono text-xs text-white focus:border-[#E3A008] focus:outline-none"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-[#E3A008] hover:bg-[#f4c85f] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer disabled:opacity-50"
        >
          {saving ? 'COMMITTING CMS TO SUPABASE...' : 'SAVE REVISIONS TO SUPABASE'}
        </button>
      </form>
    </div>
  );
};
