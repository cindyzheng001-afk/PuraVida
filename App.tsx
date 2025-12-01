import React, { useState } from 'react';
import { Header } from './components/Header';
import { PlannerForm } from './components/PlannerForm';
import { ItineraryResult } from './components/ItineraryResult';
import { TravelItinerary } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);

  const handlePlanGenerated = (data: TravelItinerary) => {
    setItinerary(data);
    setLoading(false);
  };

  const reset = () => {
    setItinerary(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-sand-100 relative overflow-x-hidden selection:bg-jungle-200">
      <Header />
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-jungle-200 rounded-full blur-[120px] opacity-40 translate-x-1/3 -translate-y-1/3"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-100 rounded-full blur-[150px] opacity-60 -translate-x-1/3 translate-y-1/4"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 pt-24 pb-12 min-h-screen flex flex-col items-center justify-center">
        
        {!itinerary && !loading && (
          <div className="w-full flex flex-col items-center animate-fade-in-up">
            <div className="text-center mb-10 max-w-2xl">
              <span className="text-jungle-600 font-bold tracking-[0.2em] text-xs uppercase mb-3 block">Costa Rica | March 2027</span>
              <h1 className="text-4xl md:text-6xl font-serif text-jungle-900 mb-6 leading-tight">
                Design Your Perfect<br/> 
                <span className="italic text-jungle-500">Pre-Wedding</span> Escape
              </h1>
              <p className="text-gray-600 text-lg">
                Join us in paradise. Whether you're here to surf, relax, or explore the rainforest, let us create a custom itinerary for your trip surrounding the big day.
              </p>
            </div>
            <PlannerForm onPlanGenerated={handlePlanGenerated} setIsLoading={setLoading} />
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center text-center animate-pulse space-y-6">
            <div className="w-24 h-24 rounded-full border-4 border-jungle-100 border-t-jungle-500 animate-spin"></div>
            <h2 className="text-2xl font-serif text-jungle-800">Consulting the Concierge...</h2>
            <p className="text-gray-500">Checking availability for March 2027</p>
          </div>
        )}

        {itinerary && !loading && (
          <ItineraryResult itinerary={itinerary} onReset={reset} />
        )}
        
      </main>

      {/* Simple Footer */}
      <footer className="w-full text-center py-6 text-gray-400 text-xs relative z-10">
        <p>&copy; 2027 Wedding Planner App. Pura Vida.</p>
      </footer>
    </div>
  );
};

export default App;