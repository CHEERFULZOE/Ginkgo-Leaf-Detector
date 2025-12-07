
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ViewingStatus, GinkgoAnalysis } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      enum: [ViewingStatus.EARLY, ViewingStatus.SUITABLE, ViewingStatus.BEST, ViewingStatus.UNKNOWN],
      description: "The viewing suitability based on leaf color. '较适宜观赏' for mostly green (>50%). '适宜观赏' for mixed. '最佳观赏' for mostly golden.",
    },
    colorDescription: {
      type: Type.STRING,
      description: "A short, poetic description of the leaf colors (in Chinese).",
    },
    percentageYellow: {
      type: Type.NUMBER,
      description: "Estimated percentage of the leaves that have turned yellow (0-100).",
    },
    scientificAssessment: {
      type: Type.STRING,
      description: "Scientific advice based on leaf yellowing percentage and phenology stage. Mention light conditions if applicable. (in Chinese).",
    },
    prediction: {
      type: Type.STRING,
      description: "Prediction on when the 'Best' viewing period will arrive or how long it will last. E.g., '预计5-7天后进入盛黄期'. (in Chinese).",
    },
  },
  required: ["status", "colorDescription", "percentageYellow", "scientificAssessment", "prediction"],
};

export const analyzeGinkgoImage = async (base64Image: string): Promise<GinkgoAnalysis> => {
  try {
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const base64Data = base64Image.split(',')[1] || base64Image;

    const model = "gemini-2.5-flash"; // Efficient for vision + reasoning

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG/PNG, API is flexible
              data: base64Data,
            },
          },
          {
            text: `你是一个专业的植物物候学家和自然景观摄影师。请分析这张图片中的银杏叶。
            
            任务：
            1. 识别图片中银杏叶的主要颜色。
            2. 根据颜色判断观赏时期：
               - "${ViewingStatus.EARLY}"：当叶片大部分是绿色，或者绿色区域多于黄色区域时（绿色占比 > 50%）。此时处于变色初期。
               - "${ViewingStatus.SUITABLE}"：当叶片绿黄相间（约各占一半），或者是整体呈现浅黄色但未达到金黄时。此时处于变色中期。
               - "${ViewingStatus.BEST}"：当叶片大部分呈现浓郁、鲜艳的金黄色，且几乎没有绿色时。此时为最佳观赏期。
               - "${ViewingStatus.UNKNOWN}"：如果图片不是银杏叶或无法判断。
            3. 估算叶片变黄的百分比 (percentageYellow)。
            4. 提供科学评估 (scientificAssessment)：结合黄化程度，分析当前的物候阶段，给出具体的观赏或拍摄建议（例如光线角度、背景搭配）。
            5. 提供预测 (prediction)：基于当前状态，预测距离最佳观赏期还有多少天，或者最佳观赏期还能持续多久。
            
            注意：对于"较适宜观赏"的判断标准要严格：只要绿色占比明显（超过50%），就应归为此类。
            
            请以JSON格式返回结果。`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response text from Gemini");
    }

    const data = JSON.parse(jsonText);
    return data as GinkgoAnalysis;

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};
