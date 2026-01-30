
import { GoogleGenAI } from "@google/genai";
import { SetupRequest, SetupResponse } from "../types";

export const generateSetup = async (request: SetupRequest): Promise<SetupResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const components = [];
  if (request.includePC) components.push("CORE PC");
  if (request.includeMonitor) components.push("MONITOR");
  if (request.includePeripherals) components.push("PERIPHERALS");

  const langInstruction = request.language === 'ar' 
    ? "VERY IMPORTANT: Your entire response MUST be in Arabic language. Tables, headers, and descriptions should be in Arabic. Maintain English for brand/model names if necessary for clarity." 
    : "Your entire response must be in English.";

  const prompt = `
    Act as a hardware procurement specialist. Generate a TECHNICAL SPECIFICATION for:
    Budget: $${request.budget} | Purpose: ${request.purpose} | Preferences: ${request.preferences}
    Include Sections: ${components.join(', ')}

    ${langInstruction}

    CRITICAL STRUCTURE:
    - NO INTRODUCTIONS. START DIRECTLY WITH DATA.
    - Each section must be a MARKDOWN TABLE.
    - COLUMNS: [Part, Model, Price, Store Link].
    - EVERY ROW MUST HAVE A LINK.
    - For PC Build: Include only Case, Mobo, CPU, GPU, RAM, PSU, Storage.
    - For Monitor: New separate table.
    - For Peripherals: New separate table.
    
    PERFORMANCE MATRIX:
    - Include a section titled "## Estimated Performance".
    - Create a table: [Game, Resolution, Settings, Est. FPS, Verdict].
    - Use 1080p or 720p appropriate for the budget.

    TECHNICAL VALIDATION:
    - Verify PSU Wattage vs Component Draw.
    - Verify CPU Socket vs Motherboard Chipset.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 1500 }
      },
    });

    const text = response.text || "No data returned.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        url: chunk.web.uri,
      }));

    return { text, sources };
  } catch (error) {
  console.error("Gemini Error:", error);
  throw new Error("Market data unavailable. Please verify budget and try again.");
}


};
