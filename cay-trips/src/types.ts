export interface Profile {
  id: string;
  full_name: string | null;
  is_admin: boolean | null;
}

export interface TripDestination {
  id: number;
  trip_id: number;
  city: string;
  country: string;
}

export interface Transport {
  id: number;
  trip_id: number;
  mode: string;
  from_place: string;
  to_place: string;
  travel_date: string;
  cost: number;
  booking_ref: string | null;
}

export interface Expense {
  id: number;
  trip_id: number;
  category: string;
  description: string | null;
  amount: number;
  paid_by: string;
  expense_date: string;
}

export interface Trip {
  id: number;
  user_id: string;
  title: string;
  start_date: string;
  end_date: string;
  budget: number;
  travelers: number;
  status: string;
  is_public: boolean;
  share_token: string | null;
  budget_alert_sent: boolean;
  created_at?: string;
  spent?: number;
  trip_destinations?: TripDestination[];
  transport?: Transport[];
  expenses?: Expense[];
}

export interface Destination {
  id: number;
  name: string;
  avg_daily_budget: number;
  best_months: number[];
  attractions: string | null;
  latitude: number | null;
  longitude: number | null;
  travel_provider_name: string | null;
  travel_provider_url: string | null;
  stay_provider_name: string | null;
  stay_provider_url: string | null;
}

export interface ScoredDestination extends Destination {
  estimatedCost: number;
  budgetFit: number;
  seasonalFit: number;
  combined: number;
  inSeason: boolean;
  reason: string;
}

export interface Booking {
  id: number;
  user_id: string;
  trip_id: number | null;
  destination: string;
  travel_date: string;
  duration: number;
  travelers: number;
  estimated_cost: number | null;
  provider: string;
  status: string;
  created_at?: string;
}

export interface Favorite {
  id: number;
  user_id: string;
  destination_id: number;
  destinations?: Destination;
}

export interface SplitPerson {
  name: string;
  paid: number;
  share: number;
  balance: number;
  status: 'settled' | 'gets_back' | 'owes';
}

export type ScreenType =
  | 'home'
  | 'login'
  | 'forgotPassword'
  | 'resetPassword'
  | 'trips'
  | 'tripDetail'
  | 'addExpense'
  | 'splitCost'
  | 'recommend'
  | 'exploreGlobal'
  | 'myBookings'
  | 'favorites'
  | 'quiz'
  | 'admin'
  | 'adminContent'
  | 'about'
  | 'founders'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'sharedTrip';
