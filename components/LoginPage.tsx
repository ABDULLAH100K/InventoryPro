import React, { useState } from 'react';
import { Key, Loader2, ShieldCheck, Terminal } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // KeyAuth Credentials from your snippet (Displayed for branding/info)
  const APP_NAME = "ABDULLAH FAST PANEL";
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulating KeyAuth connection delay
    // In a real web env, you would fetch() to an API, but KeyAuth is typically C#/C++
    // We simulate the "Success" response here.
    setTimeout(() => {
      if (licenseKey.length < 4) {
        setError('Invalid License Key format.');
        setIsLoading(false);
      } else {
        // Success
        setIsLoading(false);
        onLogin();
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-950/50 p-6 border-b border-slate-700 text-center relative">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
           <div className="w-16 h-16 bg-indigo-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 ring-1 ring-indigo-500/50">
              <ShieldCheck className="text-indigo-400 w-8 h-8" />
           </div>
           <h1 className="text-2xl font-bold text-white tracking-tight">{APP_NAME}</h1>
           <p className="text-slate-400 text-xs font-mono mt-1">v1.0 • Secure Access</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Key size={14} />
                License Key
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="w-full bg-slate-900/80 border border-slate-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono text-sm placeholder-slate-600 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Terminal size={18} />
                  Login Session
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-950/30 p-4 border-t border-slate-700 text-center">
          <p className="text-[10px] text-slate-500 font-mono">
            Status: <span className="text-emerald-400">Online</span> | Protection: <span className="text-indigo-400">Active</span>
          </p>
        </div>
      </div>
    </div>
  );
};