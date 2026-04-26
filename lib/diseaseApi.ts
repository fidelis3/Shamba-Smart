import { DiagnosticReport, DiseaseResult } from "./types";

const API_URL = "https://shambasmart-ai.onrender.com/detect_disease";

// ─── Advice lookup per disease ────────────────────────────────────────────────
const DISEASE_ADVICE: Record<string, string[]> = {
  Common_Rust: [
    "Apply a foliar fungicide (e.g., azoxystrobin or propiconazole) as soon as possible.",
    "Remove and dispose of heavily infected leaves to reduce spore spread.",
    "Avoid overhead irrigation — wet leaves accelerate rust development.",
    "Plant rust-resistant maize varieties in the next season.",
    "Scout neighbouring plots; spray within 5–7 days if >30% of plants are affected.",
  ],
  Northern_Leaf_Blight: [
    "Apply a recommended fungicide (e.g., mancozeb or chlorothalonil) immediately.",
    "Improve air circulation by thinning dense stands where possible.",
    "Remove crop debris after harvest to eliminate overwintering spores.",
    "Use certified disease-resistant seed varieties next planting season.",
    "Rotate crops with non-host crops (e.g., legumes) to break the disease cycle.",
  ],
  Fall_Armyworm: [
    "Apply an approved insecticide (e.g., emamectin benzoate or spinetoram) promptly.",
    "Scout fields early morning or late evening when larvae are most active.",
    "Introduce natural predators such as parasitic wasps or earwigs where feasible.",
    "Apply neem-based biopesticides as an alternative for early infestations.",
    "Report heavy infestations to local agricultural extension officers.",
  ],
  Healthy: [
    "Your crop looks healthy — keep up the good agronomic practices.",
    "Continue regular scouting (at least weekly) to catch issues early.",
    "Maintain balanced fertiliser application and adequate irrigation.",
  ],
};

const DEFAULT_ADVICE = [
  "Consult a local agronomist for a tailored treatment plan.",
  "Monitor your crop closely over the next 7–14 days.",
  "Isolate visibly affected plants to prevent further spread.",
  "Keep field records to track disease progression.",
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

  // Crop type: the model currently detects maize diseases
  const cropType = "Maize (Zea mays)";

  return {
    cropType,
    diagnosedAt: new Date().toISOString(),
    diseases,
    advice,
    urgency: deriveUrgency(diseases),
  };
}
