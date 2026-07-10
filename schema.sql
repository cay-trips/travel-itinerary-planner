-- ============================================================
-- TRAVEL ITINERARY PLANNER — SUPABASE SCHEMA
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New Query → paste all of this → Run)
-- ============================================================

-- ---------- PROFILES (extends Supabase's built-in auth.users) ----------
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz default now()
);

-- Auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, is_admin)
  values (new.id, new.raw_user_meta_data->>'full_name', false);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- DESTINATIONS (shared reference data — admin-editable) ----------
create table destinations (
  id bigint generated always as identity primary key,
  name text not null,
  avg_daily_budget numeric not null,
  best_months int[] not null,       -- e.g. {11,12,1,2} = Nov, Dec, Jan, Feb
  attractions text,
  latitude numeric,
  longitude numeric,
  travel_provider_name text,        -- e.g. 'IndiGo', 'IRCTC', 'Emirates'
  travel_provider_url text,
  stay_provider_name text,          -- e.g. 'MakeMyTrip', 'Booking.com'
  stay_provider_url text,
  created_at timestamptz default now()
);

insert into destinations (name, avg_daily_budget, best_months, attractions, latitude, longitude, travel_provider_name, travel_provider_url, stay_provider_name, stay_provider_url) values
  ('Goa, India', 2000, ARRAY[11,12,1,2], 'Beaches, Fort Aguada, Dudhsagar Falls', 15.2993, 74.1240, 'IndiGo', 'https://www.goindigo.in/', 'MakeMyTrip', 'https://www.makemytrip.com/hotels/'),
  ('Manali, India', 2500, ARRAY[3,4,5,6], 'Solang Valley, Rohtang Pass, Hidimba Temple', 32.2432, 77.1892, 'RedBus', 'https://www.redbus.in/', 'MakeMyTrip', 'https://www.makemytrip.com/hotels/'),
  ('Jaipur, India', 2200, ARRAY[10,11,12,1,2], 'Amber Fort, Hawa Mahal, City Palace', 26.9124, 75.7873, 'IRCTC', 'https://www.irctc.co.in/', 'OYO', 'https://www.oyorooms.com/'),
  ('Munnar & Alleppey, India', 2800, ARRAY[9,10,11,12,1,2,3], 'Backwaters, Tea Gardens, Houseboats', 10.0889, 77.0595, 'RedBus', 'https://www.redbus.in/', 'MakeMyTrip', 'https://www.makemytrip.com/hotels/'),
  ('Ladakh, India', 3200, ARRAY[5,6,7,8,9], 'Pangong Lake, Nubra Valley, Monasteries', 34.1526, 77.5771, 'Air India', 'https://www.airindia.com/', 'MakeMyTrip', 'https://www.makemytrip.com/hotels/'),
  ('Rishikesh, India', 1800, ARRAY[9,10,11,2,3,4], 'River Rafting, Ganga Aarti, Yoga Ashrams', 30.0869, 78.2676, 'IRCTC', 'https://www.irctc.co.in/', 'OYO', 'https://www.oyorooms.com/'),
  ('Paris, France', 4500, ARRAY[4,5,6,9], 'Eiffel Tower, Louvre, Seine Cruise', 48.8566, 2.3522, 'Air France', 'https://wwws.airfrance.in/', 'Booking.com', 'https://www.booking.com/'),
  ('Rome, Italy', 4200, ARRAY[4,5,9,10], 'Colosseum, Vatican, Trevi Fountain', 41.9028, 12.4964, 'ITA Airways', 'https://www.ita-airways.com/', 'Booking.com', 'https://www.booking.com/'),
  ('Bangkok, Thailand', 3000, ARRAY[11,12,1,2], 'Grand Palace, Chatuchak Market, River Cruise', 13.7563, 100.5018, 'Thai Airways', 'https://www.thaiairways.com/', 'Agoda', 'https://www.agoda.com/'),
  ('Bali, Indonesia', 3300, ARRAY[4,5,6,9,10], 'Ubud, Uluwatu Temple, Rice Terraces', -8.6500, 115.2167, 'AirAsia', 'https://www.airasia.com/', 'Agoda', 'https://www.agoda.com/'),
  ('Dubai, UAE', 4800, ARRAY[11,12,1,2,3], 'Burj Khalifa, Desert Safari, Dubai Mall', 25.2048, 55.2708, 'Emirates', 'https://www.emirates.com/', 'Booking.com', 'https://www.booking.com/'),
  ('Singapore', 4600, ARRAY[2,3,4,11], 'Gardens by the Bay, Sentosa, Marina Bay', 1.3521, 103.8198, 'Singapore Airlines', 'https://www.singaporeair.com/', 'Booking.com', 'https://www.booking.com/');

-- ---------- TRIPS (owned by a user) ----------
create table trips (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  start_date date not null,
  end_date date not null,
  budget numeric not null default 0,
  travelers int not null default 1,
  status text not null default 'Planned',
  created_at timestamptz default now()
);

-- ---------- TRIP DESTINATIONS ----------
create table trip_destinations (
  id bigint generated always as identity primary key,
  trip_id bigint references trips on delete cascade not null,
  city text not null,
  country text not null
);

-- ---------- TRANSPORT ----------
create table transport (
  id bigint generated always as identity primary key,
  trip_id bigint references trips on delete cascade not null,
  mode text not null,
  from_place text not null,
  to_place text not null,
  travel_date date not null,
  cost numeric not null default 0,
  booking_ref text
);

-- ---------- EXPENSES ----------
create table expenses (
  id bigint generated always as identity primary key,
  trip_id bigint references trips on delete cascade not null,
  category text not null,
  description text,
  amount numeric not null,
  paid_by text not null,
  expense_date date not null
);

-- ============================================================
-- ROW LEVEL SECURITY — every table is private by default;
-- these policies open up exactly what each user is allowed to do.
-- ============================================================

alter table profiles enable row level security;
create policy "View own profile" on profiles for select using (auth.uid() = id);
create policy "Update own profile" on profiles for update using (auth.uid() = id);

alter table destinations enable row level security;
create policy "Any logged-in user can read destinations"
  on destinations for select using (auth.role() = 'authenticated');
create policy "Admins can add destinations"
  on destinations for insert with check (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );
create policy "Admins can edit destinations"
  on destinations for update using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );
create policy "Admins can delete destinations"
  on destinations for delete using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

alter table trips enable row level security;
create policy "Users manage their own trips"
  on trips for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table trip_destinations enable row level security;
create policy "Users manage their own trip destinations"
  on trip_destinations for all using (
    exists (select 1 from trips where trips.id = trip_destinations.trip_id and trips.user_id = auth.uid())
  ) with check (
    exists (select 1 from trips where trips.id = trip_destinations.trip_id and trips.user_id = auth.uid())
  );

alter table transport enable row level security;
create policy "Users manage their own transport records"
  on transport for all using (
    exists (select 1 from trips where trips.id = transport.trip_id and trips.user_id = auth.uid())
  ) with check (
    exists (select 1 from trips where trips.id = transport.trip_id and trips.user_id = auth.uid())
  );

alter table expenses enable row level security;
create policy "Users manage their own expenses"
  on expenses for all using (
    exists (select 1 from trips where trips.id = expenses.trip_id and trips.user_id = auth.uid())
  ) with check (
    exists (select 1 from trips where trips.id = expenses.trip_id and trips.user_id = auth.uid())
  );

-- ---------- BOOKINGS (confirmed recommendation → invoice/itinerary sent → redirected for payment) ----------
create table bookings (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  trip_id bigint references trips on delete set null,
  destination text not null,
  travel_date date not null,
  duration int not null,
  travelers int not null,
  estimated_cost numeric not null,
  provider text not null default 'Google Flights',
  status text not null default 'confirmed',
  created_at timestamptz default now()
);

alter table bookings enable row level security;
create policy "Users manage their own bookings"
  on bookings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- AFTER RUNNING THIS SCRIPT:
-- 1. Sign up once through the live app (creates your user + profile row)
-- 2. In Supabase Dashboard → Table Editor → profiles, find your row,
--    and set is_admin to TRUE — this makes you the first admin.
-- ============================================================
