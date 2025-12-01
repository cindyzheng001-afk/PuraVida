import React from 'react';
import { TravelItinerary, DailyPlan } from '../types';

interface ItineraryResultProps {
  itinerary: TravelItinerary;
  onReset: () => void;
}

const DayCard: React.FC<{ plan: DailyPlan }> = ({ plan }) => (
  <div className="relative pl-8 pb-12 last:pb-0 border-l-2 border-jungle-200">
    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-jungle-500 border-4 border-white shadow-sm"></div>
    <h4 className="text-lg font-bold text-jungle-800 mb-1">Day {plan.day}: {plan.title}</h4>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{plan.location}</p>
    
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
        <span className="text-xs font-bold text-orange-400 uppercase mb-1 block">Morning</span>
        <p className="text-gray-700">{plan.morningActivity}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
        <span className="text-xs font-bold text-yellow-500 uppercase mb-1 block">Afternoon</span>
        <p className="text-gray-700">{plan.afternoonActivity}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
        <span className="text-xs font-bold text-indigo-400 uppercase mb-1 block">Evening</span>
        <p className="text-gray-700">{plan.eveningActivity}</p>
      </div>
    </div>
  </div>
);

export const ItineraryResult: React.FC<ItineraryResultProps> = ({ itinerary, onReset }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-20">
      
      {/* Header Section */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
        <div className="h-48 md:h-64 bg-[url('https://picsum.photos/1200/400?grayscale')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-jungle-900/60 flex items-center justify-center p-8 text-center flex-col">
                <h2 className="text-3xl md:text-5xl font-serif text-white font-bold mb-4">{itinerary.itineraryName}</h2>
                <p className="text-white/90 max-w-2xl text-lg font-light leading-relaxed">{itinerary.summary}</p>
            </div>
        </div>
        
        {/* Logistics & Tips Bar */}
        <div className="bg-jungle-50 p-6 grid md:grid-cols-2 gap-6 border-b border-jungle-100">
            <div>
                <h4 className="font-bold text-jungle-800 uppercase text-xs tracking-wider mb-2">🚗 Getting to the Wedding</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{itinerary.weddingLogistics}</p>
            </div>
            <div>
                <h4 className="font-bold text-jungle-800 uppercase text-xs tracking-wider mb-2">☀️ March 2027 Forecast</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{itinerary.weatherNote}</p>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Main Timeline */}
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
            <h3 className="text-2xl font-serif text-jungle-900 pl-4">Daily Itinerary</h3>
            <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-lg">
                {itinerary.schedule.map((day) => (
                    <DayCard key={day.day} plan={day} />
                ))}
            </div>
        </div>

        {/* Sidebar: Hotels & Tips */}
        <div className="md:col-span-5 lg:col-span-4 space-y-6">
            
            {/* Hotels */}
            <div>
                <h3 className="text-2xl font-serif text-jungle-900 mb-4">Where to Stay</h3>
                <div className="space-y-4">
                    {itinerary.accommodations.map((hotel, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
                           <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-900 group-hover:text-jungle-600 transition">{hotel.name}</h4>
                                <span className="text-xs bg-jungle-100 text-jungle-700 px-2 py-1 rounded-md font-bold">{hotel.estimatedPrice}</span>
                           </div>
                           <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{hotel.area}</p>
                           <p className="text-sm text-gray-600">{hotel.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Packing Tips */}
            <div className="bg-sand-200 p-6 rounded-2xl shadow-inner">
                <h3 className="text-xl font-serif text-sand-800 mb-4">Packing Essentials</h3>
                <ul className="space-y-3">
                    {itinerary.packingTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-sand-800/80">
                            <span className="text-jungle-500 mt-0.5">✓</span>
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>

            <button 
                onClick={onReset}
                className="w-full py-4 text-center text-gray-500 font-bold hover:text-jungle-600 border-2 border-dashed border-gray-300 rounded-2xl hover:border-jungle-400 transition"
            >
                Start Over
            </button>
        </div>
      </div>
    </div>
  );
};