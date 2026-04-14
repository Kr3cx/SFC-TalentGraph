import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiService = {
  async optimizeCV(profile: any) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Optimize this professional profile for a modern tech role. Provide specific suggestions and metrics.
      Profile: ${JSON.stringify(profile)}`,
    });
    return response.text;
  },

  async generateRoadmap(targetRole: string, currentSkills: string[]) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a 4-step career roadmap to become a ${targetRole} starting from these skills: ${currentSkills.join(", ")}.
      Return the roadmap as a JSON array of milestones with title, description, and estimated time.`,
    });
    return response.text;
  },

  async analyzeCareerGap(currentProfile: any, targetJob: any) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the gap between this user profile and the target job description.
      Profile: ${JSON.stringify(currentProfile)}
      Job: ${JSON.stringify(targetJob)}
      Identify missing skills and provide a readiness percentage.`,
    });
    return response.text;
  }
};
