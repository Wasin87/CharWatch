import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());
app.use(express.static('public'));

// API Route for CHARWATCH AI River Analyst
app.post('/api/analyst/chat', async (req, res) => {
  try {
    const { message, activeRegion, activeData } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    const sectorName = activeRegion ? activeRegion.name : 'Jamuna River - Sirajganj Sector';
    const riverSystem = activeRegion ? activeRegion.riverSystem : 'Jamuna River';
    const coherence = activeData?.coherence ?? (activeRegion?.radarCoherence ?? 0.82);
    const soilMoisture = activeData?.soilMoisture ?? (activeRegion?.soilMoisturePercent ?? 42.8);
    const bankShift = activeData?.bankShift ?? (activeRegion?.bankShiftMeters ?? 340);
    const riskLevel = activeData?.riskLevel ?? (activeRegion?.riskTier ?? 'WARNING');

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are CHARWATCH ANALYST, an expert AI Earth Observation & River Dynamics Specialist for the CharWatch project (NASA Space Apps Challenge prototype for Bangladesh and global river systems).

Context & Guidelines:
1. Current Active River Sector: ${sectorName} (${riverSystem})
2. Telemetry: Coherence: ${coherence} γ, Soil Moisture: ${soilMoisture}%, Bank Shift: -${bankShift}m, Risk Tier: ${riskLevel}
3. Ground your explanations in radar physics:
   - NISAR (L-Band, 24cm wavelength): Sensitive to sub-surface moisture & dielectric properties.
   - Sentinel-1 (C-Band, 5.6cm wavelength): Excellent for surface roughness & interferometric coherence decay.
   - Bank Migration: Caused by severe monsoonal hydraulic shear stress on loose alluvial sands.
   - Chars: Braided river sandbar accretion dynamics (sandbar -> emerging -> vegetated -> settled char).
4. Tone: Scientific, authoritative, concise, and calm.`;

      const formattedPrompt = `${systemInstruction}\n\nUser Question: ${message}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: formattedPrompt }]
          }
        ]
      });

      const reply = response.text || 'Analysis model returned empty response.';
      return res.json({ reply });
    }

    // Fallback if GEMINI_API_KEY is not configured
    const reply = `[RADAR & HYDRO-ANALYSIS: ${sectorName.toUpperCase()}]
• River Basin: ${riverSystem}
• Observed Bankline Displacement: -${bankShift} meters
• Soil Pore-Water Saturation: ${soilMoisture}% (Critical shear threshold)
• InSAR Phase Coherence: ${coherence} γ
• Current Risk Classification: ${riskLevel}

Scientific Assessment:
The sector is undergoing active monsoonal hydraulic shear stress. L-band SAR backscatter indicates deep alluvial moisture saturation along the lower bank toe, increasing cantilever scarp collapse probability. Accreting char islands downstream are bifurcating discharge into secondary channels.

(Note: To enable live generative conversational mode, configure your GEMINI_API_KEY in environment variables.)`;

    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/analyst/chat:', error);
    res.status(500).json({ 
      error: error?.message || 'Failed to process AI analysis request.' 
    });
  }
});

// Vite Middleware for Dev / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CHARWATCH] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
