
export enum ViewingStatus {
  EARLY = '较适宜观赏',
  SUITABLE = '适宜观赏',
  BEST = '最佳观赏',
  UNKNOWN = '无法识别'
}

export interface GinkgoAnalysis {
  status: ViewingStatus;
  colorDescription: string;
  percentageYellow: number;
  scientificAssessment: string; // Scientific analysis of the phenology
  prediction: string; // Prediction for peak viewing time
}

export interface AnalysisResponse {
  analysis: GinkgoAnalysis;
}
