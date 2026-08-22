import { Language } from '../types';

export interface Translations {
  portalTitle: string;
  portalSubtitle: string;
  reportIssue: string;
  languageSelect: string;
  photoUploadTitle: string;
  photoUploadSubtitle: string;
  dragOrClickPhoto: string;
  changePhoto: string;
  removePhoto: string;
  presetPhotosLabel: string;
  presetPothole: string;
  presetGarbage: string;
  presetLight: string;
  presetWater: string;
  presetDrain: string;
  presetSignal: string;
  issueDescriptionLabel: string;
  issueDescriptionPlaceholder: string;
  voiceButton: string;
  videoButton: string;
  comingSoon: string;
  locationLabel: string;
  locationPlaceholder: string;
  useCurrentLocation: string;
  detectingLocation: string;
  locationDetected: string;
  selectWard: string;
  landmarkLabel: string;
  landmarkPlaceholder: string;
  submitButton: string;
  submittingText: string;
  aiAnalyzingHeader: string;
  aiStep1: string;
  aiStep2: string;
  aiStep3: string;
  aiStep4: string;
  receiptTitle: string;
  receiptSubtitle: string;
  trackingIdLabel: string;
  issueTypeLabel: string;
  severityLabel: string;
  priorityScoreLabel: string;
  departmentLabel: string;
  locationReceiptLabel: string;
  slaLabel: string;
  riskFactorsLabel: string;
  suggestedActionLabel: string;
  reportAnotherBtn: string;
  viewDashboardBtn: string;
  printReceiptBtn: string;
  statusLabel: string;
  scoreHeuristicNotice: string;
  switchRoleLabel: string;
  scanQrNotice: string;
  // Dashboard & Navigation
  citizenPortalNav: string;
  govDashboardNav: string;
  qrPosterNav: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    portalTitle: 'Report a Civic Issue',
    portalSubtitle: 'CivicOS AI instantly classifies, prioritizes, and routes your complaint to the right municipal department.',
    reportIssue: 'Submit New Complaint',
    languageSelect: 'Select Language / भाषा चुनें / ਭਾਸ਼ਾ ਚੁਣੋ',
    photoUploadTitle: 'Attach Photo of the Issue',
    photoUploadSubtitle: 'Take a picture or choose an image file (JPG, PNG)',
    dragOrClickPhoto: 'Click to upload or drag & drop photo here',
    changePhoto: 'Change Photo',
    removePhoto: 'Remove',
    presetPhotosLabel: 'Or test with sample civic scenario:',
    presetPothole: 'Deep Pothole (Main Road)',
    presetGarbage: 'Garbage Dump (Near School)',
    presetLight: 'Broken Streetlight (Dark Alley)',
    presetWater: 'Water Pipe Burst',
    presetDrain: 'Blocked Storm Drain',
    presetSignal: 'Broken Traffic Light',
    issueDescriptionLabel: 'Describe the problem',
    issueDescriptionPlaceholder: 'e.g. Dangerous pothole near City Hospital entrance causing scooter skids during traffic hours...',
    voiceButton: 'Voice Report',
    videoButton: 'Video Upload',
    comingSoon: 'Coming Soon',
    locationLabel: 'Location & Ward',
    locationPlaceholder: 'Street, sector, landmark or address',
    useCurrentLocation: 'Use GPS Location',
    detectingLocation: 'Fetching GPS...',
    locationDetected: 'GPS Coordinates Captured',
    selectWard: 'Select Ward / Municipal Zone',
    landmarkLabel: 'Nearby Landmark / Critical Marker',
    landmarkPlaceholder: 'e.g. Near St. Mary School, Metro Pillar 42, Civil Hospital Gate 2',
    submitButton: 'Submit to CivicOS AI Engine',
    submittingText: 'Processing with Gemini AI...',
    aiAnalyzingHeader: 'AI Multimodal Understanding in Progress',
    aiStep1: 'Analyzing image features with Gemini Vision...',
    aiStep2: 'Detecting civic hazard type & severity level...',
    aiStep3: 'Computing 4-factor Priority Score (0-100)...',
    aiStep4: 'Assigning to Municipal Department & generating SLA...',
    receiptTitle: 'Civic Issue Official Receipt',
    receiptSubtitle: 'Your complaint has been acknowledged and dispatched to the field response team.',
    trackingIdLabel: 'Tracking ID',
    issueTypeLabel: 'Detected Issue',
    severityLabel: 'Severity Level',
    priorityScoreLabel: 'AI Priority Score',
    departmentLabel: 'Assigned Department',
    locationReceiptLabel: 'Reported Location',
    slaLabel: 'Target SLA Resolution',
    riskFactorsLabel: 'Identified Risk Factors',
    suggestedActionLabel: 'Field Crew Action Order',
    reportAnotherBtn: 'Report Another Issue',
    viewDashboardBtn: 'Open Government Dashboard',
    printReceiptBtn: 'Print / Save Receipt',
    statusLabel: 'Current Status',
    scoreHeuristicNotice: 'Score weighted by Hazard (40%), School/Hospital Proximity (20%), Road Traffic (20%), and Population Impact (20%).',
    switchRoleLabel: 'Switch View:',
    scanQrNotice: 'Scan this QR code in the field to report an issue in 10 seconds.',
    citizenPortalNav: 'Citizen Portal',
    govDashboardNav: 'Government Dashboard',
    qrPosterNav: 'QR Poster / Share',
  },
  hi: {
    portalTitle: 'नागरिक समस्या दर्ज करें',
    portalSubtitle: 'सिविकओएस AI आपकी शिकायत को समझकर तुरंत सही नगर निगम विभाग को सौंपता है।',
    reportIssue: 'नई शिकायत दर्ज करें',
    languageSelect: 'भाषा चुनें / Select Language',
    photoUploadTitle: 'समस्या की फोटो संलग्न करें',
    photoUploadSubtitle: 'फोटो खींचें या छवि फ़ाइल चुनें (JPG, PNG)',
    dragOrClickPhoto: 'फोटो अपलोड करने के लिए क्लिक करें या यहाँ खींचें',
    changePhoto: 'फोटो बदलें',
    removePhoto: 'हटाएं',
    presetPhotosLabel: 'या त्वरित परीक्षण हेतु नमूना फोटो चुनें:',
    presetPothole: 'गहरा गड्ढा (मुख्य मार्ग)',
    presetGarbage: 'कचरे का ढेर (स्कूल के पास)',
    presetLight: 'खराब स्ट्रीट लाइट (अंधेरी गली)',
    presetWater: 'पानी की पाइप लाइन फूटी',
    presetDrain: 'जाम नाली / सीवरेज',
    presetSignal: 'खराब ट्रैफिक सिग्नल',
    issueDescriptionLabel: 'समस्या का विवरण लिखें',
    issueDescriptionPlaceholder: 'उदा. अस्पताल के मुख्य गेट के पास गहरा गड्ढा है जिससे रात में वाहन फिसल रहे हैं...',
    voiceButton: 'आवाज़ से दर्ज करें',
    videoButton: 'वीडियो अपलोड',
    comingSoon: 'शीघ्र उपलब्ध',
    locationLabel: 'स्थान एवं वार्ड',
    locationPlaceholder: 'सड़क, सेक्टर, लैंडमार्क या पता दर्ज करें',
    useCurrentLocation: 'GPS स्थान का उपयोग करें',
    detectingLocation: 'स्थान खोजा जा रहा है...',
    locationDetected: 'GPS स्थान प्राप्त हुआ',
    selectWard: 'वार्ड / ज़ोन चुनें',
    landmarkLabel: 'निकटतम लैंडमार्क / पहचान बिंदु',
    landmarkPlaceholder: 'उदा. सिविल अस्पताल गेट नं 2 के सामने, मेट्रो पिलर 104',
    submitButton: 'AI इंजन को शिकायत भेजें',
    submittingText: 'Gemini AI द्वारा विश्लेषण जारी...',
    aiAnalyzingHeader: 'AI मल्टीमॉडल विश्लेषण जारी है',
    aiStep1: 'Gemini विज़न द्वारा फोटो का विश्लेषण...',
    aiStep2: 'नागरिक खतरे के प्रकार एवं गंभीरता की पहचान...',
    aiStep3: '4-कारक प्राथमिकता सूचकांक (0-100) की गणना...',
    aiStep4: 'संबंधित नगर निगम विभाग को आवंटन एवं SLA निर्धारण...',
    receiptTitle: 'नागरिक शिकायत आधिकारिक रसीद',
    receiptSubtitle: 'आपकी शिकायत दर्ज कर ली गई है और फील्ड टीम को निर्देश जारी कर दिए गए हैं।',
    trackingIdLabel: 'शिकायत ट्रैकिंग संख्या',
    issueTypeLabel: 'पहचानी गई समस्या',
    severityLabel: 'गंभीरता स्तर',
    priorityScoreLabel: 'AI प्राथमिकता स्कोर',
    departmentLabel: 'आवंटित विभाग',
    locationReceiptLabel: 'दर्ज स्थान',
    slaLabel: 'निवारण समय सीमा (SLA)',
    riskFactorsLabel: 'पहचाने गए जोखिम कारक',
    suggestedActionLabel: 'फील्ड टीम कार्रवाई आदेश',
    reportAnotherBtn: 'एक और समस्या दर्ज करें',
    viewDashboardBtn: 'सरकारी डैशबोर्ड देखें',
    printReceiptBtn: 'रसीद प्रिंट / सुरक्षित करें',
    statusLabel: 'वर्तमान स्थिति',
    scoreHeuristicNotice: 'स्कोर गणना: गंभीरता (40%), अस्पताल/स्कूल निकटता (20%), सड़क यातायात (20%), जनता प्रभाव (20%)।',
    switchRoleLabel: 'दृश्य बदलें:',
    scanQrNotice: '10 सेकंड में समस्या दर्ज करने के लिए QR कोड स्कैन करें।',
    citizenPortalNav: 'नागरिक पोर्टल',
    govDashboardNav: 'सरकारी डैशबोर्ड',
    qrPosterNav: 'QR पोस्टर / शेयर',
  },
  pa: {
    portalTitle: 'ਨਾਗਰਿਕ ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ',
    portalSubtitle: 'ਸਿਵਿਕਓਐਸ AI ਤੁਹਾਡੀ ਸ਼ਿਕਾਇਤ ਨੂੰ ਸਮਝ ਕੇ ਤੁਰੰਤ ਸਹੀ ਨਗਰ ਨਿਗਮ ਵਿਭਾਗ ਨੂੰ ਭੇਜਦਾ ਹੈ।',
    reportIssue: 'ਨਵੀਂ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
    languageSelect: 'ਭਾਸ਼ਾ ਚੁਣੋ / Select Language',
    photoUploadTitle: 'ਸਮੱਸਿਆ ਦੀ ਫੋਟੋ ਲਗਾਓ',
    photoUploadSubtitle: 'ਫੋਟੋ ਖਿੱਚੋ ਜਾਂ ਫਾਈਲ ਚੁਣੋ (JPG, PNG)',
    dragOrClickPhoto: 'ਫੋਟੋ ਅਪਲੋਡ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ ਜਾਂ ਇੱਥੇ ਖਿੱਚੋ',
    changePhoto: 'ਫੋਟੋ ਬਦਲੋ',
    removePhoto: 'ਹਟਾਓ',
    presetPhotosLabel: 'ਜਾਂ ਟੈਸਟ ਲਈ ਨਮੂਨਾ ਫੋਟੋ ਚੁਣੋ:',
    presetPothole: 'ਡੂੰਘਾ ਖੱਡਾ (ਮੁੱਖ ਸੜਕ)',
    presetGarbage: 'ਕੂੜੇ ਦਾ ਢੇਰ (ਸਕੂਲ ਨੇੜੇ)',
    presetLight: 'ਖਰਾਬ ਸਟਰੀਟ ਲਾਈਟ (ਹਨੇਰੀ ਗਲੀ)',
    presetWater: 'ਪਾਣੀ ਦੀ ਪਾਈਪ ਲੀਕ',
    presetDrain: 'ਬੰਦ ਨਾਲੀ / ਸੀਵਰੇਜ',
    presetSignal: 'ਖਰਾਬ ਟ੍ਰੈਫਿਕ ਸਿਗਨਲ',
    issueDescriptionLabel: 'ਸਮੱਸਿਆ ਦਾ ਵੇਰਵਾ ਲਿਖੋ',
    issueDescriptionPlaceholder: 'ਉਦਾ. ਸਿਵਲ ਹਸਪਤਾਲ ਗੇਟ ਨੇੜੇ ਸੜਕ ਤੇ ਡੂੰਘਾ ਖੱਡਾ ਹੈ ਜਿਸ ਨਾਲ ਹਾਦਸੇ ਦਾ ਡਰ ਹੈ...',
    voiceButton: 'ਆਵਾਜ਼ ਰਾਹੀਂ ਰਿਪੋਰਟ',
    videoButton: 'ਵੀਡੀਓ ਅਪਲੋਡ',
    comingSoon: 'ਜਲਦ ਆ ਰਿਹਾ ਹੈ',
    locationLabel: 'ਸਥਾਨ ਅਤੇ ਵਾਰਡ',
    locationPlaceholder: 'ਸੜਕ, ਸੈਕਟਰ, ਜਾਂ ਪਤਾ ਲਿਖੋ',
    useCurrentLocation: 'GPS ਲੋਕੇਸ਼ਨ ਵਰਤੋ',
    detectingLocation: 'ਲੋਕੇਸ਼ਨ ਲੱਭੀ ਜਾ ਰਹੀ ਹੈ...',
    locationDetected: 'GPS ਲੋਕੇਸ਼ਨ ਮਿਲ ਗਈ',
    selectWard: 'ਵਾਰਡ / ਜ਼ੋਨ ਚੁਣੋ',
    landmarkLabel: 'ਨੇੜਲਾ ਲੈਂਡਮਾਰਕ / ਪਛਾਣ ਬਿੰਦੂ',
    landmarkPlaceholder: 'ਉਦਾ. ਮਾਡਲ ਟਾਊਨ ਸਕੂਲ ਦੇ ਸਾਹਮਣੇ, ਮੈਟਰੋ ਪਿੱਲਰ 15',
    submitButton: 'AI ਇੰਜਣ ਨੂੰ ਸ਼ਿਕਾਇਤ ਭੇਜੋ',
    submittingText: 'Gemini AI ਦੁਆਰਾ ਜਾਂਚ ਜਾਰੀ...',
    aiAnalyzingHeader: 'AI ਮਲਟੀਮੋਡਲ ਜਾਂਚ ਜਾਰੀ ਹੈ',
    aiStep1: 'Gemini ਵਿਜ਼ਨ ਦੁਆਰਾ ਫੋਟੋ ਦੀ ਜਾਂਚ...',
    aiStep2: 'ਸਮੱਸਿਆ ਦੀ ਕਿਸਮ ਅਤੇ ਗੰਭੀਰਤਾ ਦੀ ਪਛਾਣ...',
    aiStep3: '4-ਕਾਰਕ ਤਰਜੀਹ ਸਕੋਰ (0-100) ਦੀ ਗਣਨਾ...',
    aiStep4: 'ਸੰਬੰਧਿਤ ਨਿਗਮ ਵਿਭਾਗ ਨੂੰ ਸੌਂਪਣਾ ਅਤੇ ਸਮਾਂ ਸੀਮਾ...',
    receiptTitle: 'ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤ ਅਧਿਕਾਰਤ ਰਸੀਦ',
    receiptSubtitle: 'ਤੁਹਾਡੀ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰ ਲਈ ਗਈ ਹੈ ਅਤੇ ਫੀਲਡ ਟੀਮ ਨੂੰ ਕਾਰਵਾਈ ਲਈ ਭੇਜ ਦਿੱਤੀ ਗਈ ਹੈ।',
    trackingIdLabel: 'ਟਰੈਕਿੰਗ ਆਈਡੀ',
    issueTypeLabel: 'ਪਛਾਣੀ ਗਈ ਸਮੱਸਿਆ',
    severityLabel: 'ਗੰਭੀਰਤਾ ਪੱਧਰ',
    priorityScoreLabel: 'AI ਤਰਜੀਹ ਸਕੋਰ',
    departmentLabel: 'ਸੌਂਪਿਆ ਗਿਆ ਵਿਭਾਗ',
    locationReceiptLabel: 'ਦਰਜ ਸਥਾਨ',
    slaLabel: 'ਹੱਲ ਕਰਨ ਦਾ ਟੀਚਾ ਸਮਾਂ (SLA)',
    riskFactorsLabel: 'ਪਛਾਣੇ ਗਏ ਖ਼ਤਰੇ',
    suggestedActionLabel: 'ਫੀਲਡ ਟੀਮ ਕਾਰਵਾਈ ਹੁਕਮ',
    reportAnotherBtn: 'ਹੋਰ ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ',
    viewDashboardBtn: 'ਸਰਕਾਰੀ ਡੈਸ਼ਬੋਰਡ ਦੇਖੋ',
    printReceiptBtn: 'ਰਸੀਦ ਪ੍ਰਿੰਟ ਕਰੋ',
    statusLabel: 'ਮੌਜੂਦਾ ਸਥਿਤੀ',
    scoreHeuristicNotice: 'ਸਕੋਰ ਫਾਰਮੂਲਾ: ਖ਼ਤਰਾ (40%), ਸਕੂਲ/ਹਸਪਤਾਲ ਨੇੜਤਾ (20%), ਟ੍ਰੈਫਿਕ (20%), ਲੋਕਾਂ ਤੇ ਅਸਰ (20%)।',
    switchRoleLabel: 'ਦ੍ਰਿਸ਼ ਬਦਲੋ:',
    scanQrNotice: '10 ਸਕਿੰਟਾਂ ਵਿੱਚ ਸਮੱਸਿਆ ਰਿਪੋਰਟ ਕਰਨ ਲਈ QR ਕੋਡ ਸਕੈਨ ਕਰੋ।',
    citizenPortalNav: 'ਨਾਗਰਿਕ ਪੋਰਟਲ',
    govDashboardNav: 'ਸਰਕਾਰੀ ਡੈਸ਼ਬੋਰਡ',
    qrPosterNav: 'QR ਪੋਸਟਰ / ਸ਼ੇਅਰ',
  },
};
