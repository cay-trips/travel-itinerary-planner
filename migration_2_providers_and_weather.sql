-- ============================================================
-- MIGRATION 2 — run this in Supabase SQL Editor on your EXISTING project.
-- This only ADDS columns and updates existing rows — it does not touch
-- your trips, bookings, or profiles data.
-- ============================================================

alter table destinations add column if not exists latitude numeric;
alter table destinations add column if not exists longitude numeric;
alter table destinations add column if not exists travel_provider_name text;
alter table destinations add column if not exists travel_provider_url text;
alter table destinations add column if not exists stay_provider_name text;
alter table destinations add column if not exists stay_provider_url text;

update destinations set latitude=15.2993, longitude=74.1240,
  travel_provider_name='IndiGo', travel_provider_url='https://www.goindigo.in/',
  stay_provider_name='MakeMyTrip', stay_provider_url='https://www.makemytrip.com/hotels/'
  where name='Goa, India';

update destinations set latitude=32.2432, longitude=77.1892,
  travel_provider_name='RedBus', travel_provider_url='https://www.redbus.in/',
  stay_provider_name='MakeMyTrip', stay_provider_url='https://www.makemytrip.com/hotels/'
  where name='Manali, India';

update destinations set latitude=26.9124, longitude=75.7873,
  travel_provider_name='IRCTC', travel_provider_url='https://www.irctc.co.in/',
  stay_provider_name='OYO', stay_provider_url='https://www.oyorooms.com/'
  where name='Jaipur, India';

update destinations set latitude=10.0889, longitude=77.0595,
  travel_provider_name='RedBus', travel_provider_url='https://www.redbus.in/',
  stay_provider_name='MakeMyTrip', stay_provider_url='https://www.makemytrip.com/hotels/'
  where name='Munnar & Alleppey, India';

update destinations set latitude=34.1526, longitude=77.5771,
  travel_provider_name='Air India', travel_provider_url='https://www.airindia.com/',
  stay_provider_name='MakeMyTrip', stay_provider_url='https://www.makemytrip.com/hotels/'
  where name='Ladakh, India';

update destinations set latitude=30.0869, longitude=78.2676,
  travel_provider_name='IRCTC', travel_provider_url='https://www.irctc.co.in/',
  stay_provider_name='OYO', stay_provider_url='https://www.oyorooms.com/'
  where name='Rishikesh, India';

update destinations set latitude=48.8566, longitude=2.3522,
  travel_provider_name='Air France', travel_provider_url='https://wwws.airfrance.in/',
  stay_provider_name='Booking.com', stay_provider_url='https://www.booking.com/'
  where name='Paris, France';

update destinations set latitude=41.9028, longitude=12.4964,
  travel_provider_name='ITA Airways', travel_provider_url='https://www.ita-airways.com/',
  stay_provider_name='Booking.com', stay_provider_url='https://www.booking.com/'
  where name='Rome, Italy';

update destinations set latitude=13.7563, longitude=100.5018,
  travel_provider_name='Thai Airways', travel_provider_url='https://www.thaiairways.com/',
  stay_provider_name='Agoda', stay_provider_url='https://www.agoda.com/'
  where name='Bangkok, Thailand';

update destinations set latitude=-8.6500, longitude=115.2167,
  travel_provider_name='AirAsia', travel_provider_url='https://www.airasia.com/',
  stay_provider_name='Agoda', stay_provider_url='https://www.agoda.com/'
  where name='Bali, Indonesia';

update destinations set latitude=25.2048, longitude=55.2708,
  travel_provider_name='Emirates', travel_provider_url='https://www.emirates.com/',
  stay_provider_name='Booking.com', stay_provider_url='https://www.booking.com/'
  where name='Dubai, UAE';

update destinations set latitude=1.3521, longitude=103.8198,
  travel_provider_name='Singapore Airlines', travel_provider_url='https://www.singaporeair.com/',
  stay_provider_name='Booking.com', stay_provider_url='https://www.booking.com/'
  where name='Singapore';

-- If you add new destinations via the Admin panel going forward, the
-- Admin form now also asks for latitude/longitude and these provider
-- fields directly — no need to run SQL for those.
