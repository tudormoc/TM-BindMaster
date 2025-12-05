import { GoogleGenAI } from "@google/genai";
import { CoverDimensions, CalculatedSpecs } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInDesignScript = async (dims: CoverDimensions, specs: CalculatedSpecs): Promise<string> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Create a valid Adobe InDesign (.jsx) ExtendScript to create a new document for a hardcover book cover wrap.
    
    Parameters:
    - Unit: ${dims.unit}
    - Document Width (Trim): ${specs.totalWidth}
    - Document Height (Trim): ${specs.totalHeight}
    - Margins (Turn-in): ${dims.turnIn} (Top, Bottom, Left, Right)
    - Bleed: ${dims.bleed} (Top, Bottom, Left, Right)
    
    The script should:
    1. Create a new document with the specified width, height, and bleed settings.
    2. Set view preferences to ${dims.unit}.
    3. Add vertical guides at these X coordinates to mark the spine and hinges:
       - ${dims.turnIn + dims.boardWidth} (End of Back Cover)
       - ${dims.turnIn + dims.boardWidth + dims.hingeGap} (Start of Spine)
       - ${dims.turnIn + dims.boardWidth + dims.hingeGap + dims.spineWidth} (End of Spine)
       - ${dims.turnIn + dims.boardWidth + dims.hingeGap + dims.spineWidth + dims.hingeGap} (Start of Front Cover)
    4. Add horizontal guides for the turn-ins:
       - ${dims.turnIn}
       - ${specs.totalHeight - dims.turnIn}
    5. Name the layer "Dieline".
    6. Draw a rectangle representing the Spine and the two Boards on the Dieline layer (no fill, magenta stroke).
    7. Alert the user that the setup is complete.

    Output ONLY the raw code string, no markdown code blocks, no explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    const text = response.text;
    return text ? text.replace(/```javascript|```/g, "").trim() : "// Error: No response text generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "// Error generating script. Please try again.";
  }
};

export const askPrintExpert = async (question: string, context: string): Promise<string> => {
  const model = "gemini-2.5-flash";
  const systemInstruction = `You are a master bookbinder and prepress engineer. 
  Answer questions about paper grain, glue types (PVA vs Animal), cover materials, and InDesign setup. 
  Keep answers technical, concise, and professional. 
  Context: ${context}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: question,
      config: {
        systemInstruction: systemInstruction
      }
    });
    return response.text || "I apologize, I could not generate a response at this time.";
  } catch (error) {
    return "I am currently offline. Please check your connection.";
  }
};