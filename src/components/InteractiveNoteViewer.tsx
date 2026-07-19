/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  BookOpen, Eye, ArrowRight, MessageSquare, Sparkles, Send, HelpCircle, 
  Search, ZoomIn, ZoomOut, CheckCircle, ChevronLeft, ChevronRight, Award, Flame, Download,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MedicalNote } from "../types";

interface InteractiveNoteViewerProps {
  purchasedNotes: MedicalNote[];
}

export const InteractiveNoteViewer: React.FC<InteractiveNoteViewerProps> = ({ purchasedNotes }) => {
  const [selectedNote, setSelectedNote] = useState<MedicalNote | null>(purchasedNotes[0] || null);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);

  // Security DRM Protection States
  const [isScreenBlurred, setIsScreenBlurred] = useState(false);
  const [showScreenshotAlert, setShowScreenshotAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Security listeners to block screenshot/record mechanisms
  useEffect(() => {
    // 1. Monitor focus loss to blur the screen when snip tools or recorders open
    const handleBlur = () => {
      setIsScreenBlurred(true);
    };
    const handleFocus = () => {
      setIsScreenBlurred(false);
    };

    // 2. Intercept keyboard keys representing screenshot, print, save, DevTools
    const handleKeyDown = (e: KeyboardEvent) => {
      // Print screen key
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        e.preventDefault();
        triggerAlert("Screenshot Attempt Blocked! Clipboard cleared under DMCA.");
        navigator.clipboard.writeText("STETHONOTES DRM SECURE AREA: UNAUTHORIZED SCREEN CAPTURE PREVENTED");
      }

      // Print: Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        triggerAlert("Direct printing is restricted. Read documents securely within our DRM container.");
      }

      // Save: Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        triggerAlert("Offline saving is protected by active digital signatures.");
      }

      // Inspect/DevTools hotkeys: F12, Ctrl+Shift+I, Cmd+Option+I, Cmd+Option+J, Ctrl+Shift+C
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "C" || e.key === "c" || e.key === "J" || e.key === "j")) ||
        ((e.metaKey || e.ctrlKey) && e.altKey && (e.key === "i" || e.key === "I" || e.key === "j" || e.key === "J"))
      ) {
        e.preventDefault();
        triggerAlert("Developer tools disabled in premium study reader.");
      }
    };

    const triggerAlert = (msg: string) => {
      setAlertMessage(msg);
      setShowScreenshotAlert(true);
      setTimeout(() => setShowScreenshotAlert(false), 4500);
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("keydown", handleKeyDown);

    // Prevent context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerAlert("Context menu disabled in secure study reader.");
    };
    document.addEventListener("contextmenu", handleContextMenu);

    // Prevent text copying/cutting
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerAlert("Copy-paste is restricted to protect peer authors.");
    };
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
    };
  }, []);

  // Chatbot states
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello Doc! I am your StethoNotes AI Study Copilot. Ask me anything about the selected notes, or type 'quiz' to test your recall!" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Term Lookup states
  const [termQuery, setTermQuery] = useState("");
  const [termDefinition, setTermDefinition] = useState("");

  const medicalGlossary: Record<string, string> = {
    mediastinum: "The central compartment of the thoracic cavity surrounded by loose connective tissue, containing all thoracic viscera except the lungs (heart, thymus, esophagus, trachea, thoracic duct, great vessels).",
    coronary: "Relating to the arteries that surround and supply heart muscles with oxygenated blood. Coronary artery blockage leads to angina or myocardial infarction.",
    gpcr: "G-Protein Coupled Receptors. A large family of cell surface receptors that detect molecules outside the cell and activate cellular response pathways.",
    ballotable: "Capable of being pushed back and forth. In obstetrics, a ballotable head during vaginal examination indicates the presenting part is floating and not yet fully engaged in the pelvic inlet.",
    partogram: "A graphic recording of progress of labor, including cervical dilation, fetal heart rate, and strength/duration of contractions over time, to detect delayed or obstructed labor.",
    miosis: "Intense constriction of the pupil of the eye, commonly caused by organophosphorus poisoning, parasympathetic over-activation, or opioids."
  };

  const handleGlossaryLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = termQuery.trim().toLowerCase();
    if (!query) return;

    if (medicalGlossary[query]) {
      setTermDefinition(medicalGlossary[query]);
    } else {
      setTermDefinition(`No instant match for "${termQuery}". StethoNotes covers NMC concepts. Try searching "Mediastinum", "GPCR", "Ballotable", or "Miosis".`);
    }
  };

  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedNote) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    // Simulated chatbot responses based on note subject
    setTimeout(() => {
      let response = "That is an excellent clinical query. StethoNotes is here to analyze this concept based on gold medalist textbooks.";
      
      const queryLower = userText.toLowerCase();
      if (queryLower.includes("quiz") || queryLower.includes("test")) {
        response = `Here is a high recall question for ${selectedNote.subject}: "${selectedNote.subject === 'Anatomy' ? 'What are the main contents of the posterior mediastinum?' : 'What is the acronym SLUDGEM used to describe?'}" Type your answer below!`;
      } else if (queryLower.includes("mediastinum") || queryLower.includes("Louis")) {
        response = "The Sternal Angle of Louis is at the level of T4/T5. It divides the superior and inferior mediastinum, marks the bifurcation of trachea, and the arch of aorta.";
      } else if (queryLower.includes("gpcr") || queryLower.includes("mad")) {
        response = "Remember the 'MAD 2s' mnemonic! Muscarinic M2, Alpha-2, and Dopamine D2 are all Gi coupled, meaning they inhibit cAMP levels.";
      } else if (queryLower.includes("leopold") || queryLower.includes("palpation")) {
        response = "Leopold Maneuvers consist of four manual checks: 1st (Fundal Grip), 2nd (Lateral Grip), 3rd (Pawlik's Grip for engagement), and 4th (Deep Pelvic Grip for flexion).";
      }

      setChatMessages((prev) => [...prev, { sender: "bot", text: response }]);
    }, 1000);
  };

  // Safe fallback if notes lists is empty
  if (purchasedNotes.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-4" id="empty-library-view">
        <div className="mx-auto h-16 w-16 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-400">
          <BookOpen className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 font-display">No documents in your library</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Unlock premium notes instantly using our checkout simulation. Once purchased, they will pop up right here as a rich study experience.
        </p>
      </div>
    );
  }

  // Handle setting active notes correctly
  const activeNote = selectedNote || purchasedNotes[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="library-companion-section">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* COL 1: Library Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Academic Vault</span>
            <div className="space-y-2">
              {purchasedNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    setSelectedNote(note);
                    setCurrentPage(0);
                  }}
                  className={`flex w-full items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    activeNote.id === note.id
                      ? "border-sky-500 bg-sky-50/20 text-sky-900 font-bold"
                      : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <BookOpen className="h-4.5 w-4.5 text-sky-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">{note.title}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{note.pages} pages • {note.subject}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Study Goal Tracker</span>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Flame className="h-4.5 w-4.5 text-amber-500 fill-amber-300 animate-bounce" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900">4 Day Active Recall Streak</span>
                <span className="text-[10px] text-slate-400 font-semibold">Keep studying to lock down memory!</span>
              </div>
            </div>
          </div>
        </div>

        {/* COL 2 & 3: Main HD PDF Document Reader */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[520px]">
            
            {/* Reader Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 truncate max-w-[220px]">
                  {activeNote.title}
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                  HD-PDF
                </span>
              </div>

              {/* Zoom controls */}
              <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg p-1">
                <button
                  onClick={() => setZoom((z) => Math.max(75, z - 25))}
                  className="p-1 rounded text-slate-500 hover:bg-white transition-all hover:text-slate-900"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="text-[10px] font-bold font-mono px-1.5 text-slate-600">{zoom}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(150, z + 25))}
                  className="p-1 rounded text-slate-500 hover:bg-white transition-all hover:text-slate-900"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Rendered Document Page */}
            <div className="flex-1 overflow-y-auto bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start justify-center relative shadow-inner select-none">
              
              {/* Repeating Anti-Piracy Watermark Grid */}
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.05] flex flex-wrap justify-center items-center gap-12 z-10 font-mono text-[9px] font-bold text-slate-800 rotate-[-15deg] scale-110">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="whitespace-nowrap select-none">
                    STETHONOTES DRM • sb108750@gmail.com • IP DETECTED • NO COPY
                  </div>
                ))}
              </div>

              <div 
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }} 
                className="w-full transition-transform duration-200 max-w-md select-none pointer-events-none"
              >
                {/* Dynamically render unlocked sample contents */}
                <div dangerouslySetInnerHTML={{ __html: activeNote.samplePages[currentPage] || "" }} />
              </div>

              {/* StethoShield Blur Overlay */}
              {isScreenBlurred && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center select-none">
                  <Shield className="h-10 w-10 text-sky-400 animate-pulse mb-3" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    StethoShield Security Active
                  </h4>
                  <p className="text-[10px] text-slate-400 max-w-xs mt-1 leading-relaxed">
                    Study reader blurred to protect digital content. Click back inside the workspace to resume studying.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Previous Page
              </button>
              
              <span className="text-xs font-bold text-slate-500 font-mono">
                Page {currentPage + 1} of {activeNote.samplePages.length}
              </span>

              <button
                disabled={currentPage === activeNote.samplePages.length - 1}
                onClick={() => setCurrentPage((p) => Math.min(activeNote.samplePages.length - 1, p + 1))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
              >
                Next Page <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>

          {/* Quick PDF download button */}
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800">
            <span className="font-semibold">Need a hard-copy printout? Download HD PDF</span>
            <a
              href={`data:text/plain,STETHONOTES_LIBRARY_DOWNLOAD_${activeNote.id}`}
              download={`stethonotes_${activeNote.subject.toLowerCase()}_printable.pdf`}
              className="bg-white hover:bg-slate-50 text-emerald-700 font-bold px-3.5 py-1.5 rounded-lg border border-emerald-100 transition-all flex items-center gap-1 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" /> Print-Ready PDF
            </a>
          </div>
        </div>

        {/* COL 4: Smart Dictionary Lookup & AI Chatbot Companion */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Clinical Dictionary Lookup */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Terms Lookup</span>
            
            <form onSubmit={handleGlossaryLookup} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. mediastinum, miosis..."
                value={termQuery}
                onChange={(e) => setTermQuery(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-slate-900 text-white font-bold px-2.5 py-1.5 rounded-xl text-xs hover:bg-slate-800 transition-all"
              >
                Go
              </button>
            </form>

            {termDefinition && (
              <p className="text-[11px] text-slate-600 bg-slate-50 border border-slate-100 p-2.5 rounded-xl leading-relaxed">
                {termDefinition}
              </p>
            )}
          </div>

          {/* AI Companion Chat */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-[300px]">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2">
              <Sparkles className="h-4 w-4 text-sky-500 animate-spin-slow" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Study Copilot</span>
            </div>

            {/* Chat message threads */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[190px]">
              {chatMessages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`p-2.5 rounded-xl text-[11px] leading-relaxed max-w-[85%] ${
                    msg.sender === "bot" 
                      ? "bg-slate-50 border border-slate-100 text-slate-700 mr-auto" 
                      : "bg-sky-50 text-sky-900 ml-auto"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleChatSend} className="flex gap-1.5 pt-2 border-t border-slate-100 mt-2">
              <input
                type="text"
                placeholder="Ask clinical queries..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] focus:border-sky-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-sky-600 text-white p-1.5 rounded-lg hover:bg-sky-500 transition-all shadow-sm flex items-center justify-center shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* Dynamic StethoShield Anti-Piracy Threat Alert */}
      <AnimatePresence>
        {showScreenshotAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/95 backdrop-blur-md border border-rose-500/30 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-white max-w-sm"
          >
            <Shield className="h-6 w-6 text-rose-400 shrink-0 animate-bounce" />
            <div className="text-left">
              <span className="text-xs font-black text-rose-300 uppercase block tracking-wider">StethoShield DRM Shield</span>
              <span className="text-[11px] text-rose-100 font-medium block mt-0.5">{alertMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
