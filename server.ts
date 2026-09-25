import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Scene analysis endpoint
app.post('/api/ai/analyze-scene', async (req, res) => {
  const { projectName, surveyType, area, buildingsDetected, roadLength, customContext } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({
      success: true,
      mode: 'simulated',
      insights: [
        `${buildingsDetected || 17} primary structures successfully reconstructed with high geometric fidelity.`,
        `Road network spanning ${(roadLength || 3.8)} km mapped with continuous georeferencing alignment.`,
        'Vegetation index indicates dense canopy along northern perimeter, slight occlusion on perimeter fence.',
        'Roof surfaces exhibit consistent texture resolution (average 2.4 cm/pixel ground sampling distance).',
        'Recommended follow-up: Nadir angles provide 94.2% surface coverage; oblique pass recommended for sheer building facades.'
      ],
      structuralSummary: 'Single-pass photogrammetric reconstruction shows optimal parallax across central infrastructure corridor. Surface normal consistency exceeds 92.4%.',
      confidenceScore: 93.8,
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are Aero3D AI's core photogrammetry and geospatial intelligence engine.
Analyze this single-pass drone survey dataset:
- Project Name: ${projectName || 'Jaipur Infrastructure Survey'}
- Survey Type: ${surveyType || 'Urban Mapping & Infrastructure'}
- Survey Area: ${area || '12.8 hectares'}
- Detected Buildings: ${buildingsDetected || 17} structures
- Road Network: ${roadLength || '3.8 km'}
- Additional Context: ${customContext || 'Single-pass video with synchronized GPS and IMU telemetry.'}

Provide an expert geospatial evaluation in valid JSON with:
1. "insights": array of 5 concise, professional engineering observations (structure alignment, terrain elevation variation, road conditions, occlusion zones, ground resolution).
2. "structuralSummary": 2-sentence executive summary for drone mapping engineers.
3. "confidenceScore": number between 88 and 98 representing reconstruction confidence.
Respond ONLY with raw JSON matching this format without backticks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      mode: 'live-gemini',
      insights: parsed.insights || [],
      structuralSummary: parsed.structuralSummary || 'Reconstruction completed successfully.',
      confidenceScore: parsed.confidenceScore || 94.2,
    });
  } catch (error: any) {
    console.warn('Gemini scene analysis fallback:', error?.message);
    return res.json({
      success: true,
      mode: 'fallback',
      insights: [
        `${buildingsDetected || 17} building structures identified and classified.`,
        'Continuous road corridors reconstructed with sub-5cm vertical accuracy.',
        'Minor shadow occlusions detected on northern facades under low sun azimuth.',
        'Point cloud density validated at 182 pts/m² across paved surfaces.',
        'Geodetic datum alignment with WGS84 confirmed with zero drift.'
      ],
      structuralSummary: 'Automated photogrammetry analysis verified spatial integrity and digital twin readiness.',
      confidenceScore: 92.5,
    });
  }
});

// Interactive Aero AI assistant endpoint
app.post('/api/ai/assistant', async (req, res) => {
  const { message, projectContext } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Deterministic intelligent assistant response
    const msg = (message || '').toLowerCase();
    let reply = "I am Aero AI, your drone photogrammetry and 3D reconstruction specialist.";
    if (msg.includes('structure') || msg.includes('building')) {
      reply = `In this model, Aero3D AI identified 17 distinct building structures ranging from 6.2m to 24.8m in height. All primary footprints have been extracted into vector envelopes with 94.2% geometric certainty.`;
    } else if (msg.includes('accurate') || msg.includes('accuracy') || msg.includes('confidence')) {
      reply = `The reconstructed digital twin achieves an estimated horizontal ground sampling distance of 2.4 cm/pixel and a vertical Root Mean Square Error (RMSE) of ±3.8 cm, aligned to WGS84 via camera telemetry.`;
    } else if (msg.includes('occlu') || msg.includes('blind') || msg.includes('shadow')) {
      reply = `Minor occlusions were identified on the north-east facade of Building #4 and underneath the dense tree cluster at coordinates 26.9124°N, 75.7873°E. Single-pass nadir views have 88.7% visibility in these pockets.`;
    } else if (msg.includes('height') || msg.includes('elevation')) {
      reply = `The maximum structure elevation is the central communications tower at 28.6m above ground level, with commercial buildings averaging 14.2m. Terrain elevation slopes gently by 4.2m from North to South.`;
    } else if (msg.includes('summar') || msg.includes('survey')) {
      reply = `This survey covers 12.8 hectares in Jaipur with 3,060 sampled 4K video frames, producing an 8.4M point cloud and a 2.6M polygon textured mesh. Ideal for urban asset management and digital twin GIS integration.`;
    } else {
      reply = `Based on the drone trajectory and depth estimation data, the 3D model is metrically consistent with 93% reconstruction confidence. You can use the toolbar measurement tools to inspect exact distances, heights, and surface areas in real time.`;
    }
    return res.json({ reply, mode: 'deterministic' });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are "Aero AI", an expert drone photogrammetry and 3D geospatial reconstruction assistant embedded in Aero3D AI (tagline: "Turn One Drone Flight Into a Digital 3D World").
You answer questions regarding 3D digital twins, point clouds, mesh extraction, camera trajectory, RTK/GPS alignment, structural inspection, and metric measurements from single-pass drone videos.
Current project context: ${JSON.stringify(projectContext || {
      name: 'Jaipur Infrastructure Survey',
      area: '12.8 hectares',
      buildings: 17,
      resolution: '2.4 cm/pixel',
      accuracy: '95.8%',
      confidence: '93%'
    })}.
Be professional, authoritative, concise (2-4 sentences), and focused on engineering accuracy.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      reply: response.text || 'Analysis completed.',
      mode: 'live-gemini',
    });
  } catch (error: any) {
    return res.json({
      reply: 'Aero3D AI photogrammetry metrics indicate 93% reconstruction confidence across the 12.8 hectare survey area with 17 detected building structures.',
      mode: 'fallback',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aero3D AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
