
import { GoogleGenAI, Type } from "@google/genai";

const BASE44_API_URL = "https://app.base44.com/api/apps/695125bfd9bb27149914a2b6/entities/Simulation";
const BASE44_API_KEY = "addf17bdd07b4c36a46fcd7840bbf9c8";

export const fetchSimulationRecords = async () => {
  try {
    const response = await fetch(BASE44_API_URL, {
      headers: {
        'api_key': BASE44_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error("Failed to fetch simulations");
    return await response.json();
  } catch (error) {
    console.error("Error fetching simulation records:", error);
    return [];
  }
};

export const saveSimulationRecord = async (record: any) => {
  try {
    const response = await fetch(BASE44_API_URL, {
      method: 'POST',
      headers: {
        'api_key': BASE44_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(record)
    });
    if (!response.ok) throw new Error("Failed to save simulation");
    return await response.json();
  } catch (error) {
    console.error("Error saving simulation record:", error);
    throw error;
  }
};

export const analyzeLandImage = async (base64Image: string, size: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze this image of agricultural land for a ${size} acre plot. 
    Visually assess the soil type, color, moisture appearance, terrain, and existing vegetation. 
    Provide a detailed soil health assessment and suggest the best crops for this specific visible terrain.
    Output must be in JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1],
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          soilAnalysis: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              ph: { type: Type.NUMBER },
              organicMatter: { type: Type.STRING },
              healthScore: { type: Type.INTEGER },
              visualObservations: { type: Type.STRING },
              nutrients: {
                type: Type.OBJECT,
                properties: {
                  nitrogen: { type: Type.STRING },
                  phosphorus: { type: Type.STRING },
                  potassium: { type: Type.STRING }
                },
                required: ["nitrogen", "phosphorus", "potassium"]
              }
            },
            required: ["type", "ph", "organicMatter", "healthScore", "visualObservations", "nutrients"]
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                crop: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                expectedYield: { type: Type.STRING },
                estimatedProfit: { type: Type.NUMBER },
                fertilizer: { type: Type.STRING },
                growingSeason: { type: Type.STRING },
                simPrompt: { type: Type.STRING, description: "A cinematic prompt for a growth time-lapse starting from the current land image" }
              },
              required: ["crop", "confidence", "expectedYield", "estimatedProfit", "fertilizer", "growingSeason", "simPrompt"]
            }
          }
        },
        required: ["soilAnalysis", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getMarketPrices = async (crops: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide current market prices and trends for these crops: ${crops.join(", ")}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            crop: { type: Type.STRING },
            currentPrice: { type: Type.NUMBER },
            trend: { type: Type.STRING, enum: ["up", "down", "stable"] },
            history: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  price: { type: Type.NUMBER }
                },
                required: ["date", "price"]
              }
            }
          },
          required: ["crop", "currentPrice", "trend", "history"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const runSimulation = async (crop: string, strategy: string, acres: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Simulate a full 6-month growing season for ${acres} acres of ${crop} using a '${strategy}' strategy.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scenarioName: { type: Type.STRING },
          crop: { type: Type.STRING },
          strategy: { type: Type.STRING },
          yieldData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.STRING },
                yield: { type: Type.NUMBER },
                cost: { type: Type.NUMBER }
              },
              required: ["month", "yield", "cost"]
            }
          },
          estimatedTotalYield: { type: Type.STRING },
          totalProfit: { type: Type.NUMBER },
          roi: { type: Type.NUMBER }
        },
        required: ["scenarioName", "crop", "strategy", "yieldData", "estimatedTotalYield", "totalProfit", "roi"]
      }
    }
  });

  return JSON.parse(response.text);
};
