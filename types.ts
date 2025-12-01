export enum TripVibe {
  RELAXING = 'Relaxing & Wellness',
  ADVENTURE = 'High Adventure',
  LUXURY = 'Luxury & Comfort',
  CULTURAL = 'Cultural & Foodie',
  PARTY = 'Nightlife & Social',
  NATURE = 'Wildlife & Nature'
}

export interface UserPreferences {
  guestName: string;
  travelDirection: 'Pre-Wedding' | 'Post-Wedding';
  tripDuration: number; // in days
  vibe: TripVibe[];
  activities: string[];
  preferredRegions: string[];
  budgetLevel: 'Budget Friendly' | 'Moderate' | 'High End' | 'Ultra Luxury';
  travelingParty: 'Solo' | 'Couple' | 'Family with Kids' | 'Group of Friends';
}

// Gemini Response Types
export interface DailyPlan {
  day: number;
  title: string;
  morningActivity: string;
  afternoonActivity: string;
  eveningActivity: string;
  location: string;
}

export interface AccommodationRecommendation {
  name: string;
  area: string;
  description: string;
  estimatedPrice: string;
}

export interface TravelItinerary {
  itineraryName: string;
  summary: string;
  weddingLogistics: string; // How to get to the wedding location from this trip
  weatherNote: string; // Specific to March 2027
  accommodations: AccommodationRecommendation[];
  schedule: DailyPlan[];
  packingTips: string[];
}