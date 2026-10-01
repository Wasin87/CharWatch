import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, activeRegion, activeData } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in Vercel environment variables.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are CHARWATCH ANALYST, an expert AI Earth Observation & River Dynamics Specialist for the CharWatch project (NASA Space Apps Challenge prototype for Bangladesh river systems).

Context & Guidelines:
1. Current Active River Sector: ${activeRegion ? activeRegion.name : 'Jamuna River Basin - Sirajganj Sector'}
2. Current Sector Telemetry: ${activeData ? JSON.stringify(activeData) : 'Coherence: 0.82, L-band Backscatter: -11.4 dB, C-band Backscatter: -14.2 dB, Soil Moisture: 42.8%, Bank Shift: 340m West, Prototype Risk: WARNING'}
3. Ground your explanations in radar physics:
   - NISAR (L-Band, 24cm wavelength): Superior cloud/canopy penetration, sensitive to soil moisture & sub-surface dielectric properties.
   - Sentinel-1 (C-Band, 5.6cm wavelength): Excellent for surface roughness, land-water boundary mapping, interferometric coherence decay tracking.
   - Bank Migration: Caused by severe monsoonal shear stress on loose alluvial sands along Jamuna/Padma/Meghna.
   - Chars: Dynamics of braided river sandbars (sandbar -> emerging -> vegetated -> settled char).
4. Tone: Scientific, authoritative, human-centered, concise, and calm.`;

    const formattedPrompt = `${systemInstruction}\n\nUser Question: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: formattedPrompt }],
        },
      ],
    });

    const reply = response.text || 'Analysis model returned empty response.';
    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Error in Vercel /api/analyst/chat:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process AI analysis request.',
    });
  }
}
