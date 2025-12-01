import { TripVibe } from './types';

export const VIBE_OPTIONS = [
  { value: TripVibe.RELAXING, label: 'Relaxing & Wellness', emoji: '🧘‍♀️' },
  { value: TripVibe.ADVENTURE, label: 'High Adventure', emoji: '🌋' },
  { value: TripVibe.NATURE, label: 'Wildlife & Nature', emoji: '🦥' },
  { value: TripVibe.LUXURY, label: 'Luxury & Comfort', emoji: '🥂' },
  { value: TripVibe.CULTURAL, label: 'Cultural & Foodie', emoji: '🍛' },
  { value: TripVibe.PARTY, label: 'Nightlife & Social', emoji: '💃' },
];

export const ACTIVITY_OPTIONS = [
  'Zip Lining / Canopy Tours',
  'Sport Fishing',
  'Bug / Night Tours',
  'Whale Watching',
  'Turtle Sighting',
  'Flora & Fauna / Bird Watching',
  'Scuba Diving',
  'Snorkeling',
  'Surfing',
  'Hiking / Trekking',
  'Hot Springs / Mud Baths',
  'Coffee / Chocolate Tours',
  'White Water Rafting',
  'Waterfall Rappelling',
  'ATV / Off-Road Tours',
  'Horseback Riding',
  'Mangrove Boat Tours',
  'Hanging Bridges',
  'Catamaran / Sunset Sail'
];

export const TRAVEL_DIRECTION_OPTIONS = [
  { value: 'Pre-Wedding', label: 'Before the wedding (I need to get TO Manuel Antonio)' },
  { value: 'Post-Wedding', label: 'After the wedding (I am leaving FROM Manuel Antonio)' }
];

export const REGION_OPTIONS = [
  { value: 'AI_DECIDE', label: '✨ Surprise Me (Based on Activities)', description: 'We will pick the best spot for you.' },
  { value: 'Manuel Antonio', label: 'Manuel Antonio (Stay Local)', description: 'Stay near the wedding. Beaches & Rainforest.' },
  { value: 'La Fortuna', label: 'Arenal / La Fortuna', description: 'Volcanoes, Hot Springs & Waterfalls.' },
  { value: 'Monteverde', label: 'Monteverde', description: 'Cloud Forest, Cool Weather & Nature.' },
  { value: 'Guanacaste', label: 'Guanacaste / Tamarindo', description: 'Gold Coast Beaches, Dry Forest & Resorts.' },
  { value: 'Santa Teresa', label: 'Santa Teresa / Nosara', description: 'Surf, Yoga & Bohemian Vibes.' },
  { value: 'Osa Peninsula', label: 'Osa Peninsula / Drake Bay', description: 'Wild Nature, Tapirs & Raw Adventure.' },
  { value: 'Puerto Viejo', label: 'Puerto Viejo (Caribbean)', description: 'Caribbean Culture, Reggae & Wildlife.' },
];

export const BUDGET_OPTIONS = [
  'Budget Friendly',
  'Moderate',
  'High End',
  'Ultra Luxury'
];

export const PARTY_OPTIONS = [
  'Solo',
  'Couple',
  'Family with Kids',
  'Group of Friends'
];