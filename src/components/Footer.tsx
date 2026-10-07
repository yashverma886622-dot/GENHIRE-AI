import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Video, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg">
                G
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Gen<span className="text-blue-600">Hire</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 ml-1"></span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              India's first AI-native creator marketplace connecting forward-thinking brands and creative agencies with verified generative video directors and visual artists.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-flex">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Commercial Usage Clearance</span>
            </div>
          </div>

          {/* Core Hubs in India */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Creator Hubs
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>Mumbai — Fashion & Luxury Cinema</li>
              <li>Bengaluru — EV, Tech & Animation</li>
              <li>Delhi NCR — Streetwear & Sci-Fi VFX</li>
              <li>Hyderabad — Sensory Food & Beverage</li>
              <li>Chennai — Beauty & Fragrance Films</li>
              <li>Pune & Kolkata — Kinetics & Heritage</li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/discover" className="hover:text-blue-600">
                  Discover AI Creators
                </Link>
              </li>
              <li>
                <Link to="/brand/briefs/new" className="hover:text-blue-600 flex items-center space-x-1">
                  <span>AI Brief Builder</span>
                  <span className="text-[10px] text-purple-600 bg-purple-50 px-1 rounded font-bold">New</span>
                </Link>
              </li>
              <li>
                <Link to="/discover?contentType=Fashion+Film" className="hover:text-blue-600">
                  AI Fashion Films (9:16)
                </Link>
              </li>
              <li>
                <Link to="/discover?contentType=Video+Ad" className="hover:text-blue-600">
                  Commercial Video Ads (16:9)
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Toolchains Verified */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Verified Toolchains
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Runway Gen-3
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                Midjourney v6
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                Flux.1 Pro
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
                Kling AI 1.5
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Luma Ray 2
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                ComfyUI LoRAs
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              *Tool verification signals reflect platform-audited proof of generation licenses and raw timeline project files.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 GenHire India Technologies. All payments in INR (₹). All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>Deterministic 100-Point Matching</span>
            <span>•</span>
            <span>Playable HTML5 MP4 Portfolios</span>
            <span>•</span>
            <span>Commercial Rights Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
