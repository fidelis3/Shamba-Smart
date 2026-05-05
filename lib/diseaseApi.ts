import { DiagnosticReport, DiseaseResult } from "./types";

const API_URL = "https://shambasmart-ai.onrender.com/detect_disease";

// ─── Advice lookup per disease ────────────────────────────────────────────────
const DISEASE_ADVICE: Record<string, string[]> = {
  Common_Rust: [
    "Check nearby farms to see how bad the rust is.",
    "Remove leaves with rust spots to slow the spread.",
    "Stop using sprinklers that wet the leaves from above.",
    "Spray fungicide (like azoxystrobin) right away.",
    "Next season, plant rust-resistant maize varieties.",
  ],
  Northern_Leaf_Blight: [
    "Spray fungicide (like mancozeb) immediately.",
    "Thin out dense plants so air can flow better.",
    "Remove infected leaves to reduce spread.",
    "After harvest, clear all dead plant parts.",
    "Next season plant resistant varieties and rotate crops.",
  ],
  Fall_Armyworm: [
    "Check plants early morning and evening for worms.",
    "If you find many worms, spray insecticide right away.",
    "Try neem spray for small infestations.",
    "Introduce natural enemies like wasps if possible.",
    "Tell your local agricultural officer if it's very bad.",
  ],
  Gray_Leaf_Spot: [
    "Spray fungicide immediately.",
    "Remove infected leaves, especially lower ones.",
    "Space plants well apart for good air flow.",
    "Next season plant resistant varieties.",
    "Rotate your crops for at least 2 seasons.",
  ],
  Ear_Rot: [
    "Spray fungicide when plants are flowering and making ears.",
    "Make sure plants have good spacing for air flow.",
    "Harvest as soon as the corn is ready.",
    "Dry corn properly to below 14% moisture.",
    "Check corn for toxins before storage.",
    "Remove and burn any rotted ears.",
  ],
  Stem_Borer: [
    "Look for young worms in the stems.",
    "Spray insecticide on young worms.",
    "Plant companion crops like Desmodium around the field.",
    "Use Bt spray if you farm organically.",
    "Remove and burn all dead plant parts.",
  ],
  Grasshopper: [
    "Check for grasshoppers when they are young and small.",
    "Spray insecticide when they are small.",
    "Use bran mixed with insecticide for small areas.",
    "Mow field borders to remove tall grass where they breed.",
    "Encourage birds and parasitic flies.",
    "Talk to neighboring farmers to control together.",
  ],
  Leaf_Beetle: [
    "Check plants for beetles.",
    "If there are only a few, pick them by hand.",
    "Remove and burn heavily infected leaves.",
    "Spray insecticide if there are many beetles.",
    "Next season plant beetle-resistant varieties.",
    "Clear all dead plant parts after harvest.",
  ],
  Leaf_Blight: [
    "Spray fungicide as soon as you see symptoms.",
    "Improve drainage to keep leaves dry.",
    "Space plants apart for good air flow.",
    "Remove infected leaves and burn them away from the field.",
    "Rotate with different crops to break the disease cycle.",
  ],
  Leaf_Spot: [
    "Spray fungicide early in the season to prevent spots.",
    "Check plants regularly for brown spots.",
    "Before rain, spray again to prevent more spots.",
    "Remove leaves with many spots.",
    "Use disease-free seeds and rotate crops.",
  ],
  Streak_Virus: [
    "Plant virus-resistant maize varieties (this works best).",
    "Plant at a time when leafhoppers are not active.",
    "Spray to kill leafhoppers that spread the virus.",
    "Remove and destroy infected plants immediately.",
    "Don't plant near infected fields or grassy areas.",
  ],
  Healthy: [
    "Keep doing good farming practices.",
    "Check your plants every week for problems.",
    "Water and fertilize your crops properly.",
  ],
};

const DEFAULT_ADVICE = [
  "Consult a local agronomist for a tailored treatment plan.",
  "Monitor your crop closely over the next 7–14 days.",
  "Isolate visibly affected plants to prevent further spread.",
  "Keep field records to track disease progression.",
];

// ─── Prevention lookup per disease ─────────────────────────────────────────────
const DISEASE_PREVENTION: Record<string, string[]> = {
  Common_Rust: [
    "Use rust-resistant maize varieties.",
    "Rotate crops to break the rust cycle.",
    "Clean farm tools and equipment between fields.",
    "Avoid planting near previous rust-infected fields.",
  ],
  Northern_Leaf_Blight: [
    "Plant resistant or tolerant varieties.",
    "Rotate with non-host crops for 2+ seasons.",
    "Remove crop debris immediately after harvest.",
    "Space plants well to allow air circulation.",
  ],
  Fall_Armyworm: [
    "Scout crops regularly during season.",
    "Grow trap crops (like chickpea) around maize fields.",
    "Keep field edges clean of grasses.",
    "Grow diverse crops to support natural predators.",
  ],
  Gray_Leaf_Spot: [
    "Use resistant maize hybrids.",
    "Rotate crops for at least 2 seasons.",
    "Space plants properly for air circulation.",
    "Remove and destroy all infected crop debris.",
  ],
  Ear_Rot: [
    "Choose resistant or tolerant varieties.",
    "Plant at recommended spacing.",
    "Manage moisture with proper drainage.",
    "Rotate crops to reduce soil inoculum.",
  ],
  Stem_Borer: [
    "Plant resistant varieties where available.",
    "Rotate crops with non-host plants.",
    "Remove all crop residues from field.",
    "Plant trap crops (like Napier grass) around fields.",
  ],
  Grasshopper: [
    "Keep field borders clean and mowed.",
    "Maintain good field hygiene.",
    "Grow diverse crops to attract predators.",
    "Monitor fields regularly during risk periods.",
  ],
  Leaf_Beetle: [
    "Plant beetle-resistant varieties.",
    "Rotate with different crops.",
    "Clean field borders and remove weeds.",
    "Remove crop debris after harvest.",
  ],
  Leaf_Blight: [
    "Plant disease-resistant varieties.",
    "Improve field drainage to reduce wetness.",
    "Rotate with non-susceptible crops.",
    "Space plants well for air circulation.",
  ],
  Leaf_Spot: [
    "Use disease-free certified seeds.",
    "Rotate crops to reduce disease buildup.",
    "Space plants for good air flow.",
    "Avoid planting in disease hotspots from previous seasons.",
  ],
  Streak_Virus: [
    "Plant virus-resistant varieties (most effective).",
    "Control leafhopper populations with scout practices.",
    "Delay planting to avoid peak leafhopper activity.",
    "Keep fields free of grasses that harbor leafhoppers.",
  ],
  Healthy: [
    "Continue good farming practices.",
    "Use disease-resistant varieties.",
    "Maintain proper spacing and irrigation.",
    "Keep farm records to monitor trends.",
  ],
};

const DEFAULT_PREVENTION = [
  "Plant resistant varieties when available.",
  "Rotate crops with different plant families.",
  "Maintain good field hygiene.",
  "Scout fields regularly for early detection.",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** "Common_Rust" → "Common Rust" */
function formatName(raw: string): string {
  return raw.replace(/_/g, " ").trim();
}

/**
 * Confidence from the API is 0–100.
 * Maps to severity label.
 */
function toSeverity(pct: number): DiseaseResult["severity"] {
  if (pct >= 75) return "critical";
  if (pct >= 50) return "high";
  if (pct >= 25) return "medium";
  return "low";
}

function deriveUrgency(diseases: DiseaseResult[]): DiagnosticReport["urgency"] {
  if (diseases.some((d) => d.severity === "critical")) return "treat-immediately";
  const top = diseases[0];
  if (top && top.probability > 0.6 && top.severity !== "low") return "treat-soon";
  if (top && top.probability > 0.4 && top.severity === "medium") return "treat-soon";
  return "monitor";
}

// ─── Main function ────────────────────────────────────────────────────────────

/**
 * Sends the image file to the AI endpoint and returns a DiagnosticReport.
 *
 * Expected response shape:
 * {
 *   "prediction": "Common_Rust",
 *   "confidence": 100.0,
 *   "top_3": [
 *     { "disease": "Common_Rust",         "confidence": 100.0 },
 *     { "disease": "Northern_Leaf_Blight", "confidence": 0.0  },
 *     { "disease": "Fall_Armyworm",        "confidence": 0.0  }
 *   ]
 * }
 */
export async function detectDisease(file: File): Promise<DiagnosticReport> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(API_URL, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Disease API responded with ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  console.log("[detect_disease] raw response:", json);

  // Parse top_3 into DiseaseResult[]
  const top3: Array<{ disease: string; confidence: number }> =
    Array.isArray(json.top_3) ? json.top_3 : [];

  const diseases: DiseaseResult[] = top3.map((item) => {
    const pct = item.confidence ?? 0;
    return {
      name: formatName(item.disease ?? "Unknown"),
      // Store as 0–1 fraction for the UI
      probability: Math.min(1, Math.max(0, pct / 100)),
      severity: toSeverity(pct),
    };
  });

  // If top_3 is empty but we still have a prediction, synthesise one entry
  if (diseases.length === 0 && json.prediction) {
    const pct = json.confidence ?? 0;
    diseases.push({
      name: formatName(json.prediction),
      probability: Math.min(1, Math.max(0, pct / 100)),
      severity: toSeverity(pct),
    });
  }

  // Advice: use lookup for the top prediction, fall back to defaults
  const topKey = json.prediction as string | undefined;
  const advice = DISEASE_ADVICE[topKey ?? ""] ?? DEFAULT_ADVICE;
  const prevention = DISEASE_PREVENTION[topKey ?? ""] ?? DEFAULT_PREVENTION;

  // Crop type: the model currently detects maize diseases
  const cropType = "Maize (Zea mays)";

  return {
    cropType,
    diagnosedAt: new Date().toISOString(),
    diseases,
    advice,
    prevention,
    urgency: deriveUrgency(diseases),
  };
}
