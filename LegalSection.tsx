import React from 'react';
import { ScreenType } from '../types';

interface LegalSectionProps {
  type: 'about' | 'founders' | 'contact' | 'privacy' | 'terms';
  onBack: () => void;
  siteContent: Record<string, string>;
}

export const LegalSection: React.FC<LegalSectionProps> = ({ type, onBack, siteContent }) => {
  const ct = (key: string, fallback: string) => siteContent[key] || fallback;

  const titles: Record<string, string> = {
    about: 'ABOUT CAY TRIPS',
    founders: 'THE FOUNDERS',
    contact: 'CONTACT TELEMETRY',
    privacy: 'PRIVACY PROTOCOL',
    terms: 'TERMS OF OPERATION',
  };

  const founders = [1, 2, 3].map((n) => ({
    name: ct(`founder${n}.name`, `Founder ${n}`),
    role: ct(`founder${n}.role`, 'Co-Founder'),
    bio: ct(`founder${n}.bio`, 'Architect behind CAY Trips computational engine.'),
    photo: ct(`founder${n}.photo_url`, ''),
  }));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-24 text-white">
      <div className="mb-10">
        <div className="flex items-center gap-2 font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-2">
          <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
            MAIN MENU
          </button>
          <span>/</span>
          <span>{type.toUpperCase()}</span>
        </div>
        <h1 className="font-mono text-3xl sm:text-5xl font-normal tracking-tight uppercase">
          {titles[type]}
        </h1>
      </div>

      <div className="p-8 sm:p-10 bg-white/[0.03] border border-white/15 rounded-2xl font-mono text-sm leading-relaxed text-white/80 space-y-6">
        {type === 'about' && (
          <div>
            <p className="text-white/70 whitespace-pre-line leading-relaxed">
              {ct(
                'about.body',
                'CAY Trips was conceived to solve an enduring friction in travel logistics: group expeditions are effortless to dream up, but arduous to reconcile and budget accurately.\n\nBy uniting live Open-Meteo atmospheric telemetry with deterministic equal-share debt matrices and zero-markup affiliate links, CAY Trips ensures every traveler operates with total computational certainty.'
              )}
            </p>
          </div>
        )}

        {type === 'founders' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {founders.map((f, i) => (
              <div key={f.name + i} className="p-6 bg-black/60 border border-white/10 rounded-xl text-center space-y-3">
                {f.photo ? (
                  <img
                    src={f.photo}
                    alt={f.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#E3A008]"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full mx-auto bg-white/10 border border-white/20 flex items-center justify-center font-mono text-xl font-bold text-[#E3A008]">
                    {f.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white text-base">{f.name}</h3>
                  <span className="text-[#E3A008] text-xs uppercase tracking-wider block mt-0.5">
                    {f.role}
                  </span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">{f.bio}</p>
              </div>
            ))}
          </div>
        )}

        {type === 'contact' && (
          <div className="space-y-4">
            <p className="text-white/70 whitespace-pre-line">
              {ct(
                'contact.body',
                'Have telemetry feedback, identified an edge case, or wish to collaborate? Reach out to the core development team.'
              )}
            </p>
            <div className="p-4 bg-black/60 border border-white/10 rounded-xl text-xs space-y-2">
              <div>// DISPATCH REPOSITORY: github.com/aarushvijay</div>
              <div>// TELEMETRY DESK: contact@cay-trips.vercel.app</div>
              <div>// PROTOCOL: HTTPS / SUPABASE AUTHENTICATED</div>
            </div>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-4 text-xs text-white/70 leading-relaxed">
            <p><strong>// DATA HARVESTING POLICY:</strong> We collect only account credentials, itinerary parameters, and transaction records necessary to compute your travel budget.</p>
            <p><strong>// THIRD-PARTY HANDSHAKES:</strong> Supabase acts as the secure primary datastore. Open-Meteo supplies keyless weather telemetry without telemetry tracking. Brevo delivers transactional booking confirmations.</p>
            <p><strong>// MONETIZATION DISCLOSURE:</strong> CAY Trips does not inject speculative markups. Booking buttons connect directly to recognized commercial airlines and hospitality hubs.</p>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-4 text-xs text-white/70 leading-relaxed">
            <p><strong>// OPERATIONAL SCOPE:</strong> CAY Trips operates as an autonomous planning tool. Flight schedules, weather conditions, and hospitality costs are advisory and must be verified upon final provider checkout.</p>
            <p><strong>// SECURITY RESPONSIBILITY:</strong> Users are solely responsible for maintaining the confidentiality of their Supabase access tokens and choosing whether to publish read-only itineraries.</p>
          </div>
        )}
      </div>
    </div>
  );
};
