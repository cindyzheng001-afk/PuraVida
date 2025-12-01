import React, { useState } from 'react';
import { UserPreferences, TripVibe } from '../types';
import { VIBE_OPTIONS, ACTIVITY_OPTIONS, TRAVEL_DIRECTION_OPTIONS, BUDGET_OPTIONS, PARTY_OPTIONS, REGION_OPTIONS } from '../constants';
import { generateItinerary } from '../services/geminiService';

interface PlannerFormProps {
  onPlanGenerated: (data: any) => void;
  setIsLoading: (loading: boolean) => void;
}

export const PlannerForm: React.FC<PlannerFormProps> = ({ onPlanGenerated, setIsLoading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserPreferences>({
    guestName: '',
    travelDirection: 'Pre-Wedding',
    tripDuration: 3,
    vibe: [],
    activities: [],
    preferredRegions: ['AI_DECIDE'],
    budgetLevel: 'Moderate',
    travelingParty: 'Couple'
  });

  const handleVibeToggle = (vibe: TripVibe) => {
    setFormData(prev => {
      const vibes = prev.vibe.includes(vibe)
        ? prev.vibe.filter(v => v !== vibe)
        : [...prev.vibe, vibe];
      return { ...prev, vibe: vibes };
    });
  };

  const handleActivityToggle = (activity: string) => {
    setFormData(prev => {
      const acts = prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity];
      return { ...prev, activities: acts };
    });
  };

  const handleRegionToggle = (regionValue: string) => {
    setFormData(prev => {
      let newRegions = [...prev.preferredRegions];
      
      if (regionValue === 'AI_DECIDE') {
        // If Surprise Me is clicked, clear others and select only this
        return { ...prev, preferredRegions: ['AI_DECIDE'] };
      } else {
        // If a specific region is clicked
        if (newRegions.includes('AI_DECIDE')) {
          newRegions = []; // Remove Surprise Me
        }
        
        if (newRegions.includes(regionValue)) {
          newRegions = newRegions.filter(r => r !== regionValue);
        } else {
          newRegions.push(regionValue);
        }

        // If user deselects everything, default back to Surprise Me? 
        // Or just let it be empty and validate later. Let's default to empty array.
        return { ...prev, preferredRegions: newRegions };
      }
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await generateItinerary(formData);
      onPlanGenerated(result);
    } catch (e) {
      alert("Something went wrong generating your plan. Please try again.");
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const getRegionDisplay = () => {
    if (formData.preferredRegions.includes('AI_DECIDE')) return "Curated by AI";
    if (formData.preferredRegions.length === 0) return "Curated by AI";
    return formData.preferredRegions.join(" & ");
  };

  return (
    <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 border border-white/50">
      
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-100 mb-8 rounded-full overflow-hidden">
        <div 
          className="h-full bg-jungle-500 transition-all duration-500 ease-out" 
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {step === 1 && (
        <div className="animate-fade-in space-y-6">
          <h2 className="text-3xl font-serif text-jungle-900 mb-2">The Basics</h2>
          <p className="text-gray-500">Tell us about your trip logistics.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Guest Name</label>
              <input 
                type="text" 
                value={formData.guestName}
                onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jungle-400 focus:outline-none transition"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                Will you be traveling to or from the wedding location, Manuel Antonio?
              </label>
              <div className="grid grid-cols-1 gap-3">
                {TRAVEL_DIRECTION_OPTIONS.map(opt => (
                   <button
                    key={opt.value}
                    onClick={() => setFormData({...formData, travelDirection: opt.value as any})}
                    className={`p-4 rounded-xl border-2 text-left transition duration-200 flex items-center gap-3 ${
                      formData.travelDirection === opt.value
                      ? 'border-jungle-500 bg-jungle-50 text-jungle-900'
                      : 'border-gray-100 bg-white text-gray-500 hover:border-jungle-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                       formData.travelDirection === opt.value ? 'border-jungle-500' : 'border-gray-300'
                    }`}>
                      {formData.travelDirection === opt.value && <div className="w-2 h-2 rounded-full bg-jungle-500" />}
                    </div>
                    <span className="font-bold text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Party Size</label>
                <select 
                  value={formData.travelingParty}
                  onChange={(e) => setFormData({...formData, travelingParty: e.target.value as any})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jungle-400 focus:outline-none"
                >
                  {PARTY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Budget</label>
                <select 
                  value={formData.budgetLevel}
                  onChange={(e) => setFormData({...formData, budgetLevel: e.target.value as any})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jungle-400 focus:outline-none"
                >
                  {BUDGET_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
             <button 
              onClick={nextStep}
              disabled={!formData.guestName}
              className="px-8 py-3 bg-jungle-600 text-white rounded-full font-bold shadow-lg hover:bg-jungle-700 transition disabled:opacity-50"
             >
               Next
             </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in space-y-6">
          <h2 className="text-3xl font-serif text-jungle-900 mb-2">Your Ideal Experience</h2>
          <p className="text-gray-500">Customize your destination and activities.</p>

          {/* Region Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
              Where do you want to go? (Select one or multiple)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REGION_OPTIONS.map((region) => {
                const isSelected = formData.preferredRegions.includes(region.value);
                return (
                  <button
                    key={region.value}
                    onClick={() => handleRegionToggle(region.value)}
                    className={`p-3 rounded-xl border-2 text-left transition duration-200 hover:border-jungle-200 ${
                      isSelected
                      ? 'border-jungle-500 bg-jungle-50'
                      : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-jungle-900 text-sm">{region.label}</div>
                      {isSelected && <span className="text-jungle-500 text-lg">✓</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{region.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Overall Vibe</label>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {VIBE_OPTIONS.map((vibe) => (
                <button
                  key={vibe.value}
                  onClick={() => handleVibeToggle(vibe.value)}
                  className={`p-3 rounded-xl border transition duration-200 text-left flex flex-col items-center justify-center text-center h-24 ${
                    formData.vibe.includes(vibe.value)
                    ? 'border-jungle-500 bg-jungle-50 text-jungle-800 shadow-md'
                    : 'border-gray-100 bg-white text-gray-500 hover:border-jungle-200'
                  }`}
                >
                  <span className="text-2xl mb-1 block">{vibe.emoji}</span>
                  <span className="text-xs font-bold leading-tight">{vibe.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Must-Do Activities</label>
             <div className="flex flex-wrap gap-2">
                {ACTIVITY_OPTIONS.map(activity => (
                  <button
                    key={activity}
                    onClick={() => handleActivityToggle(activity)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition ${
                      formData.activities.includes(activity)
                      ? 'bg-jungle-600 text-white border-jungle-600 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-jungle-300'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
             </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
             <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
               Trip Duration ({formData.tripDuration} days)
             </label>
             <input 
              type="range" 
              min="1" 
              max="14" 
              value={formData.tripDuration}
              onChange={(e) => setFormData({...formData, tripDuration: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-jungle-600"
             />
             <div className="flex justify-between text-xs text-gray-400 mt-2">
               <span>1 Day</span>
               <span>7 Days</span>
               <span>14 Days</span>
             </div>
          </div>

          <div className="pt-4 flex justify-between">
             <button 
              onClick={prevStep}
              className="px-6 py-3 text-gray-500 font-bold hover:text-jungle-600 transition"
             >
               Back
             </button>
             <button 
              onClick={nextStep}
              disabled={formData.preferredRegions.length === 0 && formData.vibe.length === 0 && formData.activities.length === 0}
              className="px-8 py-3 bg-jungle-600 text-white rounded-full font-bold shadow-lg hover:bg-jungle-700 transition disabled:opacity-50"
             >
               Next
             </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in space-y-6 text-center">
          <h2 className="text-3xl font-serif text-jungle-900 mb-4">Almost Ready!</h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            We are crafting a {formData.tripDuration}-day {formData.travelDirection.toLowerCase()} itinerary for {formData.guestName}.
            <br/><br/>
            Destination: <span className="font-bold text-jungle-700">{getRegionDisplay()}</span>
            <br/>
            Based on your interest in <span className="font-bold text-jungle-700">{formData.activities.length > 0 ? formData.activities.slice(0,3).join(", ") + (formData.activities.length > 3 ? "..." : "") : "Costa Rica"}</span>.
          </p>
          
          <div className="p-6 bg-sand-200 rounded-2xl mb-8 border border-sand-300">
            <h3 className="font-serif font-bold text-jungle-800 mb-2">March 2027 Wedding</h3>
            <p className="text-sm text-jungle-800/80">
              Your itinerary will be optimized to {formData.travelDirection === 'Pre-Wedding' ? 'get you TO' : 'depart FROM'} Manuel Antonio smoothly.
            </p>
          </div>

          <div className="flex justify-between items-center">
             <button 
              onClick={prevStep}
              className="px-6 py-3 text-gray-500 font-bold hover:text-jungle-600 transition"
             >
               Back
             </button>
             <button 
              onClick={handleSubmit}
              className="px-10 py-4 bg-gradient-to-r from-jungle-600 to-jungle-500 text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition transform duration-200 flex items-center gap-2"
             >
               ✨ Generate My Trip
             </button>
          </div>
        </div>
      )}
    </div>
  );
};