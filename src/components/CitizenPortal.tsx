import React, { useState, useRef } from 'react';
import { Language, Complaint, AIAnalysisResult } from '../types';
import { translations } from '../i18n/translations';
import { PRESET_SCENARIOS, MUNICIPAL_WARDS, PresetScenario } from '../data/seedData';
import { addComplaint } from '../utils/storage';
import {
  Camera,
  UploadCloud,
  MapPin,
  Mic,
  Video,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Trash2,
  Navigation,
  Loader2,
  Layers,
  ArrowRight,
  Info,
  Building
} from 'lucide-react';

interface CitizenPortalProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onComplaintSubmitted: (complaint: Complaint) => void;
  onSwitchToDashboard: () => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  language,
  onLanguageChange,
  onComplaintSubmitted,
  onSwitchToDashboard,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('Ward 14 - Civil Lines');
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // AI Submission & Progress State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [aiStep, setAiStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Handle Photo File Pick
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('Image size should be less than 8MB');
        return;
      }
      setErrorMsg('');
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotoDataUrl(result);
        setSelectedPresetId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop photo
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoDataUrl(event.target?.result as string);
        setSelectedPresetId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset scenario selection
  const handleSelectPreset = (preset: PresetScenario) => {
    setSelectedPresetId(preset.id);
    setPhotoDataUrl(preset.photoUrl);
    
    // Choose appropriate language text
    if (language === 'hi') {
      setDescription(preset.suggestedTextHi);
    } else if (language === 'pa') {
      setDescription(preset.suggestedTextPa);
    } else {
      setDescription(preset.suggestedText);
    }

    setAddress(preset.location);
    setLandmark(preset.landmark);
    setSelectedWard(preset.ward);
    setErrorMsg('');
  };

  // Geolocation trigger
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setGpsCoordinates({ lat, lng });
        setIsLocating(false);
        setLocationSuccessMsg(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        
        if (!address) {
          setAddress(`Civic GPS Position (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        // Fallback default city center coordinates for testing
        setGpsCoordinates({ lat: 28.6139, lng: 77.209 });
        setLocationSuccessMsg('GPS approximated (Municipal Grid)');
        if (!address) {
          setAddress('Central Municipal Ward');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Submit Complaint to Server / Gemini AI
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() && !photoDataUrl) {
      setErrorMsg('Please provide a photo or brief description of the civic problem.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setAiStep(1);

    const stepInterval = setInterval(() => {
      setAiStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 650);

    try {
      const response = await fetch('/api/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          imageBase64: photoDataUrl,
          language: language === 'hi' ? 'Hindi' : language === 'pa' ? 'Punjabi' : 'English',
          locationText: `${address} ${landmark ? `(Landmark: ${landmark})` : ''} [${selectedWard}]`,
        }),
      });

      clearInterval(stepInterval);
      setAiStep(4);

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Analysis failed');
      }

      const aiData: AIAnalysisResult = result.data;
      const trackingNum = Math.floor(1000 + Math.random() * 9000);
      const trackingId = `CIV-2026-${trackingNum}`;
      
      const selectedWardObj = MUNICIPAL_WARDS.find((w) => w.id === selectedWard);
      const zoneName = selectedWardObj?.zone || 'Central Zone';

      const newComplaint: Complaint = {
        id: trackingId,
        createdAt: new Date().toISOString(),
        citizenLanguage: language,
        rawDescription: description || `Photo reported civic issue [${aiData.issue_type}]`,
        photoUrl: photoDataUrl,
        location: {
          address: address || `${selectedWard}, City Central`,
          ward: selectedWard,
          zone: zoneName,
          landmark: landmark || undefined,
          latitude: gpsCoordinates?.lat || selectedWardObj?.lat || 28.6139,
          longitude: gpsCoordinates?.lng || selectedWardObj?.lng || 77.209,
        },
        aiAnalysis: aiData,
        status: 'Open',
        assignedDepartment: aiData.suggested_department,
        assignedCrew: `${aiData.suggested_department} Response Unit #${Math.floor(Math.random() * 8) + 1}`,
        source: 'web_portal',
        history: [
          {
            timestamp: new Date().toISOString(),
            status: 'Open',
            updatedBy: 'CivicOS Gemini Engine',
            note: `Issue classified as ${aiData.issue_type} with Priority Score ${aiData.priority_score}/100 (${aiData.priority_bucket}). Auto-assigned to ${aiData.suggested_department}.`,
          },
        ],
      };

      // Add to shared storage
      addComplaint(newComplaint);

      // Transition to Receipt view
      setTimeout(() => {
        setIsSubmitting(false);
        onComplaintSubmitted(newComplaint);
      }, 500);

    } catch (err: any) {
      clearInterval(stepInterval);
      setIsSubmitting(false);
      console.error('Submission error:', err);
      setErrorMsg('Failed to process complaint with AI. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Title & Subtitle */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Citizen Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t.portalTitle}
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
            {t.portalSubtitle}
          </p>

          {/* Language Pills Bar */}
          <div className="mt-4 inline-flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 px-2 font-medium">Language:</span>
            <button
              type="button"
              id="citizen-lang-en"
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                language === 'en' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
            <button
              type="button"
              id="citizen-lang-hi"
              onClick={() => onLanguageChange('hi')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                language === 'hi' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              id="citizen-lang-pa"
              onClick={() => onLanguageChange('pa')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                language === 'pa' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ਪੰਜਾਬੀ
            </button>
          </div>
        </div>

        {/* Preset Civic Scenarios for 1-Click Testing */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              {t.presetPhotosLabel}
            </span>
            <span className="text-[11px] text-teal-400 font-medium">1-Click Test</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_SCENARIOS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  id={`preset-${preset.id}`}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-950/70 border-teal-500 text-teal-200 ring-1 ring-teal-500 shadow-md'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-semibold text-slate-100 line-clamp-1">
                    {t[preset.titleKey] || preset.defaultTitle}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{preset.department.replace(' Department', '')}</span>
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-teal-400 ml-1 shrink-0" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Complaint Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/90 p-5 sm:p-7 rounded-2xl border border-slate-800 shadow-xl">
          
          {/* Photo Upload Zone */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-teal-400" />
                {t.photoUploadTitle}
              </span>
              <span className="text-xs font-normal text-slate-400">Photo / Evidence</span>
            </label>

            {photoDataUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950/60 group">
                <img
                  src={photoDataUrl}
                  alt="Civic Issue Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 text-xs font-semibold hover:bg-teal-400 flex items-center gap-1.5"
                  >
                    <UploadCloud className="w-4 h-4" />
                    {t.changePhoto}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoDataUrl('');
                      setSelectedPresetId(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-600/90 text-white text-xs font-semibold hover:bg-red-500 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t.removePhoto}
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-teal-300 font-mono border border-slate-700">
                  Ready for Gemini Vision Multimodal Inspection
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-teal-500/80 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-900/60 group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-teal-500/20 text-slate-400 group-hover:text-teal-400 flex items-center justify-center mx-auto mb-3 transition-colors">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-300 group-hover:text-white">
                  {t.dragOrClickPhoto}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {t.photoUploadSubtitle}
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Description Input + Voice / Video Coming Soon */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="issue-description" className="text-sm font-semibold text-slate-200">
                {t.issueDescriptionLabel}
              </label>

              {/* Voice and Video Coming Soon Stubs */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  id="btn-voice-stub"
                  onClick={() => setErrorMsg('Voice recording input is coming soon in the next municipal release.')}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-colors border border-slate-700/80"
                  title="Voice Input (Coming Soon)"
                >
                  <Mic className="w-3 h-3 text-teal-400" />
                  <span className="hidden sm:inline">{t.voiceButton}</span>
                  <span className="text-[10px] text-teal-400 font-mono ml-0.5">Soon</span>
                </button>

                <button
                  type="button"
                  id="btn-video-stub"
                  onClick={() => setErrorMsg('Video reporting is coming soon in the next municipal release.')}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-colors border border-slate-700/80"
                  title="Video Upload (Coming Soon)"
                >
                  <Video className="w-3 h-3 text-sky-400" />
                  <span className="hidden sm:inline">{t.videoButton}</span>
                  <span className="text-[10px] text-sky-400 font-mono ml-0.5">Soon</span>
                </button>
              </div>
            </div>

            <textarea
              id="issue-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.issueDescriptionPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
            />
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              Tip: Mention nearby hospitals, schools, or busy roads to help Gemini prioritize urgency.
            </p>
          </div>

          {/* Location & Ward Selector */}
          <div className="space-y-3 pt-1 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-400" />
                {t.locationLabel}
              </label>

              {/* GPS Geolocation Button */}
              <button
                type="button"
                id="btn-get-location"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-all disabled:opacity-50"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-teal-400" />
                    <span>{t.detectingLocation}</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3 h-3 text-teal-400" />
                    <span>{gpsCoordinates ? t.locationDetected : t.useCurrentLocation}</span>
                  </>
                )}
              </button>
            </div>

            {/* GPS Feedback Pill if captured */}
            {locationSuccessMsg && (
              <div className="px-3 py-1.5 rounded-lg bg-teal-950/50 border border-teal-700/60 text-teal-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  GPS Geo-lock: {locationSuccessMsg}
                </span>
                <span className="text-[10px] uppercase font-mono text-teal-400">Verified</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="input-address" className="text-xs text-slate-400 mb-1 block">Street / Address</label>
                <input
                  id="input-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t.locationPlaceholder}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="select-ward" className="text-xs text-slate-400 mb-1 block">{t.selectWard}</label>
                <select
                  id="select-ward"
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {MUNICIPAL_WARDS.filter(w => w.id !== 'all').map((ward) => (
                    <option key={ward.id} value={ward.id}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="input-landmark" className="text-xs text-slate-400 mb-1 block">{t.landmarkLabel}</label>
              <input
                id="input-landmark"
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={t.landmarkPlaceholder}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            id="btn-submit-complaint"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-teal-500/25 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.submittingText}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{t.submitButton}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* AI Multimodal Analysis Progress Overlay Modal */}
        {isSubmitting && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-teal-500/40 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">{t.aiAnalyzingHeader}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Gemini 3.7 Flash Multimodal Civic Reasoning
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-3 text-xs">
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                  aiStep >= 1 ? 'bg-teal-950/40 border-teal-500/60 text-teal-200' : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}>
                  {aiStep > 1 ? <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> : <Loader2 className="w-4 h-4 animate-spin text-teal-400 shrink-0" />}
                  <span>{t.aiStep1}</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                  aiStep >= 2 ? 'bg-teal-950/40 border-teal-500/60 text-teal-200' : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}>
                  {aiStep > 2 ? <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> : aiStep === 2 ? <Loader2 className="w-4 h-4 animate-spin text-teal-400 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />}
                  <span>{t.aiStep2}</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                  aiStep >= 3 ? 'bg-teal-950/40 border-teal-500/60 text-teal-200' : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}>
                  {aiStep > 3 ? <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> : aiStep === 3 ? <Loader2 className="w-4 h-4 animate-spin text-teal-400 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />}
                  <span>{t.aiStep3}</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                  aiStep >= 4 ? 'bg-teal-950/40 border-teal-500/60 text-teal-200' : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}>
                  {aiStep >= 4 ? <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />}
                  <span>{t.aiStep4}</span>
                </div>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-400 to-sky-400 h-full transition-all duration-300"
                  style={{ width: `${(aiStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Quick Switch */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={onSwitchToDashboard}
            className="text-xs text-slate-400 hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Municipal official or inspector?</span>
            <span className="underline font-semibold text-teal-400">Open Government Dashboard →</span>
          </button>
        </div>

      </div>
    </div>
  );
};
