import Anthropic from "@anthropic-ai/sdk";
import { Route, WeatherData } from "../types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const getRouteExplanation = async (
  activeRoute: Route,
  alternativeRoute: Route | null,
  weather: WeatherData,
  isEmergency: boolean,
): Promise<string> => {
  try {
    const model = "claude-3-5-sonnet-20241022";
    const prompt = `
      Compare these two routes in North-East India:

      ACTIVE ROUTE (${activeRoute.id.toUpperCase()}):
      - Path: ${activeRoute.path.map((p) => p.name).join(" -> ")}
      - Distance: ${activeRoute.totalDistance} km
      - Safety Index: ${(activeRoute.avgSafetyScore * 100).toFixed(0)}%

      ALTERNATIVE ROUTE (${alternativeRoute?.id.toUpperCase() || "N/A"}):
      - Distance: ${alternativeRoute?.totalDistance || "N/A"} km
      - Safety Index: ${alternativeRoute ? (alternativeRoute.avgSafetyScore * 100).toFixed(0) : "N/A"}%

      Conditions:
      - Rainfall: ${weather.rainfallMm}mm
      - Emergency: ${isEmergency ? "YES" : "NO"}

      Instructions:
      1. Explain why the ${activeRoute.id} route was selected as the primary focus.
      2. Briefly contrast it with the other option (e.g. "Saves 20km but crosses a high-risk slope").
      3. Professional, actionable tone. (2-3 sentences max).
    `;

    const response = await client.messages.create({
      model,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    return response.content[0].type === "text"
      ? response.content[0].text
      : "No explanation available.";
  } catch (error) {
    return `Selected ${activeRoute.id} route for optimal ${activeRoute.id === "safest" ? "terrain stability" : "transit speed"}.`;
  }
};
