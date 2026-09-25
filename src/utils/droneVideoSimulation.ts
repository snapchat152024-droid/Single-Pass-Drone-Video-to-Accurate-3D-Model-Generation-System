/**
 * Utility to generate realistic simulated drone camera frames and HUD overlays
 * for the data preparation and upload screen.
 */

export interface DroneFrame {
  id: number;
  timeSec: number;
  timeFormatted: string;
  qualityScore: number;
  motionBlur: 'Low' | 'Moderate' | 'High';
  exposure: 'Optimal' | 'Slight Underexposure' | 'Good';
  gpsLocked: boolean;
  thumbnailSvg: string;
}

export function generateSampleFrames(count: number = 8): DroneFrame[] {
  const frames: DroneFrame[] = [];
  const times = [0, 12, 25, 41, 56, 73, 88, 102];

  for (let i = 0; i < count; i++) {
    const t = times[i] || i * 14;
    const mins = Math.floor(t / 60);
    const secs = t % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const score = i === 4 ? 76 : i === 7 ? 84 : Math.floor(90 + Math.random() * 8);
    const blur = score < 80 ? 'Moderate' : 'Low';
    const exposure = i === 2 ? 'Slight Underexposure' : 'Optimal';

    // Generate lightweight stylized SVG thumbnail representing aerial drone nadir view
    const hue = (200 + i * 15) % 360;
    const svg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90">
      <defs>
        <linearGradient id="g${i}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%231e293b" />
          <stop offset="50%" stop-color="%230f172a" />
          <stop offset="100%" stop-color="%23020617" />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill="url(%23g${i})" />
      <!-- Road line -->
      <path d="M 0,${35 + (i % 3) * 10} Q 80,${45 - (i % 2) * 15} 160,${40 + (i % 4) * 5}" stroke="%23334155" stroke-width="12" fill="none" />
      <path d="M 0,${35 + (i % 3) * 10} Q 80,${45 - (i % 2) * 15} 160,${40 + (i % 4) * 5}" stroke="%23f59e0b" stroke-dasharray="4,4" stroke-width="1" fill="none" />
      <!-- Building blocks -->
      <rect x="${15 + (i * 12) % 60}" y="${10 + (i * 8) % 30}" width="28" height="22" fill="%23475569" stroke="%2300e5ff" stroke-width="0.8" rx="2" />
      <rect x="${85 + (i * 7) % 50}" y="${50 - (i * 4) % 25}" width="34" height="26" fill="%233b82f6" fill-opacity="0.3" stroke="%2338bdf8" stroke-width="0.8" rx="2" />
      <!-- Drone crosshair -->
      <circle cx="80" cy="45" r="8" stroke="%2300e5ff" stroke-width="0.75" fill="none" opacity="0.6"/>
      <line x1="72" y1="45" x2="88" y2="45" stroke="%2300e5ff" stroke-width="0.75" opacity="0.6"/>
      <line x1="80" y1="37" x2="80" y2="53" stroke="%2300e5ff" stroke-width="0.75" opacity="0.6"/>
      <!-- Timecode -->
      <rect x="6" y="70" width="34" height="14" fill="%23000000" fill-opacity="0.7" rx="2" />
      <text x="10" y="80" font-family="monospace" font-size="8" fill="%2338bdf8">${formatted}</text>
      <text x="120" y="16" font-family="monospace" font-size="7" fill="%2310b981">${score}%</text>
    </svg>`;

    frames.push({
      id: i,
      timeSec: t,
      timeFormatted: formatted,
      qualityScore: score,
      motionBlur: blur,
      exposure,
      gpsLocked: true,
      thumbnailSvg: svg,
    });
  }

  return frames;
}
