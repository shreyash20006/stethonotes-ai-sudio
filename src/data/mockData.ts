/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MedicalNote, Flashcard, SellerAnalytics } from "../types";

export const mockNotes: MedicalNote[] = [
  {
    id: "note-1",
    title: "Anatomy of the Mediastinum & Coronary Circulation",
    price: 249,
    originalPrice: 499,
    rating: 4.9,
    reviewCount: 142,
    pages: 45,
    subject: "Anatomy",
    year: "1st Prof",
    category: "Handwritten",
    tags: ["Thorax", "Coronary", "Mediastinum", "AIIMS High-Yield"],
    downloads: 1240,
    description: "Highly illustrated, color-coded notes covering the divisions of the mediastinum, its boundaries, contents, and the extensive details of coronary blood supply and cardiac veins. Includes high-yield clinical correlations (e.g., angina pectoris, myocardial infarction, and coronary bypass grafts).",
    highlights: [
      "Full-color hand-drawn schematics of the superior and inferior mediastinum.",
      "Laminated-style charts for branches of the coronary arteries (dominant & non-dominant patterns).",
      "Mnemonics for the contents of the posterior mediastinum.",
      "University exam PYQ focus boxes (2018-2025 AIIMS, MAMC, KGMU)."
    ],
    diagramCount: 12,
    samplePages: [
      `
      <div class="p-6 bg-amber-50/50 border border-amber-200/50 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-rose-500 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">Page 1: Mediastinal Divisions</div>
        <div class="border-b border-amber-200/40 pb-3 mb-4">
          <h4 class="text-sm font-mono text-amber-800 tracking-wider">STETHONOTES EXCLUSIVE • ANATOMY SERIES</h4>
          <h2 class="text-xl font-display font-bold text-amber-950 mt-1">Mediastinum Boundaries & Content</h2>
        </div>
        <div class="space-y-4 text-xs text-amber-900 leading-relaxed font-sans">
          <p class="italic text-amber-800 font-medium mb-2">Definition: The interpleural space in the thorax. It is divided by an imaginary plane passing from the <span class="underline decoration-amber-500 decoration-2">Sternal Angle (of Louis)</span> to the lower border of the <span class="underline decoration-amber-500 decoration-2">T4 vertebra</span>.</p>
          
          <div class="grid grid-cols-2 gap-4 mt-2">
            <div class="bg-white/80 p-3 rounded-lg border border-amber-200/60">
              <span class="font-bold text-rose-800 text-[11px] uppercase tracking-wider">1. Superior Mediastinum</span>
              <p class="mt-1 text-[11px] leading-relaxed">
                • <strong>Ant:</strong> Manubrium sterni<br/>
                • <strong>Post:</strong> Upper 4 thoracic vertebrae (T1-T4)<br/>
                • <strong>Contents:</strong> Trachea, Esophagus, Arch of Aorta, Brachiocephalic veins, SVC, Vagus & Phrenic nerves, Thymus.
              </p>
            </div>
            <div class="bg-white/80 p-3 rounded-lg border border-amber-200/60">
              <span class="font-bold text-rose-800 text-[11px] uppercase tracking-wider">2. Inferior Mediastinum</span>
              <p class="mt-1 text-[11px] leading-relaxed">
                Divided by the pericardium into:<br/>
                • <strong>Anterior:</strong> Sternopericardial ligs, internal thoracic nodes.<br/>
                • <strong>Middle:</strong> Heart, Ascending Aorta, lower SVC, Phrenic nerves.<br/>
                • <strong>Posterior:</strong> Descending Aorta, Esophagus, Azygos vein, Thoracic duct, Vagus.
              </p>
            </div>
          </div>

          <div class="mt-4 border-t border-amber-200/40 pt-3">
            <h5 class="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
              <span class="w-2 h-2 rounded-full bg-rose-500"></span> Clinical Correlation: Sternal Angle Significance
            </h5>
            <p class="text-[11px] text-amber-900/95 mt-1">
              Marked by a transverse ridge 5cm below the suprasternal notch. Critical landmark for: 1. Rib counting (2nd costal cartilage), 2. Division of superior and inferior mediastinum, 3. Arch of aorta starts & ends, 4. Trachea bifurcates, 5. Pulmonary trunk divides.
            </p>
          </div>
        </div>
      </div>
      `,
      `
      <div class="p-6 bg-amber-50/50 border border-amber-200/50 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-rose-500 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">Page 2: Coronary Anatomy</div>
        <div class="border-b border-amber-200/40 pb-3 mb-4">
          <h4 class="text-sm font-mono text-amber-800 tracking-wider">STETHONOTES EXCLUSIVE • CARDIAC ANATOMY</h4>
          <h2 class="text-xl font-display font-bold text-amber-950 mt-1">Coronary Artery Supply Schematic</h2>
        </div>
        
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <div class="flex-1 text-xs text-amber-900 space-y-2">
            <p class="font-bold text-rose-800">Right Coronary Artery (RCA) Course:</p>
            <p class="text-[11px]">Arises from anterior aortic sinus → descends in right anterior coronary sulcus → winds around lower border → reaches posterior interventricular groove.</p>
            
            <p class="font-bold text-rose-800 mt-2">Left Coronary Artery (LCA) Course:</p>
            <p class="text-[11px]">Arises from left posterior aortic sinus → short trunk → divides into Left Anterior Descending (LAD) [aka "The Widowmaker"] & Circumflex artery (Cx).</p>
            
            <p class="font-bold text-amber-950 mt-2">Cardiac Dominance:</p>
            <p class="text-[11px] bg-white/60 p-2 rounded border border-amber-200/60">
              Determined by which artery gives off the <strong>Posterior Interventricular Artery (PIA)</strong>.<br/>
              • Right Dominant: ~85% (from RCA)<br/>
              • Left Dominant: ~8% (from LCA Circumflex)<br/>
              • Codominant: ~7%
            </p>
          </div>
          
          <div class="w-full md:w-48 h-48 bg-white rounded-lg border border-amber-200 flex items-center justify-center p-2 relative shadow-inner">
            <!-- Simulated heart schematic via beautiful vector style CSS -->
            <svg viewBox="0 0 100 100" class="w-full h-full text-red-500">
              <path d="M50 20 C20 10 10 40 50 85 C90 40 80 10 50 20 Z" fill="#FEE2E2" stroke="#EF4444" stroke-width="2"/>
              <!-- Aorta -->
              <path d="M45 22 C45 10 55 10 55 22" fill="none" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/>
              <!-- RCA -->
              <path d="M48 28 Q35 32 30 50 Q30 65 42 70" fill="none" stroke="#EF4444" stroke-dasharray="2 1" stroke-width="1.5" stroke-linecap="round"/>
              <!-- LCA & LAD -->
              <path d="M52 28 Q65 32 60 55 Q50 70 48 80" fill="none" stroke="#B91C1C" stroke-width="2" stroke-linecap="round"/>
              <!-- Circumflex -->
              <path d="M52 28 Q62 25 70 38" fill="none" stroke="#7F1D1D" stroke-width="1.5" stroke-linecap="round"/>
              <text x="50" y="52" font-family="sans-serif" font-size="6" font-weight="bold" fill="#B91C1C" text-anchor="middle">COR (Heart)</text>
              <text x="22" y="32" font-family="sans-serif" font-size="5" fill="#EF4444">RCA</text>
              <text x="74" y="38" font-family="sans-serif" font-size="5" fill="#7F1D1D">Cx</text>
              <text x="65" y="60" font-family="sans-serif" font-size="5" fill="#B91C1C">LAD</text>
            </svg>
          </div>
        </div>
      </div>
      `
    ],
    author: {
      id: "auth-1",
      name: "Dr. Aditya Sen",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=aditya",
      university: "AIIMS Delhi, Batch of 2021",
      verified: true,
      rating: 4.95,
      salesCount: 3840,
      bio: "MBBS Intern at AIIMS Delhi. Gold medalist in First Prof Anatomy. Passionate about rendering clinical visual maps that break down complex anatomy into intuitive pathways."
    },
    reviews: [
      {
        id: "r-1",
        userName: "Srinidhi K.",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=srinidhi",
        rating: 5,
        date: "2026-06-15",
        comment: "Literally scored a gold medal in Anatomy at KGMU partly because of Aditya's cardiac notes! The hand-drawn coronary anatomy schematics are far better than Netter or Gray's for university exam writing.",
        verifiedPurchase: true
      },
      {
        id: "r-2",
        userName: "Rohan Mehra",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=rohan",
        rating: 4,
        date: "2026-07-02",
        comment: "Excellent flowcharts. The boundaries table is really easy to memorize. Wish there was a section on mediastinal tumors though. Highly recommended!",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "note-2",
    title: "High-Yield Pharmacology Mnemonics & Mechanism of Action Maps",
    price: 199,
    originalPrice: 399,
    rating: 4.8,
    reviewCount: 218,
    pages: 62,
    subject: "Pharmacology",
    year: "2nd Prof",
    category: "Revision Notes",
    tags: ["Autonomic Nervous System", "Antihypertensives", "Antibiotics", "Mnemonics"],
    downloads: 2450,
    description: "An incredibly comprehensive revision book that turns dense medical pharmacology into easy-to-remember visual loops. Over 150 clinical mnemonics covering the ANS, cardiac drugs, central nervous system agents, antimicrobial agents, and chemotherapy regimens.",
    highlights: [
      "Dynamic flowcharts tracing signal transduction (G-protein coupled receptors, etc.).",
      "One-page tables for drug of choice for 100+ critical medical emergencies.",
      "High-recall visual mnemonics for adverse drug reactions (e.g., Amiodarone side effects).",
      "Quick-fire side-effects summaries ideal for NEXT / NEET-PG / USMLE prep."
    ],
    diagramCount: 8,
    samplePages: [
      `
      <div class="p-6 bg-slate-900 text-slate-100 border border-slate-800 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">Page 1: G-Protein Signals</div>
        <div class="border-b border-slate-800 pb-3 mb-4">
          <h4 class="text-sm font-mono text-emerald-400 tracking-wider">PHARMACOLOGY COGNITIVE MAP</h4>
          <h2 class="text-xl font-display font-bold text-white mt-1">GPCR Subtypes: Q, I, S (QIs)</h2>
        </div>
        <div class="space-y-3 text-xs leading-relaxed">
          <p class="text-slate-300">Memory Hack: <span class="text-emerald-400 font-bold">HAVe 1 & 2 M&Ms</span> or <span class="text-emerald-400 font-bold">QIQ SSS QIQ</span></p>
          
          <div class="space-y-2 mt-2 font-mono text-[11px]">
            <div class="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span class="text-rose-400 font-bold">Gq Coupled (Phospholipase C → IP3/DAG → Ca2+):</span>
              <p class="text-slate-300 mt-1">
                • <strong>Receptors:</strong> <span class="bg-rose-950/40 text-rose-300 px-1 rounded">M1, M3, alpha-1, H1, V1</span><br/>
                • <strong>Mnemonic:</strong> <em>HAV 1 M&M (H1, A1, V1, M1, M3)</em> - All of these are 1s!
              </p>
            </div>
            
            <div class="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span class="text-blue-400 font-bold">Gi Coupled (Inhibits Adenylyl Cyclase → Decreases cAMP):</span>
              <p class="text-slate-300 mt-1">
                • <strong>Receptors:</strong> <span class="bg-blue-950/40 text-blue-300 px-1 rounded">M2, alpha-2, D2</span><br/>
                • <strong>Mnemonic:</strong> <em>MAD 2s (M2, A2, D2)</em> - All of these are 2s!
              </p>
            </div>

            <div class="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span class="text-yellow-400 font-bold">Gs Coupled (Stimulates Adenylyl Cyclase → Increases cAMP):</span>
              <p class="text-slate-300 mt-1">
                • <strong>Receptors:</strong> <span class="bg-yellow-950/40 text-yellow-300 px-1 rounded">Beta-1, Beta-2, Beta-3, D1, H2, V2</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      `
    ],
    author: {
      id: "auth-2",
      name: "Dr. Meenakshi Iyer",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=meenakshi",
      university: "Madras Medical College, Batch of 2020",
      verified: true,
      rating: 4.88,
      salesCount: 5120,
      bio: "Resident Physician and top content creator. Known for simplifying drug targets and mechanisms into rapid-recall flowcharts. 99th percentile in NEET-PG Pharmacology."
    },
    reviews: [
      {
        id: "r-3",
        userName: "Pranav Shah",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=pranav",
        rating: 5,
        date: "2026-05-10",
        comment: "This is a masterpiece! Pharmacology used to give me nightmares but Meenakshi's Gq/Gi/Gs MAD 2s mnemonic cleared up my concepts in minutes. Essential buy for 2nd MBBS students.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "note-3",
    title: "Pathology Systematic Slides & Practical Identification Manual",
    price: 179,
    originalPrice: 349,
    rating: 4.7,
    reviewCount: 94,
    pages: 54,
    subject: "Pathology",
    year: "2nd Prof",
    category: "Practical Files",
    tags: ["Histopathology", "Haematology", "Slides Identification", "Viva Guide"],
    downloads: 980,
    description: "A comprehensive practical workbook showcasing high-resolution hand-illustrated sketches of histopathology slides and haematology smears. Features exact labeling, identification points, viva-voce questions, and microscopic highlights expected in practical board exams.",
    highlights: [
      "Exact side-by-side microscopic view vs labeled hand diagram representation.",
      "Key identification features ('Peculiar' structures, pathognomonic findings like Reed-Sternberg cells).",
      "Comprehensive haematology smear interpretation charts.",
      "High-yield list of past practical viva questions asked by external examiners."
    ],
    diagramCount: 40,
    samplePages: [
      `
      <div class="p-6 bg-rose-50/50 border border-rose-200/50 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-red-500 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">Page 18: Reed-Sternberg Cells</div>
        <div class="border-b border-rose-200/40 pb-3 mb-4">
          <h4 class="text-sm font-mono text-rose-800 tracking-wider">HISTOPATHOLOGY EXAMINATION KEY</h4>
          <h2 class="text-xl font-display font-bold text-rose-950 mt-1">Hodgkin's Lymphoma - RS Cell</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="text-xs text-rose-900 space-y-2">
            <h5 class="font-bold text-rose-950 text-sm">Diagnostic Criteria:</h5>
            <p class="text-[11px] bg-white/70 p-2.5 rounded-lg border border-rose-200/60 leading-relaxed">
              1. <strong>"Owl-Eye" Appearance:</strong> Large, binucleated cell with prominent, acidophilic, nucleolus-like inclusions surrounded by a clear halo.<br/>
              2. <strong>Immunophenotype:</strong> CD15+, CD30+, CD45- (classic Hodgkin's).<br/>
              3. <strong>Background:</strong> Rich reactive background of lymphocytes, plasma cells, eosinophils (attracted by IL-5 secreted by RS cells).
            </p>
            <div class="mt-2 text-[10px] text-rose-800 font-mono">
              ★ Viva Tip: RS cell is required but NOT sufficient for diagnosis. It can rarely appear in infectious mononucleosis!
            </div>
          </div>
          
          <div class="bg-white rounded-xl border border-rose-200 p-3 flex flex-col items-center justify-center shadow-inner">
            <svg viewBox="0 0 100 100" class="w-32 h-32">
              <!-- Background cellularity -->
              <circle cx="20" cy="20" r="4" fill="#DDD6FE" opacity="0.6"/>
              <circle cx="80" cy="15" r="5" fill="#DDD6FE" opacity="0.6"/>
              <circle cx="85" cy="80" r="3" fill="#DDD6FE" opacity="0.6"/>
              <circle cx="15" cy="75" r="4" fill="#DDD6FE" opacity="0.6"/>
              
              <!-- Giant RS Cell -->
              <circle cx="50" cy="50" r="28" fill="#FCE7F3" stroke="#DB2777" stroke-width="1.5"/>
              <!-- Bi-lobed Nucleus -->
              <path d="M40 50 Q45 35 52 40 Q55 50 48 55 Q40 52 40 50" fill="#C084FC" stroke="#7C3AED" stroke-width="1.2"/>
              <path d="M60 50 Q55 65 48 60 Q45 50 52 45 Q60 48 60 50" fill="#C084FC" stroke="#7C3AED" stroke-width="1.2"/>
              <!-- Prominent Nucleoli -->
              <circle cx="46" cy="46" r="4" fill="#E11D48"/>
              <circle cx="54" cy="54" r="4" fill="#E11D48"/>
            </svg>
            <span class="text-[10px] text-rose-800 font-mono mt-1 font-bold">Classic RS Cell ("Owl Eye")</span>
          </div>
        </div>
      </div>
      `
    ],
    author: {
      id: "auth-3",
      name: "Dr. Sana Fatima",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=sana",
      university: "Maulana Azad Medical College (MAMC)",
      verified: true,
      rating: 4.75,
      salesCount: 1980,
      bio: "MBBS Gold Medalist in Pathology and Microbiology. Creator of 'The Labeled Histopath' series, designed to help students confidently ace board slide-exams."
    },
    reviews: [
      {
        id: "r-4",
        userName: "Vikas Dubey",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vikas",
        rating: 4,
        date: "2026-06-20",
        comment: "Excellent diagrams. Really helped in drawing the practical record file cleanly. Identification points are concise and exam-focused.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "note-4",
    title: "Obstetrics & Gynecology Clinical Case Taking & OSCE Guide",
    price: 299,
    originalPrice: 599,
    rating: 4.95,
    reviewCount: 173,
    pages: 78,
    subject: "OBGYN",
    year: "Final Prof",
    category: "Clinical Cases",
    tags: ["OSCE", "Case Presentation", "Antenatal Record", "Labor Room"],
    downloads: 1890,
    description: "The ultimate guide to clinical case presentations in OBGYN. Contains step-by-step histories, physical examination checklists, abdominal palpation techniques, labor progress tracking (Partogram), and management of high-risk pregnancies (Preeclampsia, Gestational Diabetes, Breech presentation). Perfect for clinical postings and OSCE exams.",
    highlights: [
      "20 fully worked-out clinical case sheets of actual patients with model presentations.",
      "Clear illustrations showing Leopold's maneuvers for fetal lie and presentation.",
      "A complete guide to reading and filling out a World Health Organization Partograph.",
      "Viva checklists for instruments (Forceps, Ventouse, Speculums) and suturing."
    ],
    diagramCount: 15,
    samplePages: [
      `
      <div class="p-6 bg-cyan-50/50 border border-cyan-200/50 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-cyan-600 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">Page 32: Leopold Maneuvers</div>
        <div class="border-b border-cyan-200/40 pb-3 mb-4">
          <h4 class="text-sm font-mono text-cyan-800 tracking-wider">OBSTETRICS CLINICAL SKILLS HANDBOOK</h4>
          <h2 class="text-xl font-display font-bold text-cyan-950 mt-1">Obstetric Palpation (Leopold's)</h2>
        </div>
        <div class="space-y-4 text-xs text-cyan-900 leading-relaxed">
          <p class="font-medium text-cyan-950">Performed after 28 weeks of gestation. Patient lies supine with knees slightly flexed.</p>
          
          <div class="grid grid-cols-2 gap-3 font-sans">
            <div class="bg-white/80 p-3 rounded-lg border border-cyan-200/60">
              <span class="font-bold text-cyan-800 text-[10px] uppercase tracking-wider block">1st Maneuver (Fundal Grip)</span>
              <p class="mt-1 text-[10px] leading-normal text-cyan-900">
                To determine which fetal pole is in the fundus.<br/>
                • Head: Hard, round, ballotable.<br/>
                • Breech: Soft, irregular, non-ballotable.
              </p>
            </div>
            
            <div class="bg-white/80 p-3 rounded-lg border border-cyan-200/60">
              <span class="font-bold text-cyan-800 text-[10px] uppercase tracking-wider block">2nd Maneuver (Lateral Grip)</span>
              <p class="mt-1 text-[10px] leading-normal text-cyan-900">
                To locate the fetal back and limbs.<br/>
                • Back: Smooth, firm, convex resistance.<br/>
                • Limbs: Small, irregular, mobile knobs.
              </p>
            </div>

            <div class="bg-white/80 p-3 rounded-lg border border-cyan-200/60">
              <span class="font-bold text-cyan-800 text-[10px] uppercase tracking-wider block">3rd Maneuver (Pawlik's Grip)</span>
              <p class="mt-1 text-[10px] leading-normal text-cyan-900">
                To determine the presenting part at pelvic inlet & check engagement.<br/>
                • Grip lower pole of uterus with thumb and fingers of one hand.
              </p>
            </div>

            <div class="bg-white/80 p-3 rounded-lg border border-cyan-200/60">
              <span class="font-bold text-cyan-800 text-[10px] uppercase tracking-wider block">4th Maneuver (Deep Pelvic Grip)</span>
              <p class="mt-1 text-[10px] leading-normal text-cyan-900">
                Face patient's feet. Place fingers of both hands on lower uterus to assess degree of flexion and descent.
              </p>
            </div>
          </div>
        </div>
      </div>
      `
    ],
    author: {
      id: "auth-4",
      name: "Dr. Ananya Reddy",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=ananya",
      university: "Osmania Medical College, Hyderabad",
      verified: true,
      rating: 4.97,
      salesCount: 4100,
      bio: "OBGYN Registrar. Passionate about medical education and creator of top-tier OSCE simulation blueprints which have helped thousands of interns ace their clinical rotations."
    },
    reviews: [
      {
        id: "r-5",
        userName: "Tarun Kumar",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=tarun",
        rating: 5,
        date: "2026-07-10",
        comment: "This book saved my life during internal exams! Presentation of the Pre-eclampsia case is written perfectly. Examiner was extremely pleased with my Leopold description.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "note-5",
    title: "Pediatrics Milestones, Nutrition & OSCE Rapid Revision",
    price: 149,
    originalPrice: 299,
    rating: 4.85,
    reviewCount: 110,
    pages: 38,
    subject: "Pediatrics",
    year: "Final Prof",
    category: "Revision Notes",
    tags: ["Developmental Milestones", "Immunization Schedule", "SAM Management"],
    downloads: 1620,
    description: "Highly structural, memory-optimized summaries for pediatric developmental milestones, nutritional calculations, vaccine-preventable diseases, and WHO immunization schedules. Packed with high-yield memory trees and comparison tables.",
    highlights: [
      "Color-coded developmental milestone tables (Gross motor, Fine motor, Language, Social).",
      "IAP & WHO latest vaccination schedules side-by-side with catch-up guides.",
      "Clear flowchart for Severe Acute Malnutrition (SAM) stabilization phase.",
      "Neonatal resuscitation algorithm formatted as an ultra-high recall cheat sheet."
    ],
    diagramCount: 6,
    samplePages: [
      `
      <div class="p-6 bg-violet-50/50 border border-violet-200/50 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-violet-600 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">Page 5: Developmental Milestones</div>
        <div class="border-b border-violet-200/40 pb-3 mb-4">
          <h4 class="text-sm font-mono text-violet-800 tracking-wider">PEDIATRIC DEVELOPMENT MASTERCLASS</h4>
          <h2 class="text-xl font-display font-bold text-violet-950 mt-1">Gross Motor Milestones</h2>
        </div>
        
        <div class="space-y-3 text-xs text-violet-900 leading-normal">
          <p class="font-medium text-violet-900">Gross motor development proceeds in a cephalocaudal direction (head control first, walking last).</p>
          
          <div class="space-y-2 mt-2">
            <div class="flex items-center gap-3 bg-white/75 p-2 rounded border border-violet-200">
              <div class="w-12 text-center font-bold font-mono text-violet-700 border-r border-violet-200 pr-2">3 Mo</div>
              <p class="flex-1 text-[11px] text-violet-900"><strong>Neck Holding:</strong> Child can hold neck steady while supported in sitting position.</p>
            </div>
            <div class="flex items-center gap-3 bg-white/75 p-2 rounded border border-violet-200">
              <div class="w-12 text-center font-bold font-mono text-violet-700 border-r border-violet-200 pr-2">5 Mo</div>
              <p class="flex-1 text-[11px] text-violet-900"><strong>Rolls over:</strong> Back to stomach and stomach to back.</p>
            </div>
            <div class="flex items-center gap-3 bg-white/75 p-2 rounded border border-violet-200">
              <div class="w-12 text-center font-bold font-mono text-violet-700 border-r border-violet-200 pr-2">8 Mo</div>
              <p class="flex-1 text-[11px] text-violet-900"><strong>Sits without support:</strong> Child sits steadily with straight back.</p>
            </div>
            <div class="flex items-center gap-3 bg-white/75 p-2 rounded border border-violet-200">
              <div class="w-12 text-center font-bold font-mono text-violet-700 border-r border-violet-200 pr-2">12 Mo</div>
              <p class="flex-1 text-[11px] text-violet-900"><strong>Stands alone:</strong> Stands without holding onto any furniture or hands.</p>
            </div>
            <div class="flex items-center gap-3 bg-white/75 p-2 rounded border border-violet-200">
              <div class="w-12 text-center font-bold font-mono text-violet-700 border-r border-violet-200 pr-2">15 Mo</div>
              <p class="flex-1 text-[11px] text-violet-900"><strong>Walks alone:</strong> Steady gait, can turn corners safely.</p>
            </div>
          </div>
        </div>
      </div>
      `
    ],
    author: {
      id: "auth-5",
      name: "Dr. Rohit Verma",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=rohit",
      university: "Armed Forces Medical College (AFMC)",
      verified: true,
      rating: 4.82,
      salesCount: 2200,
      bio: "Pediatric Resident at AFMC Pune. Gold medalist in Pediatric Medicine, dedicated to turning dry clinical statistics into memorable diagrams and visual mnemonic aids."
    },
    reviews: [
      {
        id: "r-6",
        userName: "Simran Jeet",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=simran",
        rating: 5,
        date: "2026-06-18",
        comment: "Excellent quick revision guide. The milestone tables are brilliant. They match exactly what external examiners ask in viva.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "note-6",
    title: "Forensic Medicine Toxicology & Autopsy Chartbook",
    price: 159,
    originalPrice: 319,
    rating: 4.75,
    reviewCount: 71,
    pages: 42,
    subject: "Forensic Medicine",
    year: "3rd Prof",
    category: "Diagrams",
    tags: ["Toxicology", "Post Mortem", "Drowning Signs", "Poisons"],
    downloads: 850,
    description: "Extensively sketched toxicology flowchart workbook. Compares clinical features, post-mortem findings, fatal dose, fatal periods, and specific antidotes of high-yield poisons (Organophosphorus, Arsenic, Cyanide, Snake bites, Dhatura, Lead). Includes autopsy reporting hacks.",
    highlights: [
      "Visual mind-maps matching physical symptoms to potential systemic toxins.",
      "Clear tabular differentiation of dry vs wet drowning post-mortem features.",
      "Autopsy instrument checklist and critical identification points.",
      "Handwritten mock post-mortem report models for examination submissions."
    ],
    diagramCount: 18,
    samplePages: [
      `
      <div class="p-6 bg-slate-50/50 border border-slate-200/50 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-slate-700 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">Page 12: OP Poisoning</div>
        <div class="border-b border-slate-200/40 pb-3 mb-4">
          <h4 class="text-sm font-mono text-slate-800 tracking-wider">FORENSIC TOXICOLOGY FILES</h4>
          <h2 class="text-xl font-display font-bold text-slate-950 mt-1">Organophosphorus Poisoning</h2>
        </div>
        <div class="space-y-4 text-xs text-slate-900 leading-relaxed font-sans">
          <p class="font-medium text-red-700 italic">OP compounds irreversibly inhibit Acetylcholinesterase (AChE) → massive accumulation of Acetylcholine (ACh) at receptors.</p>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/80 p-3 rounded-lg border border-slate-200/60">
              <span class="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Clinical Features (SLUDGEM):</span>
              <p class="mt-1 text-[11px] leading-relaxed text-slate-950">
                • <strong>S:</strong> Salivation<br/>
                • <strong>L:</strong> Lacrimation<br/>
                • <strong>U:</strong> Urination<br/>
                • <strong>D:</strong> Defecation<br/>
                • <strong>G:</strong> GI cramping & Emesis<br/>
                • <strong>E:</strong> Emesis / Excitation<br/>
                • <strong>M:</strong> Miosis (Pin-point pupils)
              </p>
            </div>
            <div class="bg-white/80 p-3 rounded-lg border border-slate-200/60">
              <span class="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Post-Mortem Findings:</span>
              <p class="mt-1 text-[11px] leading-relaxed text-slate-950">
                • <strong>Odor:</strong> Kerosene-like or Garlic-like odor at autopsy.<br/>
                • <strong>Organs:</strong> Intense congestion of stomach mucosa, pulmonary edema (froth at mouth & nose).<br/>
                • <strong>Blood:</strong> Cherry red lividity (note: CO is bright cherry-red, OP is congested dark fluid).
              </p>
            </div>
          </div>
        </div>
      </div>
      `
    ],
    author: {
      id: "auth-6",
      name: "Dr. Vikram Seth",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vikram",
      university: "King George's Medical University (KGMU), Lucknow",
      verified: true,
      rating: 4.8,
      salesCount: 1540,
      bio: "Assistant Professor in Forensic Medicine & Toxicology. Creator of high-yield autopsy revision files designed specifically to deconstruct forensic pathology protocols."
    },
    reviews: [
      {
        id: "r-7",
        userName: "Akanksha S.",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=akanksha",
        rating: 5,
        date: "2026-05-30",
        comment: "Excellent diagrams of post-mortem lividity types! The OP poisoning card is extremely helpful for theory exam preparations as well as forensic practicals.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "note-mbbs-1",
    title: "MBBS Elite Clinical Internal Medicine & Cardiology Blueprint",
    price: 349,
    originalPrice: 699,
    rating: 4.95,
    reviewCount: 312,
    pages: 120,
    subject: "MBBS",
    year: "Final Prof",
    category: "Revision Notes",
    tags: ["Medicine", "Cardiology", "ECG", "Harrison's High-Yield"],
    downloads: 1840,
    description: "Highly structured clinical medicine companion for MBBS final year students. Covers diagnostic algorithms, ECG interpretation, heart failures, valvular diseases, and emergency clinical pharmacology. Tailored directly to NMC CBME guidelines.",
    highlights: [
      "Step-by-step ECG rhythm identification maps.",
      "Treatment guidelines for Acute Myocardial Infarction.",
      "NMC-aligned Case Presentation templates for cardiac histories.",
      "High-recall charts from Harrison's Internal Medicine 21st Ed."
    ],
    diagramCount: 18,
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
    samplePages: [
      `
      <div class="p-6 bg-slate-900 text-slate-100 border border-slate-800 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-sky-500 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">MBBS Final Prof • ECG</div>
        <div class="border-b border-slate-800 pb-3 mb-4">
          <h4 class="text-sm font-mono text-sky-400 tracking-wider">CLINICAL CARDIOLOGY BLUEPRINT</h4>
          <h2 class="text-xl font-display font-bold text-white mt-1">Myocardial Infarction ECG Localization</h2>
        </div>
        <div class="space-y-4 text-xs leading-relaxed font-sans text-slate-300">
          <p class="italic text-slate-400">Localization of ST-segment elevation is key to identifying the occluded coronary artery on a 12-lead ECG.</p>
          <div class="grid grid-cols-2 gap-3 font-mono text-[11px]">
            <div class="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span class="text-rose-400 font-bold">1. Anterior Wall MI (V1-V4):</span>
              <p class="mt-1">
                • <strong>Leads:</strong> V1, V2, V3, V4<br/>
                • <strong>Artery:</strong> Left Anterior Descending (LAD)<br/>
                • <strong>Significance:</strong> Broadest muscle area, high risk of pump failure.
              </p>
            </div>
            <div class="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span class="text-sky-400 font-bold">2. Inferior Wall MI (II, III, aVF):</span>
              <p class="mt-1">
                • <strong>Leads:</strong> II, III, aVF<br/>
                • <strong>Artery:</strong> Right Coronary Artery (RCA)<br/>
                • <strong>Significance:</strong> Associated with bradyarrhythmias. Avoid nitrates!
              </p>
            </div>
          </div>
        </div>
      </div>
      `
    ],
    author: {
      id: "auth-1",
      name: "Dr. Aditya Sen",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=aditya",
      university: "AIIMS Delhi, Batch of 2021",
      verified: true,
      rating: 4.95,
      salesCount: 3840,
      bio: "MBBS Intern at AIIMS Delhi. Gold medalist in First Prof Anatomy. Passionate about rendering clinical visual maps that break down complex anatomy into intuitive pathways."
    },
    reviews: [
      {
        id: "r-mbbs-1",
        userName: "Vivek Sharma",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vivek",
        rating: 5,
        date: "2026-07-10",
        comment: "This final prof note saved my clinical postings viva! The ECG localization cheat sheet is incredibly high-yield and precise.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "note-bams-1",
    title: "BAMS Premium Ayurvedic Herbology & Dravyaguna-Vijnana Companion",
    price: 299,
    originalPrice: 599,
    rating: 4.9,
    reviewCount: 185,
    pages: 95,
    subject: "BAMS",
    year: "2nd Prof",
    category: "Handwritten",
    tags: ["Dravyaguna", "Ayurveda", "Herbs", "Charaka Samhita"],
    downloads: 920,
    description: "Detailed, color-coded handwritten notes on classical Dravyaguna-Vijnana (Ayurvedic pharmacology). Features deep breakdowns of Rasa, Guna, Virya, Vipaka, and Prabhava for 100+ essential medicinal herbs. Includes beautiful identification flowcharts.",
    highlights: [
      "Vedic and Botanical classifications side-by-side.",
      "Clear illustrations of Ashwagandha, Shatavari, and Amalaki.",
      "Panchamahabhuta composition maps of individual Rasas.",
      "Authentic shlokas with contextual clinical application notes."
    ],
    diagramCount: 25,
    coverImage: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80",
    samplePages: [
      `
      <div class="p-6 bg-emerald-50/50 border border-emerald-200/50 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">BAMS 2nd Prof • Dravyaguna</div>
        <div class="border-b border-emerald-200/40 pb-3 mb-4">
          <h4 class="text-sm font-mono text-emerald-800 tracking-wider">DRAVYAGUNA VIJNANA</h4>
          <h2 class="text-xl font-display font-bold text-emerald-950 mt-1">Guduchi (Tinospora cordifolia) Profile</h2>
        </div>
        <div class="space-y-4 text-xs text-emerald-900 leading-relaxed font-sans">
          <p class="italic text-emerald-800">Guduchi is celebrated as 'Amrita' (the elixir) due to its profound Rasayana (rejuvenative) and Jvarahara (antipyretic) capabilities.</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/80 p-3 rounded-lg border border-emerald-200/60 font-mono text-[11px]">
              <span class="font-bold text-emerald-800 text-[11px] uppercase tracking-wider">Panchapanchaka (Properties)</span>
              <p class="mt-1">
                • <strong>Rasa:</strong> Tikta, Kashaya (Bitter, Astringent)<br/>
                • <strong>Guna:</strong> Guru, Snigdha (Heavy, Unctuous)<br/>
                • <strong>Virya:</strong> Ushna (Hot potency)<br/>
                • <strong>Vipaka:</strong> Madhura (Sweet post-digestive metabolism)<br/>
                • <strong>Karma:</strong> Tridosha-Shamak (specially Vata-Kapha), Balya, Rasayana.
              </p>
            </div>
            <div class="bg-white/80 p-3 rounded-lg border border-emerald-200/60 font-mono text-[11px]">
              <span class="font-bold text-emerald-800 text-[11px] uppercase tracking-wider">Clinical Therapeutic Indications</span>
              <p class="mt-1">
                • <strong>Jvara (Chronic Fevers):</strong> Excellent immunomodulator.<br/>
                • <strong>Prameha (Type 2 Diabetes):</strong> Regulates carbohydrate uptake.<br/>
                • <strong>Amavata (Rheumatoid Arthritis):</strong> Destroys Ama toxins.
              </p>
            </div>
          </div>
        </div>
      </div>
      `
    ],
    author: {
      id: "auth-bams-1",
      name: "Dr. Ananya Sharma",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=ananya",
      university: "National Institute of Ayurveda (NIA), Jaipur",
      verified: true,
      rating: 4.9,
      salesCount: 1140,
      bio: "BAMS Topper and Scholar. Committed to bridging ancient wisdom with contemporary scientific phytochemistry parameters."
    },
    reviews: [
      {
        id: "r-bams-1",
        userName: "Siddharth J.",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=siddharth",
        rating: 5,
        date: "2026-06-25",
        comment: "Excellent handwritten charts! The Sanskrit shlokas are explained beautifully. Recommended to every BAMS student.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "note-bhms-1",
    title: "BHMS Master Organon of Medicine & Homoeopathic Materia Medica",
    price: 279,
    originalPrice: 549,
    rating: 4.85,
    reviewCount: 142,
    pages: 88,
    subject: "BHMS",
    year: "3rd Prof",
    category: "Handwritten",
    tags: ["Materia Medica", "Organon", "BHMS", "Kent Repertory"],
    downloads: 740,
    description: "Elegant homeopathic textbooks summary. Fully covers Hahnemann's Organon of Medicine (Aphorisms 1-294), drug provings, chronic miasms (Psora, Sycosis, Syphilis), and core Materia Medica profiles of polychrest remedies.",
    highlights: [
      "Simplified Aphorism maps with exact aphorism numbers.",
      "Comprehensive comparison matrices of polychrests (e.g., Lycopodium vs Nux Vomica).",
      "Repertory analysis guides using Kent and Boenninghausen methods.",
      "High-yield viva tips for practical evaluations."
    ],
    diagramCount: 14,
    coverImage: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80",
    samplePages: [
      `
      <div class="p-6 bg-teal-50/50 border border-teal-200/50 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-teal-600 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">BHMS 3rd Prof • Organon</div>
        <div class="border-b border-teal-200/40 pb-3 mb-4">
          <h4 class="text-sm font-mono text-teal-800 tracking-wider">ORGANON OF MEDICINE STUDY</h4>
          <h2 class="text-xl font-display font-bold text-teal-950 mt-1">Aphorism 26: The Law of Homoeopathic Cure</h2>
        </div>
        <div class="space-y-4 text-xs text-teal-900 leading-relaxed font-sans">
          <p class="italic text-teal-800">Statement: 'A weaker dynamic affection is permanently extinguished in the living organism by a stronger one, if the latter (deviating in kind) is very similar in its manifestations to the former.'</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/80 p-3 rounded-lg border border-teal-200/60 font-mono text-[11px]">
              <span class="font-bold text-teal-800 text-[11px] uppercase tracking-wider">Core Pre-requisites</span>
              <p class="mt-1">
                1. <strong>Deviating in Kind:</strong> The artificial disease (remedy-induced) must not be identical in nature to the natural disease.<br/>
                2. <strong>Extremely Similar:</strong> Symptom similarity (Similia Similibus Curentur) is mandatory.<br/>
                3. <strong>Stronger Intensity:</strong> Dynamic potency of the selected remedy must exceed the natural disease state.
              </p>
            </div>
            <div class="bg-white/80 p-3 rounded-lg border border-teal-200/60 font-mono text-[11px]">
              <span class="font-bold text-teal-800 text-[11px] uppercase tracking-wider">Practical Case Taking Tips</span>
              <p class="mt-1">
                • Always prioritize <strong>mental generals</strong> and physical constitution over localized symptoms.<br/>
                • Look for 'uncommon, peculiar, characteristic' symptoms (Aphorism 153).
              </p>
            </div>
          </div>
        </div>
      </div>
      `
    ],
    author: {
      id: "auth-bhms-1",
      name: "Dr. Rajat Banerjee",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=rajat",
      university: "National Institute of Homoeopathy (NIH), Kolkata",
      verified: true,
      rating: 4.9,
      salesCount: 820,
      bio: "Homeopathy scholar, researcher, and practitioner. Famous for deconstructing Kent's Materia Medica into highly structured comparison blocks."
    },
    reviews: [
      {
        id: "r-bhms-1",
        userName: "Sneha Roy",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=sneha",
        rating: 5,
        date: "2026-05-18",
        comment: "The Aphorism breakdowns are just brilliant. Writing answers in BHMS university exams became so easy with these notes.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "note-bpt-1",
    title: "BPT Clinical Kinesiology, Biomechanics & Musculoskeletal Rehab Manual",
    price: 259,
    originalPrice: 499,
    rating: 4.88,
    reviewCount: 110,
    pages: 74,
    subject: "BPT",
    year: "3rd Prof",
    category: "Practical Files",
    tags: ["Kinesiology", "Biomechanics", "Rehabilitation", "Therapy"],
    downloads: 650,
    description: "The complete physiotherapy student guide. Covers joint biomechanics, gait analysis, orthopaedic clinical evaluation templates, and physical rehabilitation protocol pathways. Includes detailed hand drawings of muscular leverage.",
    highlights: [
      "Anatomy of Gait Cycle (Stance and Swing phase breakdowns).",
      "Goniometry testing diagrams for all major joints.",
      "Manual Muscle Testing (MMT) grading flowcharts (0-5 scale).",
      "Post-surgical clinical rehab schedules for ACL and Meniscal repairs."
    ],
    diagramCount: 32,
    coverImage: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80",
    samplePages: [
      `
      <div class="p-6 bg-orange-50/50 border border-orange-200/50 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-orange-600 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">BPT 3rd Prof • Gait</div>
        <div class="border-b border-orange-200/40 pb-3 mb-4">
          <h4 class="text-sm font-mono text-orange-800 tracking-wider">CLINICAL GAIT ANALYSIS</h4>
          <h2 class="text-xl font-display font-bold text-orange-950 mt-1">Normal Gait Cycle Phases</h2>
        </div>
        <div class="space-y-4 text-xs text-orange-900 leading-relaxed font-sans">
          <p class="italic text-orange-800">The Gait Cycle is defined as the time interval between heel strike of one foot to the subsequent heel strike of the same foot (divided into Stance & Swing).</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/80 p-3 rounded-lg border border-orange-200/60 font-mono text-[11px]">
              <span class="font-bold text-orange-800 text-[11px] uppercase tracking-wider">1. Stance Phase (~60% of cycle)</span>
              <p class="mt-1">
                • <strong>Heel Strike (Initial Contact)</strong><br/>
                • <strong>Foot Flat (Loading Response)</strong><br/>
                • <strong>Midstance</strong> (single limb support)<br/>
                • <strong>Heel Off (Terminal Stance)</strong><br/>
                • <strong>Toe Off (Preswing)</strong>
              </p>
            </div>
            <div class="bg-white/80 p-3 rounded-lg border border-orange-200/60 font-mono text-[11px]">
              <span class="font-bold text-orange-800 text-[11px] uppercase tracking-wider">2. Swing Phase (~40% of cycle)</span>
              <p class="mt-1">
                • <strong>Initial Swing (Acceleration)</strong><br/>
                • <strong>Midswing</strong> (clearing the foot)<br/>
                • <strong>Terminal Swing (Deceleration)</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      `
    ],
    author: {
      id: "auth-bpt-1",
      name: "Dr. Tarun Verma",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=tarun",
      university: "IPGMER & SSKM Hospital, Kolkata",
      verified: true,
      rating: 4.85,
      salesCount: 680,
      bio: "Lead Sports Physiotherapist & Clinical Evaluator. Specializes in neuro-musculoskeletal active-recall rehabilitation techniques."
    },
    reviews: [
      {
        id: "r-bpt-1",
        userName: "Devendra K.",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=devendra",
        rating: 5,
        date: "2026-04-22",
        comment: "Excellent diagrams for Goniometry! Helped me clear my BPT practical examinations easily.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "note-nursing-1",
    title: "B.Sc. Nursing Advanced Pediatrics & ICU Nursing Process Maps",
    price: 199,
    originalPrice: 399,
    rating: 4.82,
    reviewCount: 98,
    pages: 65,
    subject: "BSC NURSING",
    year: "3rd Year",
    category: "Revision Notes",
    tags: ["Pediatrics", "Critical Care", "Nursing Care Plan", "Therapeutics"],
    downloads: 510,
    description: "The complete critical-care nursing framework. Features detailed Nursing Care Plans (NCPs), intensive-care drug calculations, pediatric growth monitoring parameters, and cardiac monitoring guides. Ideal for Indian nursing board prep.",
    highlights: [
      "Nursing Process Framework: Assessment, Diagnosis, Planning, Implementation, Evaluation.",
      "Comprehensive ICU drug dosage formula charts.",
      "IMNCI Guidelines (Integrated Management of Neonatal and Childhood Illnesses).",
      "High-yield emergency triage action templates."
    ],
    diagramCount: 12,
    coverImage: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80",
    samplePages: [
      `
      <div class="p-6 bg-pink-50/50 border border-pink-200/50 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-pink-600 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">Nursing 3rd Year • NCP</div>
        <div class="border-b border-pink-200/40 pb-3 mb-4">
          <h4 class="text-sm font-mono text-pink-800 tracking-wider">NURSING PROCESS HANDBOOK</h4>
          <h2 class="text-xl font-display font-bold text-pink-950 mt-1">Nursing Care Plan (NCP) for Hyperthermia</h2>
        </div>
        <div class="space-y-4 text-xs text-pink-900 leading-relaxed font-sans">
          <p class="italic text-pink-800">This template covers structured care actions for a pediatric patient with elevated body temperature due to infection.</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/80 p-3 rounded-lg border border-pink-200/60 font-mono text-[11px]">
              <span class="font-bold text-pink-800 text-[11px] uppercase tracking-wider">Assessment & Diagnosis</span>
              <p class="mt-1">
                • <strong>Subjective:</strong> Mother states child's body is hot to touch.<br/>
                • <strong>Objective:</strong> Temp: 39°C (102.2°F), flushed skin, tachypnea.<br/>
                • <strong>Nursing Diagnosis:</strong> Hyperthermia related to infectious process as evidenced by elevated core temperature.
              </p>
            </div>
            <div class="bg-white/80 p-3 rounded-lg border border-pink-200/60 font-mono text-[11px]">
              <span class="font-bold text-pink-800 text-[11px] uppercase tracking-wider">Nursing Interventions</span>
              <p class="mt-1">
                1. <strong>Tepid Sponging:</strong> Apply to axilla and groin area to facilitate evaporative cooling.<br/>
                2. <strong>Hydration:</strong> Encourage oral fluid intake to prevent dehydration.<br/>
                3. <strong>Medication:</strong> Administer Paracetamol syrup as per doctor's prescription.
              </p>
            </div>
          </div>
        </div>
      </div>
      `
    ],
    author: {
      id: "auth-nursing-1",
      name: "Sister Mary Abraham",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=mary",
      university: "College of Nursing, CMC Vellore",
      verified: true,
      rating: 4.92,
      salesCount: 940,
      bio: "Senior Critical Care Nurse & Academic Instructor. Dedicated to providing visual, action-oriented study blueprints for nurses."
    },
    reviews: [
      {
        id: "r-nursing-1",
        userName: "Jaspreet Kaur",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=jaspreet",
        rating: 5,
        date: "2026-06-02",
        comment: "These Nursing Care Plans are incredibly well structured! I got full marks in my clinical file evaluation.",
        verifiedPurchase: true
      }
    ]
  },
  {
    id: "note-bds-1",
    title: "BDS Masterclass: Prosthodontics, Endodontics & Oral Surgery Blueprints",
    price: 320,
    originalPrice: 599,
    rating: 4.93,
    reviewCount: 165,
    pages: 110,
    subject: "BDS",
    year: "Final Prof",
    category: "Revision Notes",
    tags: ["Oral Surgery", "Endodontics", "Prosthodontics", "BDS"],
    downloads: 1210,
    description: "The ultimate dental student workbook. Detailed high-yield review sheets covering root canal therapy steps, local anaesthesia blocks in dentistry, tooth preparation parameters for crowns, and complete denture fabrication stages.",
    highlights: [
      "Color-coded tooth preparation margin guidelines.",
      "Comprehensive diagrams explaining Inferior Alveolar Nerve Block (IANB).",
      "Step-by-step root canal cleaning and obturation pathways.",
      "Endodontic access cavities illustration library."
    ],
    diagramCount: 35,
    coverImage: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=600&q=80",
    samplePages: [
      `
      <div class="p-6 bg-sky-50/50 border border-sky-200/50 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-sky-600 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">BDS Final Prof • Endodontics</div>
        <div class="border-b border-sky-200/40 pb-3 mb-4">
          <h4 class="text-sm font-mono text-sky-800 tracking-wider">ENDODONTIC EXCELLENCE</h4>
          <h2 class="text-xl font-display font-bold text-sky-950 mt-1">Working Length Determination</h2>
        </div>
        <div class="space-y-4 text-xs text-sky-900 leading-relaxed font-sans">
          <p class="italic text-sky-800">Determining the exact length of the root canal from a reference point to the apical constriction is vital for successful root canal treatment.</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/80 p-3 rounded-lg border border-sky-200/60 font-mono text-[11px]">
              <span class="font-bold text-sky-800 text-[11px] uppercase tracking-wider">Methods of Determination</span>
              <p class="mt-1">
                • <strong>Radiographic (Ingle's Method):</strong> Safe estimation, but subject to 2D distortion.<br/>
                • <strong>Electronic Apex Locators (EAL):</strong> Uses frequency-dependent impedance to identify apical constriction (~98% accuracy).<br/>
                • <strong>Tactile Sensation:</strong> Feedback on constriction resist.
              </p>
            </div>
            <div class="bg-white/80 p-3 rounded-lg border border-sky-200/60 font-mono text-[11px]">
              <span class="font-bold text-sky-800 text-[11px] uppercase tracking-wider">Clinical Significance</span>
              <p class="mt-1">
                • Under-estimation leads to incomplete instrumentation (residual bacterial infection).<br/>
                • Over-estimation leads to apical perforation and extrusion of obturation materials.
              </p>
            </div>
          </div>
        </div>
      </div>
      `
    ],
    author: {
      id: "auth-bds-1",
      name: "Dr. Rohan Malhotra",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=rohanm",
      university: "Maulana Azad Institute of Dental Sciences (MAIDS), New Delhi",
      verified: true,
      rating: 4.96,
      salesCount: 1390,
      bio: "Gold Medalist in Conservative Dentistry & Endodontics. Creator of the best clinical oral surgery and endodontics notes online."
    },
    reviews: [
      {
        id: "r-bds-1",
        userName: "Gauri Nair",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=gauri",
        rating: 5,
        date: "2026-07-12",
        comment: "This is a life-saver for clinical practice! The access cavity diagrams are incredibly precise.",
        verifiedPurchase: true
      }
    ]
  }
];

export const mockFlashcards: Flashcard[] = [
  {
    id: "flash-1",
    question: "What is the key histological diagnostic cell found in classical Hodgkin's Lymphoma?",
    answer: "Reed-Sternberg (RS) Cell",
    explanation: "Reed-Sternberg cells are giant, multinucleated/bilobed B-cells presenting a classic 'Owl Eye' appearance with prominent eosinophilic nucleoli surrounded by clear halos. They are positive for CD15 and CD30.",
    category: "Pathology",
    difficulty: "Easy"
  },
  {
    id: "flash-2",
    question: "Which cranial nerve is most commonly injured in fractures of the middle cranial fossa?",
    answer: "Facial Nerve (CN VII)",
    explanation: "The Facial Nerve runs a long, tortuous course through the temporal bone (internal acoustic meatus, facial canal) making it highly vulnerable to petrous temporal bone fractures.",
    category: "Anatomy",
    difficulty: "Medium"
  },
  {
    id: "flash-3",
    question: "What is the specific antidote for Organophosphorus poisoning, and what is its mechanism?",
    answer: "Pralidoxime (2-PAM) & Atropine",
    explanation: "Atropine blocks muscarinic receptors to control excess bronchial secretions and bronchoconstriction. Pralidoxime (AChE Reactivator) regenerates active Acetylcholinesterase if administered before the enzyme-inhibitor complex 'ages'.",
    category: "Pharmacology",
    difficulty: "Hard"
  },
  {
    id: "flash-4",
    question: "What form of developmental delay is diagnosed if a child is unable to walk independently by what age limit?",
    answer: "18 Months (1.5 Years)",
    explanation: "While the normal range to walk alone is 12-15 months, 18 months represents the absolute 'red flag' limit for gross motor milestone completion, indicating immediate evaluation for muscular or neurological delays.",
    category: "Pediatrics",
    difficulty: "Medium"
  },
  {
    id: "flash-5",
    question: "Which cardiac murmur increases in intensity during inspiration?",
    answer: "Tricuspid Regurgitation / Right-sided Murmurs",
    explanation: "Inspiration decreases intrathoracic pressure → increases venous return to the right atrium/ventricle. This increased right-sided preload increases blood flow across right-sided valves, intensifying right-sided murmurs (Carvallo's Sign).",
    category: "Physiology",
    difficulty: "Hard"
  },
  {
    id: "flash-6",
    question: "Name the cardinal radiological sign on an upright abdominal X-ray for Sigmoid Volvulus.",
    answer: "Coffee Bean Sign (or Bent Inner Tube Sign)",
    explanation: "Sigmoid volvulus is the twisting of the sigmoid colon around its mesentery. The enormously dilated air-filled loop of sigmoid colon projects upward out of the pelvis, taking the shape of a massive coffee bean.",
    category: "Surgery",
    difficulty: "Easy"
  }
];

export const mockSellerAnalytics: SellerAnalytics = {
  totalRevenue: 42350,
  totalSales: 198,
  profileViews: 1240,
  activeNotesCount: 4,
  monthlyRevenue: [
    { month: "Jan", amount: 4200 },
    { month: "Feb", amount: 5800 },
    { month: "Mar", amount: 6400 },
    { month: "Apr", amount: 7900 },
    { month: "May", amount: 8200 },
    { month: "Jun", amount: 9850 }
  ],
  recentTransactions: [
    {
      id: "tx-101",
      noteTitle: "Anatomy of the Mediastinum & Coronary Circulation",
      buyerName: "Harshit Sharma",
      amount: 249,
      date: "2026-07-18 14:32",
      status: "Success"
    },
    {
      id: "tx-102",
      noteTitle: "High-Yield Pharmacology Mnemonics & Mechanism maps",
      buyerName: "Divya Nair",
      amount: 199,
      date: "2026-07-18 10:15",
      status: "Success"
    },
    {
      id: "tx-103",
      noteTitle: "Anatomy of the Mediastinum & Coronary Circulation",
      buyerName: "Rahul Verma",
      amount: 249,
      date: "2026-07-17 18:40",
      status: "Success"
    },
    {
      id: "tx-104",
      noteTitle: "Pathology Systematic Slides & Practical Manual",
      buyerName: "Kriti Sen",
      amount: 179,
      date: "2026-07-17 12:22",
      status: "Success"
    }
  ]
};
