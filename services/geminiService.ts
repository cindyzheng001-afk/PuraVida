import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserPreferences, TravelItinerary } from "../types";

// Helper to ensure API Key exists
const getApiKey = (): string => {
  let key = '';

  // 1. Try Vite environment (Standard for modern React)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    key = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY || '';
  }

  // 2. Try Node/CRA environment
  if (!key && typeof process !== 'undefined' && process.env) {
    key = process.env.REACT_APP_API_KEY || process.env.API_KEY || '';
  }

  // Diagnostic logging (Masked)
  console.log("Environment Diagnostic:", {
    hasImportMeta: typeof import.meta !== 'undefined',
    // @ts-ignore
    hasViteEnv: typeof import.meta !== 'undefined' && !!import.meta.env,
    hasProcessEnv: typeof process !== 'undefined' && !!process.env,
    keyFound: !!key,
    keyPrefix: key ? key.substring(0, 4) + '...' : 'NONE'
  });

  if (!key) {
    console.error("API Key missing. Tried: VITE_API_KEY, REACT_APP_API_KEY, API_KEY.");
    throw new Error("Missing API Key. Please add VITE_API_KEY to your Netlify Environment Variables.");
  }
  return key;
};

// Define the schema for the itinerary response
const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    itineraryName: { type: Type.STRING, description: "A creative name for the trip" },
    summary: { type: Type.STRING, description: "A 2-sentence summary of the vibe." },
    weddingLogistics: { type: Type.STRING, description: "Detailed advice on how to travel between the recommended trip location and Manuel Antonio (Wedding Location)." },
    weatherNote: { type: Type.STRING, description: "What to expect weather-wise in March in this specific area." },
    accommodations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          area: { type: Type.STRING },
          description: { type: Type.STRING },
          estimatedPrice: { type: Type.STRING },
        },
        required: ["name", "area", "description", "estimatedPrice"]
      }
    },
    schedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          morningActivity: { type: Type.STRING },
          afternoonActivity: { type: Type.STRING },
          eveningActivity: { type: Type.STRING },
          location: { type: Type.STRING },
        },
        required: ["day", "title", "morningActivity", "afternoonActivity", "eveningActivity", "location"]
      }
    },
    packingTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["itineraryName", "summary", "weddingLogistics", "weatherNote", "accommodations", "schedule", "packingTips"]
};

export const generateItinerary = async (prefs: UserPreferences): Promise<TravelItinerary> => {
  let ai;
  try {
    const key = getApiKey();
    ai = new GoogleGenAI({ apiKey: key });
  } catch (e: any) {
    throw e; // Re-throw key errors immediately
  }
  
  const WEDDING_LOCATION = "Manuel Antonio / Quepos";
  const PREFERRED_REGIONS = prefs.preferredRegions.includes('AI_DECIDE') 
    ? 'Decide best region based on activities' 
    : prefs.preferredRegions.join(", ");
  
  const directionInstructions = prefs.travelDirection === 'Pre-Wedding'
    ? `The guest is traveling BEFORE the wedding. The itinerary must END in or very near ${WEDDING_LOCATION} on the final day so they are ready for the wedding events. They should progressively move towards Manuel Antonio.`
    : `The guest is traveling AFTER the wedding. The itinerary must START from ${WEDDING_LOCATION} on Day 1 (leaving the wedding) and move towards their next destination or airport (SJO).`;

  const prompt = `
    Act as a luxury travel concierge for a wedding in Costa Rica.
    The wedding is strictly located in: ${WEDDING_LOCATION}.
    The wedding date is in March 2027.
    
    User Profile:
    - Guest Name: ${prefs.guestName}
    - Trip Type: ${prefs.travelDirection}
    - Trip Duration: ${prefs.tripDuration} days (excluding wedding days)
    - Vibes Desired: ${prefs.vibe.join(", ")}
    - Specific Activities Desired: ${prefs.activities.join(", ")}
    - Budget: ${prefs.budgetLevel}
    - Group Type: ${prefs.travelingParty}
    - Preferred Regions to Visit: ${PREFERRED_REGIONS}
    
    CRITICAL LOGISTICS:
    ${directionInstructions}
    
    Task:
    Create a detailed travel itinerary. 
    
    1. REGION SELECTION & ROUTING:
       - **IF User specified multiple regions (${PREFERRED_REGIONS}):** YOU MUST create a logical route connecting these regions. 
         - Ensure the travel times between them are accounted for in the schedule.
         - Ensure the order makes sense relative to ${WEDDING_LOCATION} (e.g. if Pre-Wedding: La Fortuna -> Monteverde -> Manuel Antonio).
       - **IF User specified a single region:** Focus the trip there.
       - **IF User selected 'AI_DECIDE':**
          - **IF 'Scuba Diving', 'Snorkeling', 'Surfing' or 'Whale Watching' are selected:** DO NOT SUGGEST LA FORTUNA/ARENAL. It is landlocked. Suggest Osa Peninsula (Drake Bay/Uvita) for nature/whales, Guanacaste for diving/resorts, or Santa Teresa/Nosara for surf/vibes.
          - **IF 'Volcano' or 'Hot Springs' are selected:** Suggest La Fortuna / Arenal.
          - **IF 'Cloud Forest' is selected:** Suggest Monteverde.
          - **IF 'Caribbean Culture' is selected:** Suggest Puerto Viejo (note the long drive to Manuel Antonio).
          - **IF NO SPECIFIC LOCATION ACTIVITY IS SELECTED:** Suggest Uvita/Dominical (nearby Manuel Antonio) for a seamless trip, OR Monteverde for a contrast to the beach wedding.
       
    2. AVOID DEFAULTING TO LA FORTUNA: Unless the user specifically asked for it (by selecting the region or Volcano/Hot Spring activities), suggest other amazing parts of Costa Rica.
    
    3. LOGISTICS: Ensure the travel time between the selected region and ${WEDDING_LOCATION} is realistic. Mention drive times or domestic flights if needed.
    4. WEATHER: March is dry season and hot.
    
    Output strictly valid JSON matching the schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as TravelItinerary;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Pass through specific key errors
    if (error.message.includes("API Key") || error.message.includes("VITE_API_KEY")) {
      throw error;
    }
    throw new Error(`AI Generation failed: ${error.message || 'Unknown error'}`);
  }
};

export const reviseItinerary = async (
  currentItinerary: TravelItinerary,
  userFeedback: string,
  originalPrefs: UserPreferences
): Promise<TravelItinerary> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  const prompt = `
    Act as a luxury travel concierge. You previously generated a travel itinerary for a wedding guest in Costa Rica.
    The user wants to make changes to the existing itinerary.

    ORIGINAL PREFERENCES:
    - Guest: ${originalPrefs.guestName}
    - Region: ${originalPrefs.preferredRegions.join(", ")}
    - Activities: ${originalPrefs.activities.join(", ")}
    - Vibe: ${originalPrefs.vibe.join(", ")}
    - Budget: ${originalPrefs.budgetLevel}

    CURRENT ITINERARY SUMMARY:
    "${currentItinerary.summary}"
    (Currently visiting: ${currentItinerary.accommodations.map(a => a.area).join(", ")})

    USER REQUEST FOR CHANGES:
    "${userFeedback}"

    TASK:
    Regenerate the ENTIRE itinerary JSON to address the user's feedback.
    - If they ask to change location, change the schedule and accommodations accordingly.
    - If they ask for more/less activity, adjust the schedule.
    - Keep the wedding logistics accurate (Manuel Antonio) based on the original direction (${originalPrefs.travelDirection}).
    
    Output strictly valid JSON matching the itinerary schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as TravelItinerary;
  } catch (error) {
    console.error("Gemini API Error during revision:", error);
    throw error;
  }
};