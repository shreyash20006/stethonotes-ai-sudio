/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, ShieldCheck, Mail, KeyRound, Copy, Check, 
  Terminal, Server, HelpCircle, ChevronRight, PlayCircle, 
  Settings, Layers, BookOpen, User, ShoppingBag, Star, 
  AlertTriangle, ArrowRightLeft, Sparkles, Code, LogIn, LogOut, Send, RefreshCw
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

export const IntegrationCenter: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"auth" | "brevo" | "guide">("auth");
  
  // Auth state
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Brevo state
  const [testEmail, setTestEmail] = useState("");
  const [testName, setTestName] = useState("");
  const [testNoteTitle, setTestNoteTitle] = useState("High-Yield Cardiovascular Anatomy Notes");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailResponse, setEmailResponse] = useState<any>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Load active session from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSessionUser(session?.user ?? null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSessionUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Handle actual Google Login via Supabase
  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) {
      // Simulate OAuth redirect
      setIsAuthenticating(true);
      setTimeout(() => {
        setSessionUser({
          id: "usr-mock-google-101",
          email: "medical-student@gmail.com",
          user_metadata: {
            full_name: "Dr. Alex Carter (Mock User)",
            avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=alex",
            phone: "+91 98765 43210"
          }
        });
        setIsAuthenticating(false);
      }, 1000);
      return;
    }

    try {
      setIsAuthenticating(true);
      setAuthError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || "An error occurred during Google Auth redirection.");
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSessionUser(null);
  };

  // Dispatch live transactional email via backend Brevo API proxy
  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    setIsSendingEmail(true);
    setEmailResponse(null);
    setEmailError(null);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          toEmail: testEmail,
          toName: testName || "Medic Creator",
          subject: `📚 Your Order is Ready: ${testNoteTitle} - StethoNotes`,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px; border-radius: 12px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #0284c7; font-size: 24px; margin-bottom: 5px;">StethoNotes</h1>
                <p style="color: #64748b; font-size: 12px; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">Notes That Diagnose Doubts</p>
              </div>
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #0f172a; margin-top: 0;">Hello ${testName || 'Future Doctor'},</h3>
                <p style="color: #334155; line-height: 1.6; font-size: 14px;">
                  Thank you for purchasing the high-yield premium medical study materials on StethoNotes! Your note is now unlocked and ready for download:
                </p>
                <div style="background-color: #ffffff; padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px; margin: 15px 0;">
                  <strong style="color: #0f172a; font-size: 15px;">${testNoteTitle}</strong>
                  <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">Format: PDF • Interactive Board Companion Ready</p>
                </div>
                <p style="color: #334155; font-size: 13px; line-height: 1.6;">
                  You can access your purchases at any time from your interactive <strong>My Library</strong> panel in StethoNotes.
                </p>
              </div>
              <div style="text-align: center; color: #94a3b8; font-size: 11px;">
                <p>© 2026 StethoNotes Inc. Cloud-Native Workspace. All Rights Reserved.</p>
              </div>
            </div>
          `
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to dispatch email.");
      }

      setEmailResponse(data);
    } catch (err: any) {
      setEmailError(err.message || "Unable to dispatch SMTP test email.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/85 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full" id="integration-center-container">
      
      {/* Header Panel */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold text-sky-700 uppercase tracking-tight">
            <Settings className="h-3.5 w-3.5 animate-spin-slow" />
            <span>Developer Integration Hub</span>
          </div>
          <h3 className="text-lg font-black tracking-tight text-slate-900 font-display">
            Google Login & Brevo Mail Sandbox
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Test and configure OAuth Google Identity, active Supabase connections, and transactional email distribution via Brevo.
          </p>
        </div>

        {/* Live configuration badges */}
        <div className="flex gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
            isSupabaseConfigured 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}>
            <Database className="h-3 w-3" />
            <span>Supabase: {isSupabaseConfigured ? "CONNECTED" : "DEMO MODE"}</span>
          </span>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex border-b border-slate-100 bg-white/70 overflow-x-auto scrollbar-none shrink-0">
        <button
          onClick={() => setActiveTab("auth")}
          className={`flex items-center gap-2 px-6 py-4.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "auth"
              ? "border-slate-950 text-slate-950 bg-slate-50/20"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/40"
          }`}
        >
          <LogIn className="h-4 w-4 text-indigo-500" />
          <span>Google Identity & Supabase Auth</span>
        </button>
        <button
          onClick={() => setActiveTab("brevo")}
          className={`flex items-center gap-2 px-6 py-4.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "brevo"
              ? "border-slate-950 text-slate-950 bg-slate-50/20"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/40"
          }`}
        >
          <Mail className="h-4 w-4 text-sky-500" />
          <span>Brevo SMTP Email Sandbox</span>
        </button>
        <button
          onClick={() => setActiveTab("guide")}
          className={`flex items-center gap-2 px-6 py-4.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "guide"
              ? "border-slate-950 text-slate-950 bg-slate-50/20"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/40"
          }`}
        >
          <Code className="h-4 w-4 text-amber-500" />
          <span>Integration Code & Guides</span>
        </button>
      </div>

      {/* Body View Container */}
      <div className="flex-grow p-6 sm:p-8 bg-white overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Google login and Supabase Status */}
          {activeTab === "auth" && (
            <motion.div
              key="auth-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Auth Control Block */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Session Status</span>
                    
                    {sessionUser ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={sessionUser.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg?seed=user"} 
                            alt="User Profile" 
                            className="h-12 w-12 rounded-full border-2 border-indigo-500 bg-white"
                          />
                          <div>
                            <span className="text-xs font-black text-slate-900 block">
                              {sessionUser.user_metadata?.full_name || sessionUser.email.split("@")[0]}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[200px]">
                              {sessionUser.email}
                            </span>
                          </div>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>Successfully signed in! Role: Student</span>
                        </div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 transition-all cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout Session</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {!isSupabaseConfigured ? (
                            <span className="text-amber-600 font-medium block mb-2">
                              💡 Supabase is currently running in Demo Mode. Clicking "Sign In with Google" will instantly simulate a successful credential hand-off.
                            </span>
                          ) : (
                            "Use Google Single Sign-On to dynamically log into your medical profile using your Google Workspace credential."
                          )}
                        </p>

                        <button
                          onClick={handleGoogleLogin}
                          disabled={isAuthenticating}
                          className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold py-3 transition-all cursor-pointer shadow-xs"
                        >
                          {isAuthenticating ? (
                            <RefreshCw className="h-4 w-4 text-slate-500 animate-spin" />
                          ) : (
                            <img 
                              src="https://res.cloudinary.com/dsqxboxoc/image/upload/v1784459424/google-icon_lpxf8r.png"
                              alt="Google G"
                              className="h-4.5 w-4.5 object-contain"
                            />
                          )}
                          <span>{isAuthenticating ? "Connecting Google OAuth..." : "Sign in with Google"}</span>
                        </button>

                        {authError && (
                          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-700">
                            {authError}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Warning on Demo Mode */}
                  {!isSupabaseConfigured && (
                    <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4.5 flex gap-3 text-amber-900">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold block">Developer Credentials Missing</span>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          To deploy live Google Login and store profiles, you must define <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in the environment secrets panel within Google AI Studio.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Google Sign In Configuration Diagram */}
                <div className="lg:col-span-7 border border-slate-100 rounded-2xl p-5.5 space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Google Identity Pipeline Workflow</span>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">1</div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">User triggers Sign In</span>
                        <span className="text-[11px] text-slate-500 block leading-relaxed">
                          Client dispatches <code>supabase.auth.signInWithOAuth()</code> requesting Google provider access.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">2</div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Google Consent Redirection</span>
                        <span className="text-[11px] text-slate-500 block leading-relaxed">
                          User consents to share email and profile on secure Google OAuth window, returning code payload back to Supabase.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">3</div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Automatic SQL Profile Trigger</span>
                        <span className="text-[11px] text-slate-500 block leading-relaxed">
                          Supabase fires the <code>on_auth_user_created</code> trigger creating a row in <code>public.profiles</code> dynamically with student default tier.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-dashed border-slate-150 rounded-xl p-4 bg-slate-50/30 text-xs space-y-1 mt-4">
                    <span className="font-extrabold text-slate-800">Authorized Redirect URI Configuration:</span>
                    <p className="text-slate-500 text-[11px] font-mono select-all bg-white px-2 py-1 border border-slate-200 rounded mt-1 break-all">
                      {window.location.origin}/auth/v1/callback
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Copy this callback URL into your Google Cloud API Credentials Authorized Redirect URIs panel.</p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: Brevo Email Sandbox */}
          {activeTab === "brevo" && (
            <motion.div
              key="brevo-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Sandbox Email Form */}
                <form onSubmit={handleSendTestEmail} className="lg:col-span-5 space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">SMTP Transaction Sandbox</span>
                  
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">RECIPIENT EMAIL</label>
                      <input 
                        type="email"
                        required
                        placeholder="e.g. medicalstudent@gmail.com"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">RECIPIENT NAME (OPTIONAL)</label>
                      <input 
                        type="text"
                        placeholder="e.g. Dr. Ananya"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">PURCHASED NOTE ATTACHMENT COVER</label>
                      <select
                        value={testNoteTitle}
                        onChange={(e) => setTestNoteTitle(e.target.value)}
                        className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:border-sky-500 focus:outline-none bg-white"
                      >
                        <option value="High-Yield Cardiovascular Anatomy Notes">High-Yield Cardiovascular Anatomy Notes</option>
                        <option value="Clinical Pharmacology Mnemonic Playbook">Clinical Pharmacology Mnemonic Playbook</option>
                        <option value="Obstetrics & Gynecology Rapid Revision Blueprint">Obstetrics & Gynecology Rapid Revision Blueprint</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingEmail}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 text-xs font-bold py-3 transition-all cursor-pointer shadow-sm"
                    >
                      {isSendingEmail ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-slate-300" />
                          <span>Dispatching Brevo SMTP...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 text-slate-200" />
                          <span>Send Test Delivery Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Live Console Output Log */}
                <div className="lg:col-span-7 flex flex-col h-full space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Sandbox API Server Console</span>
                  
                  <div className="flex-grow rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-inner min-h-[220px] font-mono text-[11px] text-slate-300 relative overflow-hidden flex flex-col justify-between">
                    
                    {/* Header bar */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/5 text-[10px] text-slate-500 font-mono">
                      <span>POST /api/send-email</span>
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>

                    {/* Main content console display */}
                    <div className="py-4 overflow-y-auto max-h-[220px] text-slate-400 space-y-2">
                      {isSendingEmail && (
                        <p className="text-sky-400 animate-pulse font-mono">&gt; Preparing mail delivery metadata... Querying transaction servers...</p>
                      )}

                      {emailResponse && (
                        <div className="space-y-2 font-mono">
                          <p className="text-emerald-400 font-semibold">&gt; Response Code 200 OK</p>
                          <pre className="text-slate-300 bg-white/5 rounded p-3 select-all overflow-x-auto text-[10px]">
                            {JSON.stringify(emailResponse, null, 2)}
                          </pre>
                        </div>
                      )}

                      {emailError && (
                        <div className="space-y-2 font-mono">
                          <p className="text-rose-400 font-semibold">&gt; Delivery Error (Code 500/400)</p>
                          <pre className="text-rose-300 bg-rose-950/40 border border-rose-900/40 rounded p-3 text-[10px] whitespace-pre-wrap">
                            {emailError}
                          </pre>
                        </div>
                      )}

                      {!isSendingEmail && !emailResponse && !emailError && (
                        <div className="text-slate-500 text-center py-6">
                          <Terminal className="h-8 w-8 mx-auto text-slate-700 mb-2" />
                          <p>&gt; Ready for email dispatch simulation...</p>
                          <p className="text-[10px] mt-1 text-slate-600">Enter a recipient on the left and dispatch a live transaction log.</p>
                        </div>
                      )}
                    </div>

                    {/* Footer bar */}
                    <div className="text-[10px] text-slate-500 border-t border-white/5 pt-2 text-right">
                      Node.js 20+ Runtime • Express v4
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: Code Templates & Developer guides */}
          {activeTab === "guide" && (
            <motion.div
              key="guide-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 sm:p-6 space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Vite Client-Side Authentication Hook</span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Call the OAuth provider payload inside your React component to execute Google authentication flows with automated profile generation:
                </p>

                <div className="bg-slate-900 rounded-xl p-4.5 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto space-y-1.5">
                  <span className="text-slate-500">// Trigger Google OAuth redirect flow</span>
                  <br />
                  <span className="text-sky-400">const</span> handleGoogleLogin = <span className="text-sky-400">async</span> () =&gt; {"{"}
                  <br />
                  &nbsp;&nbsp;<span className="text-sky-400">const</span> {"{"} error {"}"} = <span className="text-sky-400">await</span> supabase.auth.signInWithOAuth({"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;provider: <span className="text-emerald-400">'google'</span>,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;options: {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;redirectTo: <span className="text-amber-400">window.location.origin</span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;{"}"});
                  <br />
                  {"}"};
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 sm:p-6 space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Express Server-Side Brevo SMTP Proxy</span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Server-side endpoint routing designed to securely execute SMTP transactions with Sendinblue / Brevo SMTP servers without exposing API keys:
                </p>

                <div className="bg-slate-900 rounded-xl p-4.5 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto space-y-1.5">
                  <span className="text-slate-500">// Dispatch Transactional Email</span>
                  <br />
                  <span className="text-sky-400">const</span> response = <span className="text-sky-400">await</span> fetch(<span className="text-emerald-400">'https://api.brevo.com/v3/smtp/email'</span>, {"{"}
                  <br />
                  &nbsp;&nbsp;method: <span className="text-emerald-400">'POST'</span>,
                  <br />
                  &nbsp;&nbsp;headers: {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">'api-key'</span>: process.env.BREVO_API_KEY,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">'Content-Type'</span>: <span className="text-emerald-400">'application/json'</span>
                  <br />
                  &nbsp;&nbsp;{"}"},
                  <br />
                  &nbsp;&nbsp;body: JSON.stringify({"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;sender: {"{"} email: <span className="text-emerald-400">'deliveries@stethonotes.com'</span>, name: <span className="text-emerald-400">'StethoNotes'</span> {"}"},
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;to: [{"{"} email: recipientEmail {"}"}],
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;subject: <span className="text-emerald-400">'Your Medical Notes PDF'</span>
                  <br />
                  &nbsp;&nbsp;{"}"})
                  <br />
                  {"}"});
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};
