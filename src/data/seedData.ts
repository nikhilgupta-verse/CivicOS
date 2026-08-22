import { Complaint, Department, IssueType } from '../types';

export interface PresetScenario {
  id: string;
  titleKey: 'presetPothole' | 'presetGarbage' | 'presetLight' | 'presetWater' | 'presetDrain' | 'presetSignal';
  defaultTitle: string;
  issueType: IssueType;
  department: Department;
  suggestedText: string;
  suggestedTextHi: string;
  suggestedTextPa: string;
  location: string;
  landmark: string;
  ward: string;
  zone: string;
  photoUrl: string; // base64 SVG or data URL
}

// Generate high quality SVG data URLs for realistic civic problem illustrations
function createCivicSvg(type: string, bg: string, accent: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
    <defs>
      <linearGradient id="grad_${type}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.3"/>
      </filter>
    </defs>
    <rect width="600" height="400" fill="url(#grad_${type})"/>
    <!-- Road / Context Grid -->
    <path d="M0,280 Q300,260 600,280 L600,400 L0,400 Z" fill="#0f172a" opacity="0.85"/>
    <line x1="0" y1="340" x2="600" y2="340" stroke="#fbbf24" stroke-width="4" stroke-dasharray="24,16" opacity="0.6"/>
    
    <!-- Hazard Graphics -->
    ${
      type === 'pothole'
        ? `<ellipse cx="300" cy="320" rx="140" ry="45" fill="#020617" filter="url(#shadow)"/>
           <path d="M200,320 Q280,345 380,315 Q410,335 340,350 Q240,355 180,330 Z" fill="#090d16"/>
           <circle cx="260" cy="325" r="18" fill="#1e293b"/>
           <path d="M160,290 L200,310 M390,300 L440,325 M280,355 L310,375" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
           <text x="300" y="240" font-family="system-ui, sans-serif" font-weight="700" font-size="20" fill="#fca5a5" text-anchor="middle">CRITICAL ROAD CRATER (DEPTH ~18CM)</text>`
        : type === 'garbage'
        ? `<path d="M220,330 Q270,240 330,250 Q390,260 410,330 Z" fill="#15803d" opacity="0.9" filter="url(#shadow)"/>
           <path d="M190,340 Q240,280 290,340 Z" fill="#b45309"/>
           <path d="M310,345 Q360,270 420,335 Z" fill="#475569"/>
           <circle cx="280" cy="270" r="10" fill="#f59e0b"/>
           <circle cx="340" cy="285" r="8" fill="#ef4444"/>
           <text x="300" y="220" font-family="system-ui, sans-serif" font-weight="700" font-size="20" fill="#86efac" text-anchor="middle">ILLEGAL GARBAGE DUMP ON FOOTPATH</text>`
        : type === 'light'
        ? `<rect x="290" y="100" width="16" height="230" fill="#475569"/>
           <path d="M270,100 L330,100 L340,120 L260,120 Z" fill="#334155"/>
           <path d="M260,120 L340,120 L300,160 Z" fill="#ef4444" opacity="0.4"/>
           <line x1="280" y1="130" x2="320" y2="150" stroke="#f87171" stroke-width="3"/>
           <line x1="320" y1="130" x2="280" y2="150" stroke="#f87171" stroke-width="3"/>
           <circle cx="300" cy="140" r="35" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4"/>
           <text x="300" y="70" font-family="system-ui, sans-serif" font-weight="700" font-size="20" fill="#fca5a5" text-anchor="middle">NON-FUNCTIONAL STREETLIGHT (DARK CORRIDOR)</text>`
        : type === 'water'
        ? `<rect x="180" y="320" width="240" height="24" rx="6" fill="#334155"/>
           <path d="M290,320 Q280,210 300,180 Q320,210 310,320 Z" fill="#38bdf8" opacity="0.85" filter="url(#shadow)"/>
           <ellipse cx="300" cy="335" rx="160" ry="35" fill="#0284c7" opacity="0.6"/>
           <circle cx="300" cy="180" r="14" fill="#bae6fd"/>
           <text x="300" y="140" font-family="system-ui, sans-serif" font-weight="700" font-size="20" fill="#7dd3fc" text-anchor="middle">MAIN WATER SUPPLY PIPE BURST (HIGH FLOW)</text>`
        : type === 'drain'
        ? `<rect x="220" y="270" width="160" height="70" fill="#0f172a" stroke="#475569" stroke-width="4"/>
           <line x1="250" y1="270" x2="250" y2="340" stroke="#64748b" stroke-width="4"/>
           <line x1="280" y1="270" x2="280" y2="340" stroke="#64748b" stroke-width="4"/>
           <line x1="310" y1="270" x2="310" y2="340" stroke="#64748b" stroke-width="4"/>
           <line x1="340" y1="270" x2="340" y2="340" stroke="#64748b" stroke-width="4"/>
           <path d="M180,310 Q300,280 420,310 Q430,360 170,360 Z" fill="#334155" opacity="0.9"/>
           <circle cx="270" cy="300" r="15" fill="#854d0e"/>
           <circle cx="320" cy="310" r="12" fill="#713f12"/>
           <text x="300" y="220" font-family="system-ui, sans-serif" font-weight="700" font-size="20" fill="#fde047" text-anchor="middle">CHOKED STORM DRAIN CAUSING BACKFLOW</text>`
        : `<rect x="270" y="120" width="60" height="150" rx="10" fill="#1e293b" stroke="#475569" stroke-width="4"/>
           <circle cx="300" cy="150" r="16" fill="#ef4444" filter="url(#shadow)"/>
           <circle cx="300" cy="195" r="16" fill="#334155"/>
           <circle cx="300" cy="240" r="16" fill="#334155"/>
           <line x1="280" y1="130" x2="320" y2="170" stroke="#ffffff" stroke-width="4"/>
           <line x1="320" y1="130" x2="280" y2="170" stroke="#ffffff" stroke-width="4"/>
           <text x="300" y="80" font-family="system-ui, sans-serif" font-weight="700" font-size="20" fill="#fca5a5" text-anchor="middle">MALFUNCTIONING JUNCTION TRAFFIC SIGNAL</text>`
    }
    
    <!-- Stamp Footer -->
    <rect x="20" y="355" width="220" height="30" rx="6" fill="#0f172a" opacity="0.8"/>
    <text x="30" y="375" font-family="monospace" font-size="12" fill="#94a3b8">CIVICOS MUNICIPAL SENSOR</text>
    <rect x="420" y="355" width="160" height="30" rx="6" fill="#0f172a" opacity="0.8"/>
    <text x="430" y="375" font-family="monospace" font-size="12" fill="${accent}">GEO-TAGGED EVIDENCE</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'preset-pothole',
    titleKey: 'presetPothole',
    defaultTitle: 'Deep Pothole (Main Road)',
    issueType: 'Pothole',
    department: 'Roads Department',
    suggestedText: 'Massive crater pothole on Main MG Road right outside City Hospital Gate 1. Ambulances and two-wheelers are swerving into oncoming traffic to avoid it. Multiple riders have skidded today.',
    suggestedTextHi: 'सिटी अस्पताल गेट 1 के बाहर मुख्य एमजी रोड पर बहुत गहरा गड्ढा है। एम्बुलेंस और दोपहिया वाहन दुर्घटनाग्रस्त हो रहे हैं। तुरंत मरम्मत की आवश्यकता है।',
    suggestedTextPa: 'ਸਿਟੀ ਹਸਪਤਾਲ ਗੇਟ 1 ਦੇ ਸਾਹਮਣੇ ਮੁੱਖ ਸੜਕ ਤੇ ਬਹੁਤ ਵੱਡਾ ਖੱਡਾ ਹੈ। ਐਂਬੂਲੈਂਸਾਂ ਅਤੇ ਮੋਟਰਸਾਈਕਲ ਸਵਾਰਾਂ ਲਈ ਖ਼ਤਰਾ ਬਣਿਆ ਹੋਇਆ ਹੈ।',
    location: 'MG Road, Sector 14',
    landmark: 'Outside City Hospital Gate 1',
    ward: 'Ward 14 - Civil Lines',
    zone: 'Central Zone',
    photoUrl: createCivicSvg('pothole', '#334155', '#ef4444', 'POTHOLE'),
  },
  {
    id: 'preset-garbage',
    titleKey: 'presetGarbage',
    defaultTitle: 'Garbage Dump (Near School)',
    issueType: 'Garbage & Waste',
    department: 'Sanitation Department',
    suggestedText: 'Huge uncollected garbage dump overflowing onto the pedestrian footpath right next to St. Xavier Primary School. Stray animals gathering and foul odor spreading into classrooms.',
    suggestedTextHi: 'सेंट जेवियर्स प्राइमरी स्कूल के पास फुटपाथ पर कचरे का बड़ा ढेर लगा है। बदबू आ रही है और आवारा पशु जमा हो रहे हैं।',
    suggestedTextPa: 'ਸਕੂਲ ਦੇ ਨੇੜੇ ਫੁੱਟਪਾਥ ਤੇ ਕੂੜੇ ਦਾ ਵੱਡਾ ਢੇਰ ਲੱਗਿਆ ਹੋਇਆ ਹੈ, ਬੱਚਿਆਂ ਲਈ ਬਿਮਾਰੀ ਦਾ ਖ਼ਤਰਾ ਹੈ। ਤੁਰੰਤ ਸਫ਼ਾਈ ਕਰਵਾਈ ਜਾਵੇ।',
    location: 'Station Road, Ward 08',
    landmark: 'Adjacent to St. Xavier School',
    ward: 'Ward 08 - Subhash Nagar',
    zone: 'East Zone',
    photoUrl: createCivicSvg('garbage', '#1e3a5f', '#10b981', 'GARBAGE'),
  },
  {
    id: 'preset-light',
    titleKey: 'presetLight',
    defaultTitle: 'Broken Streetlight (Dark Alley)',
    issueType: 'Broken Streetlight',
    department: 'Electrical Department',
    suggestedText: 'Three consecutive streetlights are broken on the transit walkway connecting Sector 22 Metro Station to the residential block. Entire street is pitch dark causing safety concerns for women and evening commuters.',
    suggestedTextHi: 'मेट्रो स्टेशन से कॉलोनी को जोड़ने वाले रास्ते पर 3 स्ट्रीट लाइटें पूरी तरह बंद हैं। शाम को अंधेरा होने से महिलाओं की सुरक्षा का खतरा है।',
    suggestedTextPa: 'ਮੈਟਰੋ ਸਟੇਸ਼ਨ ਤੋਂ ਰਿਹਾਇਸ਼ੀ ਖੇਤਰ ਵਾਲੇ ਰਸਤੇ ਦੀਆਂ ਲਾਈਟਾਂ ਬੰਦ ਹਨ, ਰਾਤ ਵੇਲੇ ਭਾਰੀ ਹਨੇਰਾ ਰਹਿੰਦਾ ਹੈ।',
    location: 'Metro Link Road, Sector 22',
    landmark: 'Behind Metro Station Exit 2',
    ward: 'Ward 22 - Transit Corridor',
    zone: 'South Zone',
    photoUrl: createCivicSvg('light', '#312e81', '#f59e0b', 'STREETLIGHT'),
  },
  {
    id: 'preset-water',
    titleKey: 'presetWater',
    defaultTitle: 'Water Pipe Burst',
    issueType: 'Water Leakage',
    department: 'Water Supply Department',
    suggestedText: 'Underground high-pressure clean water supply line ruptured under the sidewalk. Thousands of liters of drinking water gushing onto the road and eroding the asphalt base.',
    suggestedTextHi: 'फुटपाथ के नीचे मुख्य पीने के पानी की पाइपलाइन फट गई है। भारी मात्रा में पानी बर्बाद हो रहा है और सड़क धंस रही है।',
    suggestedTextPa: 'ਪੀਣ ਵਾਲੇ ਪਾਣੀ ਦੀ ਮੁੱਖ ਪਾਈਪਲਾਈਨ ਫਟ ਗਈ ਹੈ ਅਤੇ ਹਜ਼ਾਰਾਂ ਲੀਟਰ ਸਾਫ਼ ਪਾਣੀ ਸੜਕ ਤੇ ਵਿਅਰਥ ਵਹਿ ਰਿਹਾ ਹੈ।',
    location: 'Circular Ring Road, Ward 05',
    landmark: 'Opposite Water Tank No. 3',
    ward: 'Ward 05 - Nehru Enclave',
    zone: 'West Zone',
    photoUrl: createCivicSvg('water', '#0c4a6e', '#0284c7', 'WATER LEAK'),
  },
  {
    id: 'preset-drain',
    titleKey: 'presetDrain',
    defaultTitle: 'Blocked Storm Drain',
    issueType: 'Blocked Drain',
    department: 'Drainage Department',
    suggestedText: 'Main stormwater drainage choked with construction debris and solid plastic. Stagnant black water flooding 50 meters of the neighborhood street during moderate rain.',
    suggestedTextHi: 'मुख्य नाली मलबे और प्लास्टिक से पूरी तरह जाम हो गई है। गंदा पानी सड़क पर भर गया है और घरों में घुसने का खतरा है।',
    suggestedTextPa: 'ਸੀਵਰੇਜ ਨਾਲਾ ਬੰਦ ਹੋਣ ਕਰਕੇ ਗੰਦਾ ਪਾਣੀ ਗਲੀ ਵਿੱਚ ਇਕੱਠਾ ਹੋ ਰਿਹਾ ਹੈ। ਬਿਮਾਰੀਆਂ ਫੈਲਣ ਦਾ ਡਰ ਹੈ।',
    location: 'Old Market Lane, Ward 11',
    landmark: 'Near Central Grain Market',
    ward: 'Ward 11 - Grain Market',
    zone: 'North Zone',
    photoUrl: createCivicSvg('drain', '#1e293b', '#eab308', 'DRAIN CHOKE'),
  },
  {
    id: 'preset-signal',
    titleKey: 'presetSignal',
    defaultTitle: 'Broken Traffic Light',
    issueType: 'Damaged Traffic Signal',
    department: 'Traffic Department',
    suggestedText: '4-way busy junction traffic signal has completely blacked out. Heavy rush hour vehicles and school buses crossing simultaneously without any traffic police control.',
    suggestedTextHi: 'मुख्य 4-तरफा चौराहे का ट्रैफिक सिग्नल पूरी तरह बंद है। भारी जाम लगा है और वाहनों की सीधी टक्कर का खतरा है।',
    suggestedTextPa: 'ਮੁੱਖ ਚੌਕ ਦਾ ਟ੍ਰੈਫਿਕ ਲਾਈਟ ਸਿਗਨਲ ਬੰਦ ਹੈ, ਸਕੂਲ ਬੱਸਾਂ ਅਤੇ ਵਾਹਨਾਂ ਦੇ ਆਪਸ ਵਿੱਚ ਟਕਰਾਉਣ ਦਾ ਗੰਭੀਰ ਖ਼ਤਰਾ ਹੈ।',
    location: 'Gandhi Chowk Crossroad',
    landmark: 'Major 4-way Junction',
    ward: 'Ward 02 - City Centre',
    zone: 'Central Zone',
    photoUrl: createCivicSvg('signal', '#450a0a', '#ef4444', 'SIGNAL FAILURE'),
  },
];

export const INITIAL_SEED_COMPLAINTS: Complaint[] = [
  {
    id: 'CIV-2026-9104',
    createdAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(), // 24 mins ago
    citizenLanguage: 'en',
    rawDescription: 'Dangerous crater pothole right outside Civil Hospital emergency ramp. Ambulances are braking hard to prevent patient distress. Two scooters slipped on loose gravel.',
    photoUrl: createCivicSvg('pothole', '#334155', '#ef4444', 'POTHOLE'),
    location: {
      address: 'Hospital Road, Sector 16',
      ward: 'Ward 14 - Civil Lines',
      zone: 'Central Zone',
      latitude: 28.6139,
      longitude: 77.209,
      landmark: 'Civil Hospital Emergency Gate',
    },
    assignedDepartment: 'Roads Department',
    assignedCrew: 'Rapid Asphalt Unit #4 (Supervisor: R. Sharma)',
    status: 'Open',
    source: 'web_portal',
    aiAnalysis: {
      issue_type: 'Pothole',
      severity: 'Critical',
      short_description: 'Deep road crater in critical hospital ambulance transit lane',
      suggested_department: 'Roads Department',
      risk_factors: [
        'Critical ambulance transit corridor disruption',
        'Direct threat of patient spinal shock during transit',
        'High two-wheeler skid probability on gravel scatter',
      ],
      detected_language: 'English',
      priority_score: 92,
      priority_bucket: 'Critical',
      priority_breakdown: {
        severity_score: 38,
        proximity_score: 20,
        traffic_score: 18,
        population_impact_score: 16,
        total: 92,
        explanation: 'Maximum urgency triggered by emergency hospital ramp location (20/20) and dangerous crater depth (38/40).',
      },
      estimated_resolution_time_hours: 4,
      suggested_action: 'Dispatch Cold-Mix Rapid Patching Crew with hot asphalt compaction immediately.',
    },
    history: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
        status: 'Open',
        updatedBy: 'CivicOS AI Engine',
        note: 'AI Multimodal classified as Critical (Score: 92/100). Auto-routed to Roads Department Rapid Unit.',
      },
    ],
  },
  {
    id: 'CIV-2026-9088',
    createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(), // ~2 hours ago
    citizenLanguage: 'hi',
    rawDescription: 'सेंट जेवियर्स स्कूल के मुख्य द्वार के ठीक बगल में कचरे का भारी ढेर लगा हुआ है। बदबू के कारण बच्चों को परेशानी हो रही है और आवारा कुत्ते घूम रहे हैं।',
    photoUrl: createCivicSvg('garbage', '#1e3a5f', '#10b981', 'GARBAGE'),
    location: {
      address: 'Church Road, Subhash Nagar',
      ward: 'Ward 08 - Subhash Nagar',
      zone: 'East Zone',
      latitude: 28.6289,
      longitude: 77.234,
      landmark: 'Beside St. Xavier Primary School',
    },
    assignedDepartment: 'Sanitation Department',
    assignedCrew: 'Zone 3 Compactor Truck #12',
    status: 'In Progress',
    source: 'qr_scan',
    aiAnalysis: {
      issue_type: 'Garbage & Waste',
      severity: 'High',
      short_description: 'Overflowing solid waste heap adjacent to school entrance',
      suggested_department: 'Sanitation Department',
      risk_factors: [
        'Biological pathogen exposure to young school children',
        'Stray animal pack aggression hazard during dismissal hours',
        'Blocked pedestrian pathway forcing kids onto active roadway',
      ],
      detected_language: 'Hindi',
      priority_score: 78,
      priority_bucket: 'High',
      priority_breakdown: {
        severity_score: 28,
        proximity_score: 20,
        traffic_score: 14,
        population_impact_score: 16,
        total: 78,
        explanation: 'High priority driven by school boundary proximity (20/20) and public health vulnerability (28/40).',
      },
      estimated_resolution_time_hours: 8,
      suggested_action: 'Deploy hydraulic compactor truck with lime powder sanitization spray.',
    },
    history: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
        status: 'Open',
        updatedBy: 'CivicOS AI Engine',
        note: 'Scanned via lamppost QR Poster #QR-E08. Assigned to Sanitation.',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        status: 'In Progress',
        updatedBy: 'Sanitation Inspector K. Verma',
        note: 'Compactor truck dispatched; crew currently clearing site.',
      },
    ],
  },
  {
    id: 'CIV-2026-9045',
    createdAt: new Date(Date.now() - 1000 * 60 * 280).toISOString(), // ~4.5 hours ago
    citizenLanguage: 'en',
    rawDescription: 'Four high-mast LED streetlights are non-functional outside Metro Station Gate 2. Pitch black walkway leading to auto-rickshaw stand.',
    photoUrl: createCivicSvg('light', '#312e81', '#f59e0b', 'STREETLIGHT'),
    location: {
      address: 'Station Access Loop, Sector 22',
      ward: 'Ward 22 - Transit Corridor',
      zone: 'South Zone',
      latitude: 28.598,
      longitude: 77.195,
      landmark: 'Metro Station Gate 2 Pathway',
    },
    assignedDepartment: 'Electrical Department',
    assignedCrew: 'Electrical Maintenance Van #2',
    status: 'In Progress',
    source: 'web_portal',
    aiAnalysis: {
      issue_type: 'Broken Streetlight',
      severity: 'High',
      short_description: 'Multiple streetlights blackout along high-volume transit pedestrian corridor',
      suggested_department: 'Electrical Department',
      risk_factors: [
        'Elevated crime and harassment vulnerability during late evening hours',
        'Pedestrian trip hazards over uneven pavement in complete darkness',
        'Commuter anxiety at major mass transit station',
      ],
      detected_language: 'English',
      priority_score: 74,
      priority_bucket: 'High',
      priority_breakdown: {
        severity_score: 26,
        proximity_score: 16,
        traffic_score: 16,
        population_impact_score: 16,
        total: 74,
        explanation: 'Transit node location combined with nighttime public safety requirements.',
      },
      estimated_resolution_time_hours: 12,
      suggested_action: 'Replace blown 150W LED drivers and inspect underground feeder cable.',
    },
    history: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 280).toISOString(),
        status: 'Open',
        updatedBy: 'CivicOS AI Engine',
        note: 'Complaint validated by AI.',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        status: 'In Progress',
        updatedBy: 'Electrical Supervisor D. Singh',
        note: 'Lineman assigned for ballast replacement.',
      },
    ],
  },
  {
    id: 'CIV-2026-8982',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 10 hours ago
    citizenLanguage: 'pa',
    rawDescription: 'ਪੀਣ ਵਾਲੇ ਪਾਣੀ ਦੀ ਮੁੱਖ ਪਾਈਪਲਾਈਨ ਫਟ ਗਈ ਹੈ, ਬਹੁਤ ਤੇਜ਼ ਪਾਣੀ ਵਹਿ ਰਿਹਾ ਹੈ। ਪੂਰੀ ਗਲੀ ਵਿੱਚ ਪਾਣੀ ਭਰ ਗਿਆ ਹੈ।',
    photoUrl: createCivicSvg('water', '#0c4a6e', '#0284c7', 'WATER LEAK'),
    location: {
      address: 'Ring Road Service Lane',
      ward: 'Ward 05 - Nehru Enclave',
      zone: 'West Zone',
      latitude: 28.641,
      longitude: 77.172,
      landmark: 'Near Water Booster Pump 4',
    },
    assignedDepartment: 'Water Supply Department',
    assignedCrew: 'Pipeline Emergency Team #1',
    status: 'Resolved',
    resolvedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    resolutionNote: 'Main 200mm DI feeder pipe clamped and welded. Pavement backfilled with gravel.',
    source: 'web_portal',
    aiAnalysis: {
      issue_type: 'Water Leakage',
      severity: 'Critical',
      short_description: 'High-pressure municipal potable water main rupture',
      suggested_department: 'Water Supply Department',
      risk_factors: [
        'Massive drinking water resource wastage (~4,000 liters/hour)',
        'Road sub-base erosion and risk of sudden asphalt collapse',
        'Contamination risk to municipal water distribution grid',
      ],
      detected_language: 'Punjabi',
      priority_score: 86,
      priority_bucket: 'Critical',
      priority_breakdown: {
        severity_score: 36,
        proximity_score: 14,
        traffic_score: 18,
        population_impact_score: 18,
        total: 86,
        explanation: 'Critical potable water loss and infrastructure destabilization hazard.',
      },
      estimated_resolution_time_hours: 6,
      suggested_action: 'Isolate upstream sluice valve and perform hydraulic sleeve weld repair.',
    },
    history: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
        status: 'Open',
        updatedBy: 'CivicOS AI Engine',
        note: 'Priority 86 (Critical). Alerted Water Board Control Room.',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
        status: 'In Progress',
        updatedBy: 'Chief Engineer M. Joshi',
        note: 'Valve isolated, welding team on site.',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        status: 'Resolved',
        updatedBy: 'Inspector A. Nair',
        note: 'Pipe restored, pressure tested at 4.2 bar.',
      },
    ],
  },
  {
    id: 'CIV-2026-8910',
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 24 hours ago
    citizenLanguage: 'en',
    rawDescription: 'Heavy storm drain completely clogged with construction silt. Backflowing dirty water onto shops during morning drizzle.',
    photoUrl: createCivicSvg('drain', '#1e293b', '#eab308', 'DRAIN CHOKE'),
    location: {
      address: 'Grain Market Main Lane',
      ward: 'Ward 11 - Grain Market',
      zone: 'North Zone',
      latitude: 28.665,
      longitude: 77.215,
      landmark: 'Opposite Wholesale Grain Shop #42',
    },
    assignedDepartment: 'Drainage Department',
    assignedCrew: 'Suction Jetting Machine #3',
    status: 'Verified',
    resolvedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    resolutionNote: 'Desilted 120 meters of RCC drain line using super-sucker machine.',
    source: 'web_portal',
    aiAnalysis: {
      issue_type: 'Blocked Drain',
      severity: 'Medium',
      short_description: 'Stormwater culvert choked with commercial debris',
      suggested_department: 'Drainage Department',
      risk_factors: [
        'Urban waterlogging and road sub-base deterioration',
        'Economic loss to commercial shopfronts due to dirty water inundation',
      ],
      detected_language: 'English',
      priority_score: 58,
      priority_bucket: 'Medium',
      priority_breakdown: {
        severity_score: 22,
        proximity_score: 10,
        traffic_score: 12,
        population_impact_score: 14,
        total: 58,
        explanation: 'Commercial market district drainage bottleneck requiring scheduled suction clearing.',
      },
      estimated_resolution_time_hours: 24,
      suggested_action: 'Mobilize high-pressure jetting machine and manual desilting gang.',
    },
    history: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
        status: 'Open',
        updatedBy: 'CivicOS AI Engine',
        note: 'Classified Medium priority.',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
        status: 'In Progress',
        updatedBy: 'Drainage JE S. Gupta',
        note: 'Jetting unit deployed.',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        status: 'Resolved',
        updatedBy: 'Drainage JE S. Gupta',
        note: 'Line cleared and water free-flowing.',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        status: 'Verified',
        updatedBy: 'Citizen Audit Verification #204',
        note: 'Citizen verified site resolution via SMS confirmation token.',
      },
    ],
  },
  {
    id: 'CIV-2026-8850',
    createdAt: new Date(Date.now() - 1000 * 60 * 1800).toISOString(), // 30 hours ago
    citizenLanguage: 'hi',
    rawDescription: 'मुख्य 4-तरफा चौराहे का ट्रैफिक सिग्नल बंद हो गया है और बत्तियां नहीं जल रहीं।',
    photoUrl: createCivicSvg('signal', '#450a0a', '#ef4444', 'SIGNAL FAILURE'),
    location: {
      address: 'Gandhi Chowk Crossroad',
      ward: 'Ward 02 - City Centre',
      zone: 'Central Zone',
      latitude: 28.619,
      longitude: 77.218,
      landmark: 'Main Intersection',
    },
    assignedDepartment: 'Traffic Department',
    assignedCrew: 'Signals Tech Unit #1',
    status: 'Resolved',
    resolvedAt: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
    resolutionNote: 'Microcontroller relay replaced and signal synchronized.',
    source: 'qr_scan',
    aiAnalysis: {
      issue_type: 'Damaged Traffic Signal',
      severity: 'Critical',
      short_description: 'Major arterial intersection traffic light system offline',
      suggested_department: 'Traffic Department',
      risk_factors: [
        'Extreme risk of multi-vehicle broadside collision',
        'Severe gridlock impacting peak hour bus transit',
      ],
      detected_language: 'Hindi',
      priority_score: 88,
      priority_bucket: 'Critical',
      priority_breakdown: {
        severity_score: 36,
        proximity_score: 16,
        traffic_score: 20,
        population_impact_score: 16,
        total: 88,
        explanation: 'Major arterial crossroad signal failure with immediate collision risk (20/20 traffic density).',
      },
      estimated_resolution_time_hours: 3,
      suggested_action: 'Dispatch emergency signal technician and alert traffic police control room for manual traffic warden.',
    },
    history: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 1800).toISOString(),
        status: 'Open',
        updatedBy: 'CivicOS AI Engine',
        note: 'Critical score 88.',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 1700).toISOString(),
        status: 'In Progress',
        updatedBy: 'Traffic Police Liaison',
        note: 'Warden on site, repair tech dispatched.',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
        status: 'Resolved',
        updatedBy: 'Tech Lead P. Rao',
        note: 'Microcontroller replaced and timings synced.',
      },
    ],
  },
];

export const MUNICIPAL_WARDS = [
  { id: 'all', name: 'All Wards & Zones' },
  { id: 'Ward 14 - Civil Lines', name: 'Ward 14 - Civil Lines (Central)', zone: 'Central Zone', lat: 28.6139, lng: 77.209 },
  { id: 'Ward 08 - Subhash Nagar', name: 'Ward 08 - Subhash Nagar (East)', zone: 'East Zone', lat: 28.6289, lng: 77.234 },
  { id: 'Ward 22 - Transit Corridor', name: 'Ward 22 - Transit Corridor (South)', zone: 'South Zone', lat: 28.598, lng: 77.195 },
  { id: 'Ward 05 - Nehru Enclave', name: 'Ward 05 - Nehru Enclave (West)', zone: 'West Zone', lat: 28.641, lng: 77.172 },
  { id: 'Ward 11 - Grain Market', name: 'Ward 11 - Grain Market (North)', zone: 'North Zone', lat: 28.665, lng: 77.215 },
  { id: 'Ward 02 - City Centre', name: 'Ward 02 - City Centre (Central)', zone: 'Central Zone', lat: 28.619, lng: 77.218 },
  { id: 'Ward 19 - Model Town', name: 'Ward 19 - Model Town (North)', zone: 'North Zone', lat: 28.672, lng: 77.201 },
  { id: 'Ward 07 - Sector 22', name: 'Ward 07 - Sector 22 (South)', zone: 'South Zone', lat: 28.589, lng: 77.21 },
];
