
export interface PlotInfo {
  id: string;
  name: string;
  location: string;
  size: number; // in acres
  soilType?: string;
  phLevel?: number;
  nutrients?: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
  };
}

export interface CropRecommendation {
  crop: string;
  confidence: number;
  expectedYield: string;
  estimatedProfit: number;
  fertilizer: string;
  growingSeason: string;
}

export interface SimulationResult {
  scenarioName: string;
  crop: string;
  strategy: string;
  yieldData: { month: string; value: number }[];
  totalProfit: number;
  roi: number;
}

export interface MarketInsight {
  crop: string;
  currentPrice: number;
  trend: 'up' | 'down' | 'stable';
  history: { date: string; price: number }[];
}

// Global augmentation for AIStudio properties on the Window object removed to resolve duplication errors.
// These methods are already provided in the execution context.
