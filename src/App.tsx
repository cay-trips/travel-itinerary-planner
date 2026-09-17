import React, { useState, useEffect } from 'react';
import { supabase, isConfigured } from './supabase';
import {
  Profile,
  Trip,
  Destination,
  Booking,
  ScreenType,
  ScoredDestination,
} from './types';

// Design Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CinematicQuote } from './components/CinematicQuote';
import { MetricsSection } from './components/MetricsSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { Footer } from './components/Footer';

// Operational CAY Trips Sections
import { TripsSection } from './components/TripsSection';
import { TripDetailView } from './components/TripDetailView';
import { RecommendSection } from './components/RecommendSection';
import { ExploreGlobalSection } from './components/ExploreGlobalSection';
import { MyBookingsSection } from './components/MyBookingsSection';
import { FavoritesSection } from './components/FavoritesSection';
import { QuizSection } from './components/QuizSection';
import { AdminSection } from './components/AdminSection';
import { CMSSection } from './components/CMSSection';
import { AuthModal } from './components/AuthModal';
import { SharedTripView } from './components/SharedTripView';
import { AddExpenseModal } from './components/AddExpenseModal';
import { SplitCostModal } from './components/SplitCostModal';
import { LegalSection } from './components/LegalSection';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  const [sharedTrip, setSharedTrip] = useState<Trip | null>(null);

  // Modals & Messages
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSplitCostOpen, setIsSplitCostOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Load Content & Initial Auth
  useEffect(() => {
    loadContent();
    checkSharedUrl();

    // Session Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserData(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadUserData(session.user.id);
      }
    });

    loadDestinations();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadContent = async () => {
    try {
      const { data } = await supabase.from('site_content').select('*');
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((r: any) => {
          map[r.key] = r.value;
        });
        setSiteContent(map);
      }
    } catch (err) {
      // Fallback defaults
    }
  };

  const loadDestinations = async () => {
    try {
      const { data } = await supabase.from('destinations').select('*').order('name');
      if (data) setDestinations(data);
    } catch (err) {
      // Fallback
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Load Profile
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).single();
      setProfile(prof);

      // Load Trips
      const { data: tripData } = await supabase
        .from('trips')
        .select('*, expenses(amount)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (tripData) {
        const computed = tripData.map((t: any) => ({
          ...t,
          spent: (t.expenses || []).reduce((s: number, e: any) => s + Number(e.amount), 0),
        }));
        setTrips(computed);
      }

      // Load Favorites
      const { data: favs } = await supabase.from('favorites').select('destination_id').eq('user_id', userId);
      if (favs) setFavorites(favs.map((f: any) => f.destination_id));

      // Load Bookings
      const { data: books } = await supabase.from('bookings').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (books) setBookings(books);
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const checkSharedUrl = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('share');
    if (!token) return;

    try {
      const { data } = await supabase
        .from('trips')
        .select('*, trip_destinations(*), transport(*)')
        .eq('share_token', token)
        .eq('is_public', true)
        .single();

      if (data) {
        setSharedTrip(data);
        setCurrentScreen('sharedTrip');
      }
    } catch (err) {
      // Ignore
    }
  };

  // Navigation Helper
  const navigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Trip Details
  const handleSelectTrip = async (tripId: number) => {
    setFormError(null);
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*, trip_destinations(*), transport(*), expenses(*)')
        .eq('id', tripId)
        .single();

      if (error) throw error;
      setSelectedTrip(data);
      setCurrentScreen('tripDetail');
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  // Refresh Selected Trip
  const refreshTrip = async (tripId: number) => {
    try {
      const { data } = await supabase
        .from('trips')
        .select('*, trip_destinations(*), transport(*), expenses(*)')
        .eq('id', tripId)
        .single();
      if (data) setSelectedTrip(data);
      if (user) loadUserData(user.id);
    } catch (err) {
      // Ignore
    }
  };

  // Auth Handlers
  const handleLogin = async (email: string, pass: string) => {
    setFormError(null);
    setAuthMessage(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      setFormError(error.message);
      return;
    }
    setUser(data.user);
    await loadUserData(data.user.id);
    navigate('home');
  };

  const handleRegister = async (email: string, pass: string, name: string) => {
    setFormError(null);
    setAuthMessage(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { full_name: name } },
    });
    if (error) {
      setFormError(error.message);
      return;
    }
    setAuthMessage('Account established. You may now enter credentials to launch.');
  };

  const handleForgotPassword = async (email: string) => {
    setFormError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) {
      setFormError(error.message);
      return;
    }
    setAuthMessage('Password recovery dispatch transmitted to email.');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setTrips([]);
    setSelectedTrip(null);
    navigate('home');
  };

  // Trip CRUD
  const handleCreateTrip = async (tripData: {
    title: string;
    travelers: number;
    start: string;
    end: string;
    budget: number;
  }) => {
    if (!user) {
      navigate('login');
      return;
    }
    const { error } = await supabase.from('trips').insert({
      user_id: user.id,
      title: tripData.title,
      start_date: tripData.start,
      end_date: tripData.end,
      budget: tripData.budget,
      travelers: tripData.travelers,
    });
    if (error) throw error;
    await loadUserData(user.id);
  };

  // Expense Handlers
  const handleAddExpense = async (data: {
    category: string;
    description: string;
    amount: number;
    paid_by: string;
    expense_date: string;
  }) => {
    if (!selectedTrip) return;
    const { error } = await supabase.from('expenses').insert({
      trip_id: selectedTrip.id,
      category: data.category,
      description: data.description,
      amount: data.amount,
      paid_by: data.paid_by,
      expense_date: data.expense_date,
    });
    if (error) throw error;

    // Budget overrun alert email trigger
    try {
      const { data: allExp } = await supabase
        .from('expenses')
        .select('amount')
        .eq('trip_id', selectedTrip.id);
      const total = (allExp || []).reduce((s: number, e: any) => s + Number(e.amount), 0);
      if (total > selectedTrip.budget && !selectedTrip.budget_alert_sent) {
        await fetch('/api/send-notification-email', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            toEmail: user.email,
            toName: profile?.full_name || 'Traveler',
            subject: `Expedition Alert: ${selectedTrip.title} Ceiling Exceeded`,
            message: `Trip budget of Rs.${selectedTrip.budget} exceeded. Current burn: Rs.${total}.`,
          }),
        });
        await supabase.from('trips').update({ budget_alert_sent: true }).eq('id', selectedTrip.id);
      }
    } catch (e) {
      // Non-blocking
    }

    await refreshTrip(selectedTrip.id);
  };

  const handleDeleteExpense = async (id: number) => {
    if (!confirm('Purge this disbursement from the ledger?')) return;
    await supabase.from('expenses').delete().eq('id', id);
    if (selectedTrip) refreshTrip(selectedTrip.id);
  };

  // Transit & Stops
  const handleAddDestination = async (city: string, country: string) => {
    if (!selectedTrip) return;
    await supabase.from('trip_destinations').insert({
      trip_id: selectedTrip.id,
      city,
      country,
    });
    refreshTrip(selectedTrip.id);
  };

  const handleDeleteDestination = async (id: number) => {
    await supabase.from('trip_destinations').delete().eq('id', id);
    if (selectedTrip) refreshTrip(selectedTrip.id);
  };

  const handleAddTransport = async (trans: {
    mode: string;
    from: string;
    to: string;
    date: string;
    cost: number;
    ref?: string;
  }) => {
    if (!selectedTrip) return;
    await supabase.from('transport').insert({
      trip_id: selectedTrip.id,
      mode: trans.mode,
      from_place: trans.from,
      to_place: trans.to,
      travel_date: trans.date,
      cost: trans.cost,
      booking_ref: trans.ref || null,
    });
    refreshTrip(selectedTrip.id);
  };

  const handleDeleteTransport = async (id: number) => {
    await supabase.from('transport').delete().eq('id', id);
    if (selectedTrip) refreshTrip(selectedTrip.id);
  };

  // Share Manifest Handlers
  const handleMakePublic = async (tripId: number) => {
    const token = 'trip-' + Math.random().toString(36).slice(2, 10);
    await supabase.from('trips').update({ is_public: true, share_token: token }).eq('id', tripId);
    refreshTrip(tripId);
  };

  const handleMakePrivate = async (tripId: number) => {
    await supabase.from('trips').update({ is_public: false }).eq('id', tripId);
    refreshTrip(tripId);
  };

  // Favorites
  const handleToggleFavorite = async (destId: number) => {
    if (!user) {
      navigate('login');
      return;
    }
    const isFav = favorites.includes(destId);
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('destination_id', destId);
      setFavorites(favorites.filter((id) => id !== destId));
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, destination_id: destId });
      setFavorites([...favorites, destId]);
    }
  };

  // Booking Flow
  const handleConfirmBooking = async (b: {
    destination: ScoredDestination;
    travelDate: string;
    duration: number;
    travelers: number;
    email: string;
    name: string;
  }) => {
    const cityShort = b.destination.name.split(',')[0];
    const travelUrl =
      b.destination.travel_provider_url ||
      `https://www.google.com/travel/flights?q=${encodeURIComponent('Flights to ' + cityShort)}`;
    const stayUrl =
      b.destination.stay_provider_url ||
      `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(cityShort)}`;

    if (user) {
      await supabase.from('bookings').insert({
        user_id: user.id,
        destination: b.destination.name,
        travel_date: b.travelDate,
        duration: b.duration,
        travelers: b.travelers,
        estimated_cost: b.destination.estimatedCost,
        provider: b.destination.travel_provider_name || 'Google Flights / Booking.com',
        status: 'confirmed',
      });
      loadUserData(user.id);
    }

    try {
      await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          toEmail: b.email,
          toName: b.name,
          booking: {
            destination: b.destination.name,
            travelDate: b.travelDate,
            duration: b.duration,
            travelers: b.travelers,
            total: b.destination.estimatedCost,
            travelProviderName: 'Google Flights',
            travelProviderUrl: travelUrl,
            stayProviderName: 'Booking.com',
            stayProviderUrl: stayUrl,
            lineItems: [{ label: `${b.duration} Days × ${b.travelers} Travelers`, amount: b.destination.estimatedCost }],
          },
        }),
      });
    } catch (e) {
      // Handled silently
    }

    return { travelUrl, stayUrl };
  };

  const handleConfirmGlobalBooking = async (b: {
    city: any;
    duration: number;
    travelers: number;
    date: string;
    email: string;
    name: string;
  }) => {
    const cityLabel = `${b.city.name}, ${b.city.country}`;
    const travelUrl = `https://www.google.com/travel/flights?q=${encodeURIComponent('Flights to ' + b.city.name)}`;
    const stayUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(b.city.name)}`;

    if (user) {
      await supabase.from('bookings').insert({
        user_id: user.id,
        destination: cityLabel,
        travel_date: b.date,
        duration: b.duration,
        travelers: b.travelers,
        estimated_cost: null,
        provider: 'Google Flights / Booking.com',
        status: 'confirmed',
      });
      loadUserData(user.id);
    }

    try {
      await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          toEmail: b.email,
          toName: b.name,
          booking: {
            destination: cityLabel,
            travelDate: b.date,
            duration: b.duration,
            travelers: b.travelers,
            total: null,
            travelProviderName: 'Google Flights',
            travelProviderUrl: travelUrl,
            stayProviderName: 'Booking.com',
            stayProviderUrl: stayUrl,
            lineItems: [],
          },
        }),
      });
    } catch (e) {
      // Handled silently
    }

    return { travelUrl, stayUrl };
  };

  // Admin Hub CRUD
  const handleAddAdminDest = async (d: Partial<Destination>) => {
    await supabase.from('destinations').insert(d);
    loadDestinations();
  };

  const handleUpdateAdminDest = async (id: number, d: Partial<Destination>) => {
    await supabase.from('destinations').update(d).eq('id', id);
    loadDestinations();
  };

  const handleDeleteAdminDest = async (id: number) => {
    if (!confirm('Permanently purge this hub from the global catalog?')) return;
    await supabase.from('destinations').delete().eq('id', id);
    loadDestinations();
  };

  // CMS
  const handleSaveCMS = async (entries: { key: string; value: string }[]) => {
    await supabase.from('site_content').upsert(entries, { onConflict: 'key' });
    loadContent();
  };

  const handleUploadAsset = async (file: File, key: string) => {
    const ext = file.name.split('.').pop();
    const path = `${key.replace('.', '-')}-${Date.now()}.${ext}`;
    await supabase.storage.from('site-assets').upload(path, file, { upsert: true });
    const { data } = supabase.storage.from('site-assets').getPublicUrl(path);
    await supabase.from('site_content').upsert([{ key, value: data.publicUrl }], { onConflict: 'key' });
    loadContent();
  };

  // Render Screen Switcher
  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-[#E3A008] selection:text-black overflow-x-hidden">
      {/* Fixed Futuristic Capsule Navbar */}
      <Navbar
        user={user}
        profile={profile}
        currentScreen={currentScreen}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      {/* Primary Views */}
      <main className="w-full">
        {currentScreen === 'home' && (
          <div className="w-full">
            {/* Section 1: Cinematic Flight Hero (Video Mouse Scrub) */}
            <HeroSection onNavigate={navigate} />

            {/* Section 2: 3D Perspective Philosophy Quote */}
            <CinematicQuote />

            {/* Section 3: Performance Telemetry Benchmarks */}
            <MetricsSection />

            {/* Section 4: 3-Layer Zero-Friction Architecture */}
            <ArchitectureSection />

            {/* Section 5: Core Mission Control Launcher */}
            <section className="relative w-full py-28 px-4 sm:px-8 bg-black border-t border-white/10">
              <div className="w-full max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div>
                    <span className="font-mono text-xs text-[#E3A008] tracking-widest uppercase block mb-2">
                      COMMAND CENTER // 04
                    </span>
                    <h2 className="font-mono text-3xl sm:text-5xl font-normal uppercase text-white">
                      AUTONOMOUS MODULES
                    </h2>
                  </div>
                  <p className="font-mono text-xs sm:text-sm text-white/50 max-w-sm">
                    Direct access to your trip manifests, algorithmic budget recommendations, and global geocoding.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      screen: 'trips',
                      title: 'EXPEDITION MANIFESTS',
                      desc: 'Track active budgets, manage flights, and monitor spending burndown.',
                      tag: 'ACTIVE MODULE',
                    },
                    {
                      screen: 'recommend',
                      title: 'AUTONOMOUS SCORER',
                      desc: 'Query verified hubs weighted by daily burn and in-season climatology.',
                      tag: 'AI ENGINE',
                    },
                    {
                      screen: 'exploreGlobal',
                      title: 'GLOBAL SATELLITE SEARCH',
                      desc: 'Instant Open-Meteo telemetry and geocoding across any city on Earth.',
                      tag: 'LIVE TELEMETRY',
                    },
                    {
                      screen: 'myBookings',
                      title: 'RESERVATION VAULT',
                      desc: 'Historical ledger of verified tickets and dispatched PDF invoices.',
                      tag: 'ARCHIVE',
                    },
                    {
                      screen: 'favorites',
                      title: 'PINNED EXPEDITIONS',
                      desc: 'Saved hubs archived directly from the autonomous recommendation engine.',
                      tag: 'SAVED',
                    },
                    {
                      screen: 'quiz',
                      title: 'EXPEDITION INSPIRATION',
                      desc: 'Three rapid telemetry questions to determine your optimal expedition alignment.',
                      tag: 'INTERACTIVE',
                    },
                  ].map((m) => (
                    <button
                      key={m.screen}
                      type="button"
                      onClick={() => navigate(m.screen as ScreenType)}
                      className="p-6 bg-white/[0.03] hover:bg-white/[0.08] border border-white/15 hover:border-[#E3A008] rounded-2xl text-left transition-all cursor-pointer group flex flex-col justify-between min-h-[180px]"
                    >
                      <div>
                        <span className="font-mono text-[10px] tracking-widest text-[#E3A008] block mb-2">
                          // {m.tag}
                        </span>
                        <h3 className="font-mono text-lg font-bold text-white group-hover:text-[#E3A008] transition-colors">
                          {m.title}
                        </h3>
                        <p className="font-mono text-xs text-white/50 mt-2 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-white/40 group-hover:text-white mt-4 block">
                        INITIALIZE INTERFACE →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {currentScreen === 'trips' && (
          <TripsSection
            trips={trips}
            onSelectTrip={handleSelectTrip}
            onCreateTrip={handleCreateTrip}
            onBack={() => navigate('home')}
            formError={formError}
          />
        )}

        {currentScreen === 'tripDetail' && selectedTrip && (
          <TripDetailView
            trip={selectedTrip}
            onBack={() => navigate('trips')}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onOpenSplitCost={() => setIsSplitCostOpen(true)}
            onDeleteExpense={handleDeleteExpense}
            onDeleteTransport={handleDeleteTransport}
            onDeleteDestination={handleDeleteDestination}
            onMakePublic={handleMakePublic}
            onMakePrivate={handleMakePrivate}
            onAddDestination={handleAddDestination}
            onAddTransport={handleAddTransport}
            formError={formError}
          />
        )}

        {currentScreen === 'recommend' && (
          <RecommendSection
            destinations={destinations}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onConfirmBooking={handleConfirmBooking}
            onBack={() => navigate('home')}
            formError={formError}
          />
        )}

        {currentScreen === 'exploreGlobal' && (
          <ExploreGlobalSection
            onBack={() => navigate('home')}
            onConfirmGlobalBooking={handleConfirmGlobalBooking}
            formError={formError}
          />
        )}

        {currentScreen === 'myBookings' && (
          <MyBookingsSection
            bookings={bookings}
            onBack={() => navigate('home')}
          />
        )}

        {currentScreen === 'favorites' && (
          <FavoritesSection
            favorites={destinations.filter((d) => favorites.includes(d.id))}
            onToggleFavorite={handleToggleFavorite}
            onBack={() => navigate('home')}
          />
        )}

        {currentScreen === 'quiz' && (
          <QuizSection
            destinations={destinations}
            onBack={() => navigate('home')}
            onGoToRecommend={() => navigate('recommend')}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminSection
            destinations={destinations}
            onAddDestination={handleAddAdminDest}
            onUpdateDestination={handleUpdateAdminDest}
            onDeleteDestination={handleDeleteAdminDest}
            onBack={() => navigate('home')}
            formError={formError}
          />
        )}

        {currentScreen === 'adminContent' && (
          <CMSSection
            content={siteContent}
            onSaveContent={handleSaveCMS}
            onUploadAsset={handleUploadAsset}
            onBack={() => navigate('home')}
            formError={formError}
          />
        )}

        {currentScreen === 'login' && (
          <AuthModal
            onLogin={handleLogin}
            onRegister={handleRegister}
            onForgotPassword={handleForgotPassword}
            onBackToHome={() => navigate('home')}
            authMessage={authMessage}
            formError={formError}
          />
        )}

        {currentScreen === 'sharedTrip' && sharedTrip && (
          <SharedTripView
            trip={sharedTrip}
            onGoHome={() => navigate('home')}
          />
        )}

        {['about', 'founders', 'contact', 'privacy', 'terms'].includes(currentScreen) && (
          <LegalSection
            type={currentScreen as any}
            onBack={() => navigate('home')}
            siteContent={siteContent}
          />
        )}
      </main>

      {/* Modals */}
      {isAddExpenseOpen && selectedTrip && (
        <AddExpenseModal
          trip={selectedTrip}
          onClose={() => setIsAddExpenseOpen(false)}
          onAddExpense={handleAddExpense}
        />
      )}

      {isSplitCostOpen && selectedTrip && (
        <SplitCostModal
          trip={selectedTrip}
          onClose={() => setIsSplitCostOpen(false)}
        />
      )}

      {/* Global Cinematic Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}
