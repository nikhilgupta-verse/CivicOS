import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Printer,
  Copy,
  Check,
  Download,
  Building2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Camera,
  Share2
} from 'lucide-react';

interface QrShareViewProps {
  onSwitchToCitizenPortal: () => void;
}

export const QrShareView: React.FC<QrShareViewProps> = ({
  onSwitchToCitizenPortal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [targetUrl, setTargetUrl] = useState<string>('');

  useEffect(() => {
    // Construct dynamic report URL based on current host/origin
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://civicos.app';
    const fullReportUrl = `${origin}?view=report`;
    setTargetUrl(fullReportUrl);

    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        fullReportUrl,
        {
          width: 320,
          margin: 2,
          color: {
            dark: '#020617', // slate-950
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        },
        (error) => {
          if (error) console.error('QR generation error:', error);
        }
      );
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CivicOS-Municipal-Report-QR.png';
      a.click();
    }
  };

  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Intro */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <QrCode className="w-3.5 h-3.5" />
            <span>Public Access & Field Deployment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            CivicOS Citizen Access Poster & QR
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Print and deploy this official municipal poster on street lampposts, bus stops, community centers, and notice boards.
          </p>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
          <button
            id="btn-print-poster"
            onClick={handlePrintPoster}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Poster (A4 / Letter)</span>
          </button>

          <button
            id="btn-download-qr"
            onClick={handleDownloadQr}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Download High-Res QR PNG</span>
          </button>

          <button
            id="btn-copy-link"
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Copied URL!' : 'Copy Direct Link'}</span>
          </button>
        </div>

        {/* The Official Printable Poster Frame */}
        <div
          id="civic-official-poster"
          className="bg-white text-slate-950 p-6 sm:p-10 rounded-3xl border-4 border-slate-900 shadow-2xl space-y-6 text-center print:border-none print:shadow-none print:p-4"
        >
          {/* Municipal Header Branding */}
          <div className="border-b-2 border-slate-900 pb-5 space-y-2">
            <div className="inline-flex items-center justify-center space-x-2.5 px-4 py-1.5 rounded-full bg-slate-900 text-white font-extrabold text-xs uppercase tracking-widest">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>MUNICIPAL CORPORATION & CITIZEN SERVICES</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-950">
              CivicOS Citizen Portal
            </h2>

            <p className="text-sm font-bold text-teal-700">
              AI-Powered Rapid Governance & Municipal Issue Resolution
            </p>
          </div>

          {/* Primary Slogan & Instructions */}
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
              "Scan to report a civic issue in 10 seconds."
            </div>
            <p className="text-xs font-bold text-slate-600">
              10 सेकंड में समस्या दर्ज करें · 10 ਸਕਿੰਟਾਂ ਵਿੱਚ ਸਮੱਸਿਆ ਰਿਪੋਰਟ ਕਰੋ
            </p>
          </div>

          {/* Center QR Canvas Card */}
          <div className="inline-block p-4 sm:p-6 bg-slate-50 border-2 border-dashed border-slate-900 rounded-3xl shadow-inner my-2">
            <canvas ref={canvasRef} className="mx-auto rounded-xl shadow-md max-w-full" />
            <div className="mt-3 text-xs font-mono font-bold text-slate-800">
              Direct Citizen Access Point
            </div>
          </div>

          {/* 3-Step Simple Graphic Icons */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto text-center border-t border-slate-200">
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-black text-sm flex items-center justify-center mx-auto">
                1
              </div>
              <p className="text-xs font-bold text-slate-900">Scan QR Code</p>
              <p className="text-[10px] text-slate-500">Open mobile camera</p>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 font-black text-sm flex items-center justify-center mx-auto">
                2
              </div>
              <p className="text-xs font-bold text-slate-900">Snap Photo</p>
              <p className="text-[10px] text-slate-500">Attach civic issue</p>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 font-black text-sm flex items-center justify-center mx-auto">
                3
              </div>
              <p className="text-xs font-bold text-slate-900">AI Auto-Routes</p>
              <p className="text-[10px] text-slate-500">Crew dispatched</p>
            </div>
          </div>

          {/* Supported Issues List */}
          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>• Potholes & Broken Roads</span>
            <span>• Garbage Dumps</span>
            <span>• Streetlights Offline</span>
            <span>• Water Pipe Leaks</span>
            <span>• Blocked Drains</span>
            <span>• Traffic Signal Faults</span>
          </div>

          {/* Poster Footer / Target URL */}
          <div className="pt-3 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2 font-mono">
            <span>Official Portal: {targetUrl}</span>
            <span className="font-bold text-slate-900">GOVT AI HELPLINE · 24x7</span>
          </div>

        </div>

        {/* Direct Link Preview */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs print:hidden">
          <div className="space-y-0.5">
            <span className="text-slate-400 block font-medium">Auto-configured App URL destination:</span>
            <span className="text-teal-400 font-mono select-all break-all">{targetUrl}</span>
          </div>

          <button
            onClick={onSwitchToCitizenPortal}
            className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ml-3"
          >
            <span>Open in Browser</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
