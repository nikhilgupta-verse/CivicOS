import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware (limit 10mb for photo uploads)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Server-side Gemini client utility
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Fallback heuristic analyzer in case AI API key is not configured or network error occurs
function fallbackAnalyzeIssue(description: string, imageBase64?: string, language: string = "English") {
  const lower = (description || "").toLowerCase();
  
  let issue_type = "Pothole";
  let department = "Roads Department";
  let baseSeverity: "Low" | "Medium" | "High" | "Critical" = "Medium";
  let severityScore = 20; // max 40
  let proximityScore = 10; // max 20
  let trafficScore = 10; // max 20
  let populationScore = 10; // max 20
  const riskFactors: string[] = [];

  // Issue type detection
  if (lower.includes("garbage") || lower.includes("trash") || lower.includes("waste") || lower.includes("dump") || lower.includes("कूड़ा") || lower.includes("ਕੂੜਾ")) {
    issue_type = "Garbage & Waste";
    department = "Sanitation Department";
    riskFactors.push("Vector-borne disease risk and foul odor");
  } else if (lower.includes("light") || lower.includes("lamp") || lower.includes("dark") || lower.includes("wire") || lower.includes("बिजली") || lower.includes("ਬੱਤੀ")) {
    issue_type = "Broken Streetlight";
    department = "Electrical Department";
    riskFactors.push("Pedestrian security hazard during night hours");
  } else if (lower.includes("leak") || lower.includes("pipe") || lower.includes("water") || lower.includes("पानी") || lower.includes("ਪਾਣੀ")) {
    issue_type = "Water Leakage";
    department = "Water Supply Department";
    riskFactors.push("Precious potable water loss and road erosion");
  } else if (lower.includes("drain") || lower.includes("sewer") || lower.includes("block") || lower.includes("overflow") || lower.includes("नाली") || lower.includes("ਸੀਵਰੇਜ")) {
    issue_type = "Blocked Drain";
    department = "Drainage Department";
    riskFactors.push("Waterlogging and structural flooding risk");
  } else if (lower.includes("traffic") || lower.includes("signal") || lower.includes("red light") || lower.includes("ट्रैफिक") || lower.includes("ਸਿਗਨਲ")) {
    issue_type = "Damaged Traffic Signal";
    department = "Traffic Department";
    riskFactors.push("High collision risk at active intersection");
    baseSeverity = "High";
    severityScore = 30;
  } else if (lower.includes("pothole") || lower.includes("road") || lower.includes("crater") || lower.includes("गड्ढा") || lower.includes("ਖੱਡਾ")) {
    issue_type = "Pothole";
    department = "Roads Department";
    riskFactors.push("Two-wheeler skidding hazard and axle damage");
  } else {
    issue_type = "Damaged Public Infrastructure";
    department = "Public Works";
    riskFactors.push("Public accessibility inconvenience");
  }

  // Keyword heuristic boosts
  if (lower.includes("hospital") || lower.includes("ambulance") || lower.includes("school") || lower.includes("college") || lower.includes("clinic") || lower.includes("अस्पताल") || lower.includes("स्कूल")) {
    proximityScore = 20;
    riskFactors.push("Critical proximity to healthcare/educational facility");
  }

  if (lower.includes("highway") || lower.includes("main road") || lower.includes("intersection") || lower.includes("arterial") || lower.includes("चौराहा") || lower.includes("ਮੁੱਖ ਸੜਕ")) {
    trafficScore = 20;
    riskFactors.push("Heavy transit volume corridor");
  }

  if (lower.includes("urgent") || lower.includes("deep") || lower.includes("broken") || lower.includes("flood") || lower.includes("accident") || lower.includes("hazard") || lower.includes("danger") || lower.includes("खतरा")) {
    baseSeverity = "Critical";
    severityScore = 40;
    populationScore = 18;
  } else if (severityScore === 20) {
    severityScore = 25;
  }

  const totalScore = Math.min(100, Math.max(15, severityScore + proximityScore + trafficScore + populationScore));
  let priorityBucket: "Critical" | "High" | "Medium" | "Low" = "Medium";
  if (totalScore >= 80) priorityBucket = "Critical";
  else if (totalScore >= 60) priorityBucket = "High";
  else if (totalScore >= 35) priorityBucket = "Medium";
  else priorityBucket = "Low";

  return {
    issue_type,
    severity: baseSeverity,
    short_description: description.trim() || `${issue_type} reported at location requiring municipal inspection.`,
    suggested_department: department,
    risk_factors: riskFactors.length > 0 ? riskFactors : ["Requires on-site inspection by municipal crew"],
    detected_language: language,
    priority_score: totalScore,
    priority_bucket: priorityBucket,
    priority_breakdown: {
      severity_score: severityScore,
      proximity_score: proximityScore,
      traffic_score: trafficScore,
      population_impact_score: populationScore,
      total: totalScore,
      explanation: `Calculated from ${baseSeverity} hazard severity (${severityScore}/40), proximity factors (${proximityScore}/20), traffic corridor density (${trafficScore}/20), and public population impact (${populationScore}/20).`,
    },
    estimated_resolution_time_hours: priorityBucket === "Critical" ? 6 : priorityBucket === "High" ? 18 : priorityBucket === "Medium" ? 48 : 96,
    suggested_action: `Dispatch ${department} field crew for immediate assessment and remediation.`,
  };
}

// API Health Check
app.get("/api/health", (_req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  res.json({ status: "ok", geminiConfigured: hasKey });
});

// API Route: Multimodal Civic Issue Analysis
app.post("/api/analyze-issue", async (req, res) => {
  try {
    const { description = "", imageBase64 = "", language = "English", locationText = "" } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Return structured fallback analysis gracefully
      const fallbackResult = fallbackAnalyzeIssue(description, imageBase64, language);
      return res.json({
        success: true,
        data: fallbackResult,
        source: "rule-based-analyzer",
      });
    }

    // Build multimodal prompt
    const promptText = `
You are the AI Engine of "CivicOS — AI Operating System for Civic Governance".
A citizen has submitted a civic complaint in language: "${language}".
Citizen description: "${description}"
Location details: "${locationText || "Citizen GPS coordinates / city area"}"

TASK:
1. Examine the attached photo (if present) and the citizen text description.
2. Accurately classify the issue into one of these EXACT issue types:
   - "Pothole"
   - "Garbage & Waste"
   - "Broken Streetlight"
   - "Water Leakage"
   - "Blocked Drain"
   - "Damaged Traffic Signal"
   - "Damaged Public Infrastructure"
   - "Other"

3. Route to the correct municipal department:
   - "Roads Department" (for potholes, damaged pavement, asphalt craters)
   - "Sanitation Department" (for garbage dumps, litter, uncollected waste, carcasses)
   - "Electrical Department" (for streetlights, loose cables, transformers, power poles)
   - "Water Supply Department" (for pipe bursts, potable water leakages, dry taps)
   - "Drainage Department" (for choked storm drains, flooded sewers, overflowing manholes)
   - "Traffic Department" (for broken traffic signals, blinkers, signage, lane dividers)
   - "Public Works" (for general municipal structures, bridges, footpaths, parks)

4. Determine Severity:
   - "Critical": Imminent danger to human life, deep open manhole, high-speed intersection signal failure, massive road sinkhole, high voltage sparking.
   - "High": Major road pothole, sewer overflowing near residential entrance, dark busy road at night, contaminated water leak.
   - "Medium": Moderate garbage pile, standard pothole on neighborhood street, leaking valve, broken park bench.
   - "Low": Minor cosmetic pavement crack, small litter spot, slow drip.

5. Compute explainable Priority Score (0 to 100) using this exact heuristic formula:
   - Severity Score (0 - 40 points): Critical = 36-40, High = 26-35, Medium = 16-25, Low = 5-15.
   - Proximity Score (0 - 20 points): Boost up to 20 points if near hospital, school, kindergarten, nursing home, or crowded transit hub.
   - Traffic / Road Type Score (0 - 20 points): Boost up to 20 points if on major arterial highway, ring road, commercial market, or active junction.
   - Population Impact Score (0 - 20 points): Boost up to 20 points if affects hundreds of daily commuters, dense colony, or disables public access.
   - Total Score = Sum of all 4 components (clamped 0-100).
   - Priority Bucket: "Critical" (80+), "High" (60-79), "Medium" (35-59), "Low" (<35).

6. Provide clear, objective Risk Factors array (e.g., "Risk of two-wheeler skid during rain", "Vector breeding hazard").
7. Write a crisp, professional English short description summarizing the problem, plus note the detected language.
8. Suggest immediate municipal crew action and realistic SLA resolution time in hours.
`;

    const contents: any = [];

    // If image provided, add inlineData part
    if (imageBase64 && typeof imageBase64 === "string" && imageBase64.includes("base64,")) {
      const parts = imageBase64.split("base64,");
      const mimeMatch = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const base64Data = parts[1];

      contents.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }

    contents.push({
      text: promptText,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: {
        parts: contents,
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issue_type: {
              type: Type.STRING,
              description: "Classified issue type (e.g. Pothole, Garbage & Waste, Broken Streetlight, Water Leakage, Blocked Drain, Damaged Traffic Signal, Damaged Public Infrastructure, Other)",
            },
            severity: {
              type: Type.STRING,
              description: "Severity level: Low, Medium, High, or Critical",
            },
            short_description: {
              type: Type.STRING,
              description: "Clear and concise summary of the civic problem in English",
            },
            suggested_department: {
              type: Type.STRING,
              description: "Designated municipal department to resolve this issue",
            },
            risk_factors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of specific public safety, health, or environmental risks",
            },
            detected_language: {
              type: Type.STRING,
              description: "Language detected from citizen input",
            },
            priority_score: {
              type: Type.INTEGER,
              description: "Computed 0-100 priority index",
            },
            priority_bucket: {
              type: Type.STRING,
              description: "Critical, High, Medium, or Low",
            },
            priority_breakdown: {
              type: Type.OBJECT,
              properties: {
                severity_score: { type: Type.INTEGER, description: "Points out of 40 for raw hazard severity" },
                proximity_score: { type: Type.INTEGER, description: "Points out of 20 for proximity to hospital/school/transit" },
                traffic_score: { type: Type.INTEGER, description: "Points out of 20 for road/traffic density" },
                population_impact_score: { type: Type.INTEGER, description: "Points out of 20 for estimated citizens affected" },
                total: { type: Type.INTEGER, description: "Total score (0-100)" },
                explanation: { type: Type.STRING, description: "Clear explanation of how the score was calculated" },
              },
              required: ["severity_score", "proximity_score", "traffic_score", "population_impact_score", "total", "explanation"],
            },
            estimated_resolution_time_hours: {
              type: Type.INTEGER,
              description: "Estimated resolution SLA in hours",
            },
            suggested_action: {
              type: Type.STRING,
              description: "Recommended immediate dispatch instruction for field crew",
            },
          },
          required: [
            "issue_type",
            "severity",
            "short_description",
            "suggested_department",
            "risk_factors",
            "priority_score",
            "priority_bucket",
            "priority_breakdown",
            "estimated_resolution_time_hours",
            "suggested_action",
          ],
        },
      },
    });

    const textOutput = response.text || "{}";
    const parsedData = JSON.parse(textOutput);

    return res.json({
      success: true,
      data: parsedData,
      source: "gemini-3.7-flash",
    });
  } catch (error: any) {
    console.error("Gemini CivicOS Analysis error:", error);
    // Fallback to rule-based analysis so user is never blocked
    const fallbackResult = fallbackAnalyzeIssue(
      req.body.description || "",
      req.body.imageBase64,
      req.body.language || "English"
    );
    return res.json({
      success: true,
      data: fallbackResult,
      source: "fallback-resilient-mode",
      note: "Analyzed with CivicOS resilient local engine",
    });
  }
});

async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CivicOS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
