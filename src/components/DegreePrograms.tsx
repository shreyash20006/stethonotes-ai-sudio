/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap,
  Layers,
  ChevronRight,
  X,
  BookOpen,
  Building,
  Award,
  Sparkles,
  ClipboardList,
  Clock,
  Briefcase,
  TrendingUp,
  Stethoscope,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { MedicalNote } from "../types";
import { DegreeLogo } from "./DegreeLogo";

// Helper to determine degree category of any note
export const getNoteDegree = (note: MedicalNote): string => {
  const sub = note.subject.toUpperCase();
  if (["ANATOMY", "PHARMACOLOGY", "PATHOLOGY", "OBGYN", "PEDIATRICS", "FORENSIC MEDICINE", "MBBS"].includes(sub)) {
    return "MBBS";
  }
  if (sub === "BSC NURSING" || sub === "BSC_NURSING" || sub === "NURSING") {
    return "BSC NURSING";
  }
  return sub; // BAMS, BHMS, BPT, BDS, etc.
};

interface CourseDetail {
  duration: string;
  eligibility: string;
  yearlySyllabus: {
    year: string;
    subjects: string[];
    topics: string[];
  }[];
  clinicalRotations: {
    department: string;
    duration: string;
    role: string;
  }[];
  careerOptions: {
    title: string;
    description: string;
    avgStartingSalary: string;
  }[];
  postGraduation: string[];
  geminiAnalysis: {
    difficultyRating: string; // e.g., 9.2/10
    highYieldTopics: string[];
    goldMedalistTip: string;
    aiStudySchedule: string;
  };
}

interface DegreeProgram {
  id: string;
  name: string;
  fullName: string;
  description: string;
  bgLightClass: string;
  accentTextClass: string;
  details: CourseDetail;
}

const DEGREE_PROGRAMS_DATA: DegreeProgram[] = [
  {
    id: "MBBS",
    name: "MBBS",
    fullName: "Bachelor of Medicine, Bachelor of Surgery",
    description: "Modern internal medicine, cardiology, human anatomy, clinical pharmacology, and surgical blueprints.",
    bgLightClass: "from-sky-50/50 to-indigo-50/30",
    accentTextClass: "text-sky-600",
    details: {
      duration: "5.5 Years (4.5 Years Academics + 1 Year Compulsory Rotatory Internship)",
      eligibility: "Physics, Chemistry, Biology in Senior Secondary + NEET-UG Qualifiers",
      yearlySyllabus: [
        {
          year: "1st Professional (12 Months)",
          subjects: ["Human Anatomy", "Human Physiology", "Biochemistry"],
          topics: ["Gross Anatomy, Embryology, Histology, Neuroanatomy", "Cardiovascular, Respiratory, Renal & Endocrine systems, Nerve-Muscle physiology", "Enzymology, Metabolism pathways, Molecular Biology, Genetic replication"]
        },
        {
          year: "2nd Professional (12 Months)",
          subjects: ["Pathology", "Microbiology", "Pharmacology", "Forensic Medicine & Toxicology"],
          topics: ["Cell injury, Neoplasia, Systemic Pathology, Hematology", "Bacteriology, Virology, Mycology, Parasitology, Immunology", "Pharmacokinetics, Autonomic Nervous System, CVS drugs, Chemotherapy", "Medical Jurisprudence, Post-mortem rules, Identification, Toxicology profiles"]
        },
        {
          year: "3rd Professional - Part I (12 Months)",
          subjects: ["Ophthalmology", "Otorhinolaryngology (ENT)", "Community Medicine"],
          topics: ["Refractive errors, Cataract, Glaucoma, Retinal disorders", "Otitis media, Deafness, Tonsillitis, Laryngeal conditions", "Epidemiology, Health planning, Immunization schedules, Biostatistics"]
        },
        {
          year: "4th Professional - Part II (12 Months)",
          subjects: ["General Medicine", "General Surgery", "Obstetrics & Gynecology", "Pediatrics"],
          topics: ["Infectious diseases, Cardiology, Pulmonology, Neurology", "Hernias, Appendicitis, Cholecystitis, Trauma life support", "Antenatal care, Labor stages, Preeclampsia, Gynecological cancers", "Neonatology, Growth & Development, Congenital diseases, Pediatric nutrition"]
        }
      ],
      clinicalRotations: [
        { department: "General Medicine", duration: "1.5 Months", role: "Daily ward rounds, history-taking, ECG interpretation, charting lab vitals." },
        { department: "General Surgery", duration: "1.5 Months", role: "Assisting in minor operations, suturing, wound dressing, pre-op checking." },
        { department: "Obstetrics & Gynecology", duration: "1 Month", role: "Conducting normal deliveries under supervision, managing episiotomy." },
        { department: "Pediatrics & NICU", duration: "1 Month", role: "Growth charting, immunization administration, pediatric fluid calculations." }
      ],
      careerOptions: [
        { title: "General Practitioner / Medical Officer", description: "Primary clinic diagnostics, OPD treatment, government health centers practice.", avgStartingSalary: "₹9.6L - ₹14L per annum" },
        { title: "Specialist Resident Consultant", description: "Post-graduate clinical residency at tertiary hospitals, specialty surgical consulting.", avgStartingSalary: "₹15L - ₹24L per annum" }
      ],
      postGraduation: [
        "MD (Doctor of Medicine - Internal Medicine, Pediatrics, Radio-diagnosis, Dermatology)",
        "MS (Master of Surgery - General Surgery, Orthopedics, Ophthalmology, OBGYN)",
        "DNB (Diplomate of National Board)",
        "MPH (Master of Public Health)"
      ],
      geminiAnalysis: {
        difficultyRating: "9.5 / 10 (Very High Memorization & Long Clinical Hours)",
        highYieldTopics: [
          "Anatomy: Circle of Willis, Inguinal Canal anatomy, Cranial Nerves.",
          "Pharmacology: Autonomic drug mechanisms, Antimicrobial resistance.",
          "Pathology: Acute vs Chronic inflammation, Glomerulonephritis classification."
        ],
        goldMedalistTip: "Correlate Anatomy with Surgery and Physiology with Medicine from day one. Clinical case-based studies are heavily prioritized in modern NEXT/NEET-PG patterns.",
        aiStudySchedule: "Focus on 3-hour active recall sprints for clinical medicine. Use block scheduling to balance morning clinical postings with evening theory reviews."
      }
    }
  },
  {
    id: "BAMS",
    name: "BAMS",
    fullName: "Bachelor of Ayurvedic Medicine & Surgery",
    description: "Classical Dravyaguna (pharmacology), Ayurvedic herbology, Shlokas, and Panchakarma therapies.",
    bgLightClass: "from-emerald-50/50 to-teal-50/30",
    accentTextClass: "text-emerald-600",
    details: {
      duration: "5.5 Years (4.5 Years Academics + 1 Year Compulsory Internship)",
      eligibility: "Physics, Chemistry, Biology + Sanskrit knowledge is highly beneficial + NEET-UG score",
      yearlySyllabus: [
        {
          year: "1st Professional (18 Months)",
          subjects: ["Kriya Sharir (Physiology)", "Rachana Sharir (Anatomy)", "Maulik Siddhant & Ashtang Hridaya", "Padartha Vigyan", "Sanskrit Language"],
          topics: ["Tridosha (Vata-Pitta-Kapha), Dhatu, Mala, Ojas", "Marma Sharir, Asthi, Sandhi, Sira anatomy, dissection", "Sutrasthana of Vagbhata, principles of health conservation", "Epistemology, Panchamahabhuta theory, Dravya theory", "Sanskrit grammar, recitation of ancient Ayurvedic verses"]
        },
        {
          year: "2nd Professional (18 Months)",
          subjects: ["Dravyaguna Vijnana (Herbology)", "Rasa Shastra & Bhaishajya Kalpana", "Roga Nidan & Vikriti Vigyan", "Charaka Samhita (Purvardha)"],
          topics: ["Classification of medicinal herbs, Virya, Vipaka, Prabhava", "Mineral purification (Shodhana), formulations, syrups, tablets", "Ayurvedic diagnostics, Nadi Pariksha, Pathological correlates", "Sutrasthana, Nidanasthana, and Vimanasthana chapters"]
        },
        {
          year: "3rd Professional (18 Months)",
          subjects: ["Kayachikitsa (Medicine)", "Shalya Tantra (Surgery)", "Shalakya Tantra (ENT & Eye)", "Kaumarbhritya (Pediatrics)", "Panchakarma (Purification)"],
          topics: ["Jvara (fever), metabolic disorders, digestive pathology", "Ancient surgical tools, bloodletting (Raktamokshana), Ksharasutra", "Eye disorders, Netra Tarpana, ENT treatments", "Childhood disorders, herbal dosages, childhood nutrition", "Vamana, Virechana, Basti, Nasya, Raktamokshana protocols"]
        }
      ],
      clinicalRotations: [
        { department: "Panchakarma Unit", duration: "3 Months", role: "Preparing medicated oils, checking Abhyanga, Basti bag setups, Shirodhara alignment." },
        { department: "Kayachikitsa OPD", duration: "3 Months", role: "Conducting Nadi Pariksha (Pulse diagnosis), Prakriti Analysis (Constitution checking)." },
        { department: "Shalya & Ksharasutra", duration: "2 Months", role: "Preparing alkaline threads for fistula care, managing sterile dressing protocols." }
      ],
      careerOptions: [
        { title: "Ayurvedic Medical Officer", description: "State government health dispensaries, primary AYUSH health centers, clinical setups.", avgStartingSalary: "₹6.5L - ₹9L per annum" },
        { title: "Panchakarma Specialist / Wellness Director", description: "Directing luxury wellness centers, international health retreats, detox spas.", avgStartingSalary: "₹8L - ₹15L per annum" }
      ],
      postGraduation: [
        "MD (Ayurveda - Kayachikitsa, Dravyaguna, Panchakarma, Roga Nidan)",
        "MS (Ayurveda - Shalya Tantra, Shalakya Tantra)",
        "Post Graduate Diploma in Panchakarma",
        "Clinical Research fellowship"
      ],
      geminiAnalysis: {
        difficultyRating: "8.8 / 10 (Sanskrit Verses + Integrative Anatomy challenges)",
        highYieldTopics: [
          "Dravyaguna: Active herbs family names, properties of Ashwagandha, Guduchi, Shatavari.",
          "Rachana Sharir: 107 Marma points (vital structural junctions) and surgical consequences.",
          "Roga Nidan: Ashtavidha Pariksha (8-fold clinical diagnostic examination)."
        ],
        goldMedalistTip: "Memorize major Sanskrit Shlokas using audio loops. Examiners appreciate active quoting of Charaka and Sushruta Samhita verses in professional theory exams.",
        aiStudySchedule: "Dedicate 1 hour daily exclusively to Sanskrit verse writing practice. Balance classical Ayurveda text learning with modern medicine diagnostics guides."
      }
    }
  },
  {
    id: "BHMS",
    name: "BHMS",
    fullName: "Bachelor of Homeopathic Medicine & Surgery",
    description: "Organon of Medicine, Materia Medica profiles, chronic miasms, and individualized therapeutics.",
    bgLightClass: "from-teal-50/50 to-cyan-50/30",
    accentTextClass: "text-teal-600",
    details: {
      duration: "5.5 Years (4.5 Years Academics + 1 Year Compulsory Internship)",
      eligibility: "Physics, Chemistry, Biology in 12th + NEET-UG Qualified",
      yearlySyllabus: [
        {
          year: "1st Professional (12 Months)",
          subjects: ["Anatomy & Physiology", "Homeopathic Pharmacy", "Organon of Medicine (Introduction)", "Homeopathic Materia Medica (Intro)"],
          topics: ["General modern anatomy, dissection, systemic organ systems", "Preparation of dilutions, mother tinctures, trituration, dynamization", "Aphorisms 1 to 28, definition of Health, Vital Force, laws of cure", "Introduction to drug proving, source books, basic therapeutic profiles"]
        },
        {
          year: "2nd Professional (12 Months)",
          subjects: ["Pathology & Bacteriology", "Forensic Medicine & Toxicology", "Organon of Medicine (Aphorisms)", "Homeopathic Materia Medica (Remedies)"],
          topics: ["General pathological principles, blood tests, microbiological culture", "Poisons, legal procedures, post-mortem findings", "Aphorisms 29 to 145, dynamic healing actions, drug susceptibility", "Key remedies: Aconite, Belladonna, Bryonia, Nux Vomica, Pulsatilla"]
        },
        {
          year: "3rd Professional (12 Months)",
          subjects: ["Surgery with Homeopathic Therapeutics", "Gynecology & Obstetrics", "Organon of Medicine (Miasms)", "Homeopathic Materia Medica (Deep Remedial)"],
          topics: ["Surgical diagnostics, pre-post care, therapeutic matches", "Menstrual anomalies, pregnancy care, labor remedies", "Chronic diseases, theory of Miasms (Psora, Sycosis, Syphilis)", "Key remedies: Lycopodium, Lachesis, Sepia, Silicea, Sulphur"]
        },
        {
          year: "4th Professional (12 Months)",
          subjects: ["Practice of Medicine", "Homeopathic Repertory", "Community Medicine", "Materia Medica (Comparative)"],
          topics: ["Systemic diseases, cardiovascular, respiratory, renal care", "Repertorization techniques, Kent, Boenninghausen, Boger repertories", "Preventive medicine, epidemiology, public sanitation schemes", "Comparative analysis of polychrest remedies, prescribing skills"]
        }
      ],
      clinicalRotations: [
        { department: "Materia Medica Outpatients", duration: "4 Months", role: "Detailing patient symptoms, compiling case sheets, cross-referencing Repertory rubrics." },
        { department: "Practice of Medicine Wards", duration: "3 Months", role: "Diagnosing clinical presentations, recommending supportive diet, checking dynamic healing." },
        { department: "Community Dispensaries", duration: "2 Months", role: "Managing rural preventive medical camps, nutritional advocacy, child health cards." }
      ],
      careerOptions: [
        { title: "Homeopathic Practitioner / Consultant", description: "Opening private clinical dispensaries, counseling centers, integrative therapy.", avgStartingSalary: "₹5.5L - ₹8.5L per annum" },
        { title: "Homeopathic Pharmacist / Lab Director", description: "Directing homeopathic drug production, dilution standardization, quality checks.", avgStartingSalary: "₹6L - ₹10L per annum" }
      ],
      postGraduation: [
        "MD (Homeopathy - Materia Medica, Organon of Medicine, Repertory, Practice of Medicine)",
        "M.Sc (Medical Anatomy / Physiology)",
        "PG Diploma in Clinical Research",
        "MBA (Hospital Administration)"
      ],
      geminiAnalysis: {
        difficultyRating: "8.5 / 10 (High Case Analysis & Extensive Drug Profiles Memorization)",
        highYieldTopics: [
          "Organon: Cardinal Principles of Homeopathy, Chronic Miasms theory.",
          "Materia Medica: Polychrest remedies profiles, comparative drug pictures.",
          "Repertory: Methods of repertorization, Kent's 31 evaluation steps."
        ],
        goldMedalistTip: "Build comparison grids for similar-looking remedies. Examiners love to ask 'Compare Bryonia and Rhus Tox in rheumatic complaints' in oral viva exams.",
        aiStudySchedule: "Spend 45 minutes daily studying Kent's Repertory rubrics. Utilize case studies to practice picking the exact 'Simillimum' remedy."
      }
    }
  },
  {
    id: "BPT",
    name: "BPT",
    fullName: "Bachelor of Physiotherapy",
    description: "Clinical kinesiology, joint biomechanics, muscular leverage diagrams, and sports rehab schedules.",
    bgLightClass: "from-orange-50/50 to-amber-50/30",
    accentTextClass: "text-orange-600",
    details: {
      duration: "4.5 Years (4 Years Academics + 6 Months Compulsory Clinical Internship)",
      eligibility: "Physics, Chemistry, Biology in Senior Secondary Board + entrance qualifying exams",
      yearlySyllabus: [
        {
          year: "1st Year (12 Months)",
          subjects: ["Anatomy", "Physiology", "Biochemistry", "Introduction to Physiotherapy & Psychology"],
          topics: ["Detailed musculoskeletal anatomy, osteology, nerve courses, muscles", "Neuromuscular physiology, cardiovascular adaptation, respiratory volumes", "Energy systems, carbohydrate metabolism, connective tissue chemistry", "History of rehab, patient interaction, soft-tissue handling basics"]
        },
        {
          year: "2nd Year (12 Months)",
          subjects: ["Biomechanics & Kinesiology", "Exercise Therapy (I & II)", "Electrotherapy (I & II)", "Pharmacology & Pathology"],
          topics: ["Joint lubrication, kinematics, gait analysis, muscle leverage", "Passive/active range of motion, stretching, traction, suspension", "Therapeutic currents, TENS, Ultrasound, Laser, Shortwave Diathermy", "Drugs affecting muscle tone, inflammatory tissue healing phases"]
        },
        {
          year: "3rd Year (12 Months)",
          subjects: ["Orthopaedics & Traumatology", "General Medicine & Pediatrics", "General Surgery & OBGYN", "Physiotherapy in Ortho & Gynecology"],
          topics: ["Fractures, bone grafts, osteoarthritis, spine deformities", "Cardiorespiratory conditions, pediatric developmental delays", "Thoracic incisions, post-op complications, pelvic floor health", "Mobilization techniques, manual therapy, prenatal/postnatal exercises"]
        },
        {
          year: "4th Year (12 Months)",
          subjects: ["Neurology & Neurosurgery", "Physiotherapy in Cardio-Pulmonary Wards", "Physiotherapy in Neurology", "Sports Physiotherapy & Ergonomics"],
          topics: ["Stroke, Hemiplegia, Spinal cord injuries, Parkinson's disease", "Airway clearance, breathing exercises, cardiac rehabilitation", "NDT (Neurodevelopmental Therapy), PNF stretching, balance training", "Sports trauma management, taping, corporate ergonomics workspace design"]
        }
      ],
      clinicalRotations: [
        { department: "Orthopaedic Physical Therapy Wards", duration: "2 Months", role: "Applying post-fracture mobilization, knee replacement rehabilitation exercises." },
        { department: "Neurology & Stroke Rehabilitation", duration: "2 Months", role: "Spasticity management, gait retraining, balance training, facial palsy exercises." },
        { department: "Cardiopulmonary ICU", duration: "1 Month", role: "Post-bypass chest physiotherapy, bronchial hygiene, ventilator weaning breathing drills." },
        { department: "Sports Medicine & Outpatients", duration: "1 Month", role: "Dry needling, rigid taping, rotator cuff rehabilitation, functional athletic testing." }
      ],
      careerOptions: [
        { title: "Clinical Physiotherapist", description: "Hospitals, orthopedic clinics, geriatric care centers, multispecialty chains.", avgStartingSalary: "₹5L - ₹8.5L per annum" },
        { title: "Sports Rehabilitation Therapist", description: "National sports academies, cricket/soccer franchises, athletic club consulting.", avgStartingSalary: "₹8L - ₹18L per annum" }
      ],
      postGraduation: [
        "MPT (Master of Physiotherapy - Orthopaedics, Neurology, Sports, Cardio-Pulmonary)",
        "M.Sc in Sports Biomechanics",
        "Fellowship in Manual Therapy (FMT)",
        "Certified Ergonomic Assessment specialist"
      ],
      geminiAnalysis: {
        difficultyRating: "8.9 / 10 (High Biomechanical Math & Manual Technique Performance)",
        highYieldTopics: [
          "Biomechanics: Levers in human body, gait cycle phases and muscle actions.",
          "Electrotherapy: SD (Strength-Duration) Curve, physiological actions of Iontophoresis.",
          "Exercise Therapy: Suspension therapy setups, PNF patterns."
        ],
        goldMedalistTip: "Master surface anatomy. You must be able to palpate ligaments, bony landmarks, and major nerves blindfolded for premium clinical assessments.",
        aiStudySchedule: "Focus on video-based movement analysis. Combine manual practice sessions on peers with joint kinematics reading."
      }
    }
  },
  {
    id: "BSC NURSING",
    name: "BSC NURSING",
    fullName: "B.Sc. Nursing Professional",
    description: "Advanced pediatric and ICU nursing process templates, medical charts, and structured Care Plans (NCP).",
    bgLightClass: "from-pink-50/50 to-rose-50/30",
    accentTextClass: "text-pink-600",
    details: {
      duration: "4 Years",
      eligibility: "Physics, Chemistry, Biology in Senior Secondary + state nursing entrances",
      yearlySyllabus: [
        {
          year: "1st Year (12 Months)",
          subjects: ["Anatomy & Physiology", "Nutrition & Biochemistry", "Nursing Foundations", "Psychology & Microbiology"],
          topics: ["Basic skeletal-muscular systems, visceral organs, endocrine path", "Calorie math, biochemical cycles, vitamins, food prep", "Vitals monitoring, bedmaking, patient hygiene, CPR, charting", "Coping mechanisms, pathogen cultures, sterilization, asepsis"]
        },
        {
          year: "2nd Year (12 Months)",
          subjects: ["Medical Surgical Nursing (I)", "Pharmacology, Pathology & Genetics", "Community Health Nursing (I)", "Sociology"],
          topics: ["Systemic medical care, surgical setups, gastrointestinal, respiratory", "Drug doses, iv fluid calculation, cell pathology, genetics", "Demography, environmental health, rural care, health systems", "Social structures, health sociology, community culture influence"]
        },
        {
          year: "3rd Year (12 Months)",
          subjects: ["Medical Surgical Nursing (II)", "Child Health (Pediatric) Nursing", "Mental Health (Psychiatric) Nursing", "Nursing Research & Statistics"],
          topics: ["Oncology, ICU care, emergency care, disaster response management", "Newborn care, congenital conditions, immunization charts, pediatric NCP", "Psychotic disorders, therapeutic communication, electroconvulsive therapy", "Research design, sample selection, biostatistical analysis"]
        },
        {
          year: "4th Year (12 Months)",
          subjects: ["Midwifery & Obstetrical Nursing", "Community Health Nursing (II)", "Nursing Management & Administration"],
          topics: ["Antenatal checking, normal labor care, high-risk pregnancy, neonatal care", "Urban healthcare, national health programs, school wellness camps", "Ward inventory management, staff duties, hospital laws, quality assurance"]
        }
      ],
      clinicalRotations: [
        { department: "Medical-Surgical ICU", duration: "3 Months", role: "Intubation support, catheterization, central line monitoring, administering code medications." },
        { department: "Maternity & Labor Rooms", duration: "3 Months", role: "Assisting normal delivery, checking APGAR score, post-partum hemorrhage check." },
        { department: "Pediatric Wards", duration: "2 Months", role: "Administering pediatric vaccinations, pediatric drug math, phototherapy setup." },
        { department: "Psychiatric Asylum", duration: "1 Month", role: "Mental status exams, assisting behavioral therapy sessions, sedative management." }
      ],
      careerOptions: [
        { title: "Staff Nurse / ICU Care Nurse", description: "Tertiary private hospitals, state government medical colleges, emergency wards.", avgStartingSalary: "₹4.5L - ₹8L per annum" },
        { title: "Nurse Educator / Assistant Professor", description: "Academic nursing institutes, corporate training hospitals, health research centers.", avgStartingSalary: "₹6L - ₹10L per annum" }
      ],
      postGraduation: [
        "M.Sc Nursing (Medical-Surgical, Pediatrics, OBGYN, Psychiatry, Community Health)",
        "Post Basic Diploma in Critical Care Nursing",
        "Nurse Practitioner in Critical Care (NPCC)",
        "Ph.D in Nursing Education"
      ],
      geminiAnalysis: {
        difficultyRating: "8.7 / 10 (Heavy Clinical Rotations & High Patient Responsibility)",
        highYieldTopics: [
          "Nursing Foundations: Fluid/Electrolyte balance, Blood transfusion protocols.",
          "Obstetrics: Stages of Labor, APGAR Scoring, Lochia assessment.",
          "Pediatrics: Developmental milestones, IMNCI guidelines."
        ],
        goldMedalistTip: "Be immaculate with drug dosage calculations. Memorize conversion formulas (drops/min, mcg/kg/min) as they are the most tested clinical viva questions.",
        aiStudySchedule: "Spend 30 minutes every evening practicing Nursing Care Plans (NCP). Formulate mock plans for stroke, appendicitis, and normal labor cases."
      }
    }
  },
  {
    id: "BDS",
    name: "BDS",
    fullName: "Bachelor of Dental Surgery",
    description: "Tooth preparation margins, prosthodontics, advanced endodontics, and oral maxillofacial surgery blueprints.",
    bgLightClass: "from-indigo-50/50 to-violet-50/30",
    accentTextClass: "text-indigo-600",
    details: {
      duration: "5 Years (4 Years Academics + 1 Year Compulsory Rotatory Internship)",
      eligibility: "Physics, Chemistry, Biology + qualifying score in NEET-UG",
      yearlySyllabus: [
        {
          year: "1st Year (12 Months)",
          subjects: ["General Anatomy, Embryology & Histology", "General Physiology & Biochemistry", "Dental Anatomy, Embryology & Oral Histology"],
          topics: ["Head & neck anatomy, brain structure, cranial nerves", "Hematology, respiration, oral cavity digestive enzymes", "Tooth morphology, deciduous teeth, amelogenesis, dentinogenesis"]
        },
        {
          year: "2nd Year (12 Months)",
          subjects: ["General Pathology & Microbiology", "General & Dental Pharmacology", "Dental Materials", "Pre-clinical Prosthodontics & Operative Dentistry"],
          topics: ["Oral cancers, focal infections, dental caries bacteriology", "Anesthetics, analgesics, antibiotics, fluoride pharmacology", "Gypsum products, dental resins, zinc oxide eugenol, cements", "Wax models, typhodont tooth preparations, cavity carvings"]
        },
        {
          year: "3rd Year (12 Months)",
          subjects: ["General Medicine", "General Surgery", "Oral Pathology & Oral Microbiology"],
          topics: ["Systemic illnesses with oral symptoms, bleeding tendencies", "Wound healing, jaw fractures, general anesthesia protocols", "Odontogenic tumors, ameloblastoma, dry socket pathology"]
        },
        {
          year: "4th Year (12 Months)",
          subjects: ["Oral Medicine & Radiology", "Oral & Maxillofacial Surgery", "Prosthodontics & Crown & Bridge", "Conservative Dentistry & Endodontics", "Orthodontics", "Periodontics", "Pedodontics", "Public Health Dentistry"],
          topics: ["Intraoral x-rays, diagnosing mucosal lesions", "Surgical extractions, impaction surgeries, jaw cyst removals", "Complete dentures, partial dentures, porcelain fused crowns", "Root canal treatments (RCT), gold/silver fillings, glass ionomer", "Malocclusions, braces wiring, space maintainers", "Scaling, root planing, gum flap surgeries, gingivitis care", "Pediatric fillings, stainless steel crowns, dental fear management", "Fluoride drinking schemes, dental health surveys"]
        }
      ],
      clinicalRotations: [
        { department: "Oral & Maxillofacial Surgery", duration: "2 Months", role: "Conducting simple extractions, injecting local anesthesia, jaw splinting assistance." },
        { department: "Conservative Dentistry & RCT", duration: "2 Months", role: "Carrying out single-root canal therapies, composite fillings, dental pulp checking." },
        { department: "Prosthodontics", duration: "2 Months", role: "Taking alginate impressions, complete denture try-ins, crown preparation adjustments." },
        { department: "Periodontology Wards", duration: "1.5 Months", role: "Manual and ultrasonic scaling, gingival curettage, writing post-scaling logs." }
      ],
      careerOptions: [
        { title: "Dental Surgeon", description: "Opening dental clinics, associate surgeon at dental franchise chains.", avgStartingSalary: "₹6L - ₹11L per annum" },
        { title: "Cosmetic Dentist / Orthodontics Consultant", description: "Specializing in cosmetic smile designs, veneer placements, invisalign orthodontics.", avgStartingSalary: "₹10L - ₹20L per annum" }
      ],
      postGraduation: [
        "MDS (Master of Dental Surgery - Oral Surgery, Prosthodontics, Endodontics, Orthodontics)",
        "Master of Public Health (MPH)",
        "PG Diploma in Forensic Odontology",
        "Clinical Implantology Certification"
      ],
      geminiAnalysis: {
        difficultyRating: "9.2 / 10 (Very High Manual Dexterity & Precision Handwork Requirements)",
        highYieldTopics: [
          "Dental Anatomy: Key traits of Permanent Maxillary 1st Molar, pulp chamber structures.",
          "Oral Pathology: Ameloblastoma histopathology, Odontogenic keratocyst features.",
          "Oral Surgery: Maxillary nerve block administration landmarks, extraction force directions."
        ],
        goldMedalistTip: "Spend extra hours in the carving lab in 1st year. Perfection in wax carving direct-correlates to your tooth preparation margin controls on live patients in 4th year.",
        aiStudySchedule: "Structure your days in a 50/50 ratio: spend mornings reviewing clinical radiography guides and afternoons practicing pre-clinical typhodont restorations."
      }
    }
  }
];

interface DegreeProgramsProps {
  notes: MedicalNote[];
  selectedDegree: string;
  setSelectedDegree: (degree: string) => void;
}

export const DegreePrograms: React.FC<DegreeProgramsProps> = ({
  notes,
  selectedDegree,
  setSelectedDegree
}) => {
  // State to handle Course Details modal
  const [selectedDetailProgram, setSelectedDetailProgram] = useState<DegreeProgram | null>(null);
  
  // State for active tab inside course details modal
  const [activeModalTab, setActiveModalTab] = useState<"syllabus" | "rotations" | "careers" | "gemini">("syllabus");

  // State for interactive test checklist (study planner game)
  const [checklistStates, setChecklistStates] = useState<Record<string, boolean>>({});

  const toggleChecklist = (key: string) => {
    setChecklistStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getNoteCountForDegree = (degreeName: string) => {
    return notes.filter((n) => getNoteDegree(n) === degreeName).length;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section className="py-12 bg-transparent relative z-20" id="degree-programs-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with high-end aesthetic details */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50/50 px-3 py-1 text-[11px] font-bold tracking-tight text-sky-800 mb-3 shadow-xs">
              <GraduationCap className="h-3.5 w-3.5 text-sky-500" />
              <span>ACADEMIC CURRICULUMS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Browse by <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">Degree Programs</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
              Explore gold-medalist audited syllabus blueprints, curriculum logs, and logos designed with Gemini.
            </p>
          </div>

          {/* Quick Clear Filter Option */}
          {selectedDegree !== "All" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedDegree("All")}
              className="flex items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50/80 hover:bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 transition-all cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5 text-rose-500" />
              <span>Reset Filters (Show All)</span>
            </motion.button>
          )}
        </div>

        {/* Dynamic Horizontal Quick Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedDegree("All")}
            className={`relative rounded-2xl px-5 py-3 text-xs font-bold transition-all duration-300 cursor-pointer shrink-0 border ${
              selectedDegree === "All"
                ? "bg-slate-950 text-white border-slate-950 shadow-md shadow-slate-950/10"
                : "bg-white/80 hover:bg-white text-slate-600 border-slate-200/80 hover:border-slate-300"
            }`}
          >
            {selectedDegree === "All" && (
              <motion.div
                layoutId="active-degree-pill"
                className="absolute inset-0 bg-slate-950 rounded-2xl -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span>All Specializations ({notes.length})</span>
          </button>

          {DEGREE_PROGRAMS_DATA.map((program) => {
            const isActive = selectedDegree === program.id;
            const noteCount = getNoteCountForDegree(program.id);
            return (
              <button
                key={program.id}
                onClick={() => setSelectedDegree(program.id)}
                className={`relative rounded-2xl px-5 py-3 text-xs font-bold transition-all duration-300 cursor-pointer shrink-0 border flex items-center gap-2 ${
                  isActive
                    ? "bg-slate-950 text-white border-slate-950 shadow-md shadow-slate-950/10"
                    : "bg-white/80 hover:bg-white text-slate-600 border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-degree-pill"
                    className="absolute inset-0 bg-slate-950 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{program.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"
                }`}>
                  {noteCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Staggered Grid of Premium Cards representing degree types */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {DEGREE_PROGRAMS_DATA.map((program) => {
            const isFilterSelected = selectedDegree === program.id;
            const count = getNoteCountForDegree(program.id);

            return (
              <motion.div
                key={program.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => {
                  setSelectedDetailProgram(program);
                  setActiveModalTab("syllabus");
                }}
                className={`group relative rounded-3xl border p-6 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isFilterSelected 
                    ? "border-slate-950 bg-white shadow-xl ring-2 ring-slate-950" 
                    : "border-slate-100 bg-white/70 backdrop-blur-md hover:shadow-lg hover:bg-white"
                }`}
              >
                
                {/* Decorative background visual details */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${program.bgLightClass} opacity-40 blur-2xl -z-10 pointer-events-none transition-transform duration-500 group-hover:scale-125`}></div>
                
                <div>
                  {/* Top line with Gemini-Designed SVG Logo and Note Count badge */}
                  <div className="flex items-center justify-between mb-4">
                    <DegreeLogo id={program.id} size="md" className="group-hover:scale-105 transition-transform duration-300 shadow-md" />
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-500">
                      <span className="font-mono">{count}</span>
                      <span>Blueprints</span>
                    </div>
                  </div>

                  {/* Program Titles */}
                  <h3 className="font-display text-lg font-black tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors duration-200 mt-2">
                    {program.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mt-0.5 leading-snug">
                    {program.fullName}
                  </span>

                  {/* Short Description */}
                  <p className="mt-3 text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {program.description}
                  </p>
                </div>

                {/* Interactive footer line */}
                <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 group-hover:text-sky-700 transition-colors">
                    View Course Details
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all duration-300">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>

      </div>

      {/* Course Detail Immersive Modal / Drawer Dialog */}
      <AnimatePresence>
        {selectedDetailProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetailProgram(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md cursor-pointer"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100"
            >
              {/* Top Banner / Color Block representing the course */}
              <div className={`p-6 sm:p-8 bg-gradient-to-r ${selectedDetailProgram.bgLightClass.replace("to-indigo-50/30", "to-indigo-100/40").replace("to-teal-50/30", "to-teal-100/40").replace("to-cyan-50/30", "to-cyan-100/40").replace("to-amber-50/30", "to-amber-100/40").replace("to-rose-50/30", "to-rose-100/40").replace("to-violet-50/30", "to-violet-100/40")} border-b border-slate-100 flex items-start justify-between relative`}>
                
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <DegreeLogo id={selectedDetailProgram.id} size="lg" className="shadow-lg border-2 border-white shrink-0" />
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/10 px-2.5 py-0.5 text-[10px] font-bold tracking-tight text-slate-800">
                      <Award className="h-3.5 w-3.5 text-slate-700" />
                      <span>PROFESSIONAL MEDICAL DEGREE</span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1.5">
                      {selectedDetailProgram.name}
                    </h2>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wide mt-0.5 leading-snug">
                      {selectedDetailProgram.fullName}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedDetailProgram(null)}
                  className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-700 transition-all border border-slate-200/50 cursor-pointer absolute top-6 right-6"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-100 bg-slate-50/50 overflow-x-auto scrollbar-none shrink-0">
                <button
                  onClick={() => setActiveModalTab("syllabus")}
                  className={`flex items-center gap-2 px-6 py-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    activeModalTab === "syllabus"
                      ? "border-slate-950 text-slate-950 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Syllabus Blueprint</span>
                </button>
                <button
                  onClick={() => setActiveModalTab("rotations")}
                  className={`flex items-center gap-2 px-6 py-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    activeModalTab === "rotations"
                      ? "border-slate-950 text-slate-950 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Building className="h-4 w-4" />
                  <span>Clinical Postings</span>
                </button>
                <button
                  onClick={() => setActiveModalTab("careers")}
                  className={`flex items-center gap-2 px-6 py-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    activeModalTab === "careers"
                      ? "border-slate-950 text-slate-950 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Career & PG Streams</span>
                </button>
                <button
                  onClick={() => setActiveModalTab("gemini")}
                  className={`flex items-center gap-2 px-6 py-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    activeModalTab === "gemini"
                      ? "border-slate-950 text-slate-950 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-sky-500 animate-pulse" />
                  <span>Gemini AI Insights</span>
                </button>
              </div>

              {/* Scrollable Details Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                
                {/* Standard stats summary line */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-sky-50 border border-sky-100">
                      <Clock className="h-4 w-4 text-sky-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Course Duration</span>
                      <span className="text-xs font-bold text-slate-700">{selectedDetailProgram.details.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100">
                      <GraduationCap className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Eligibility criteria</span>
                      <span className="text-xs font-bold text-slate-700">{selectedDetailProgram.details.eligibility}</span>
                    </div>
                  </div>
                </div>

                {/* TAB 1: Syllabus Blueprint */}
                {activeModalTab === "syllabus" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                        Professional Syllabus Breakdown
                      </h4>
                      <div className="space-y-4">
                        {selectedDetailProgram.details.yearlySyllabus.map((yearSyllabus, idx) => (
                          <div key={idx} className="border border-slate-100 bg-white rounded-2xl p-5 hover:border-slate-200 hover:shadow-xs transition-all">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-black text-slate-900 font-display flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-sky-500" />
                                {yearSyllabus.year}
                              </span>
                            </div>
                            
                            {/* Subjects tags */}
                            <div className="flex flex-wrap gap-1.5 mb-3.5">
                              {yearSyllabus.subjects.map((sub, sIdx) => (
                                <span key={sIdx} className="rounded-lg bg-sky-50/50 border border-sky-100/60 text-sky-700 font-bold px-2.5 py-1 text-[10px] uppercase">
                                  {sub}
                                </span>
                              ))}
                            </div>

                            {/* Syllabus high-yield topics bullets */}
                            <div className="bg-slate-50/60 rounded-xl p-3 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Syllabus Highlights:</span>
                              <ul className="space-y-1">
                                {yearSyllabus.topics.map((topic, tIdx) => (
                                  <li key={tIdx} className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                                    <span className="text-sky-500 font-bold mt-0.5">•</span>
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: Clinical Rotations */}
                {activeModalTab === "rotations" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                        <Building className="h-3.5 w-3.5 text-emerald-500" />
                        Clinical Postings & Duties Schedule
                      </h4>
                      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                        Compulsory clinical rotations audited to prepare students for core inpatient triage, diagnostics, minor surgical processes, and hospital rounds.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedDetailProgram.details.clinicalRotations.map((rot, rIdx) => (
                          <div key={rIdx} className="border border-slate-100 bg-white rounded-2xl p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">{rot.department}</span>
                                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 font-mono shrink-0">
                                  {rot.duration}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed mt-2.5">
                                <strong className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Clinical Duties:</strong>
                                {rot.role}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: Career & PG Options */}
                {activeModalTab === "careers" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Career Streams */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
                        Post-Graduation Careers & Streams
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {selectedDetailProgram.details.careerOptions.map((opt, oIdx) => (
                          <div key={oIdx} className="border border-slate-100 bg-white rounded-2xl p-5">
                            <span className="text-xs font-black text-slate-900 block font-display">{opt.title}</span>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.description}</p>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Stipend / Salary</span>
                              <span className="text-xs font-black text-emerald-600 font-mono">{opt.avgStartingSalary}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Specializations list */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Popular Specializations (PG Streams):</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedDetailProgram.details.postGraduation.map((pg, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 bg-white px-3 py-2.5 rounded-xl border border-slate-100">
                              <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
                              <span className="font-medium leading-tight">{pg}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 4: Gemini AI Analysis */}
                {activeModalTab === "gemini" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl p-6 border border-sky-100/50 relative overflow-hidden">
                      {/* Floating glowing background badge */}
                      <Sparkles className="h-24 w-24 text-sky-200/40 absolute -bottom-5 -right-5 pointer-events-none" />

                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-sky-500 animate-spin" />
                        <span className="text-xs font-black text-sky-800 uppercase tracking-wider font-display">Gemini AI Audit & Advice</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Academics Difficulty index:</span>
                        <span className="text-xs font-black text-sky-700 bg-sky-100 border border-sky-200 rounded-lg px-2 py-0.5 font-mono">
                          {selectedDetailProgram.details.geminiAnalysis.difficultyRating}
                        </span>
                      </div>

                      {/* Gold medalist advice */}
                      <div className="bg-white/90 border border-sky-100/80 p-4 rounded-xl mb-4 shadow-xs">
                        <strong className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">Gold Medalist's Pro Tip:</strong>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                          "{selectedDetailProgram.details.geminiAnalysis.goldMedalistTip}"
                        </p>
                      </div>

                      {/* High Yield Weightage Topics */}
                      <div className="mb-4">
                        <strong className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">High-Yield Exam Focus (Highest Weightage):</strong>
                        <div className="space-y-1.5">
                          {selectedDetailProgram.details.geminiAnalysis.highYieldTopics.map((topic, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-600">
                              <span className="text-sky-500 font-bold mt-0.5">•</span>
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Study planner interactive checklist game */}
                      <div className="border-t border-sky-100/60 pt-4 mt-4">
                        <strong className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block mb-3 flex items-center gap-1">
                          <ClipboardList className="h-4 w-4" />
                          Interactive Exam-Prep Study Tracker
                        </strong>
                        <div className="space-y-2">
                          {selectedDetailProgram.details.yearlySyllabus[0].subjects.map((subject, subIdx) => {
                            const uniqueKey = `${selectedDetailProgram.id}-${subject}`;
                            const isCompleted = !!checklistStates[uniqueKey];
                            return (
                              <button
                                key={subIdx}
                                onClick={() => toggleChecklist(uniqueKey)}
                                className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                                  isCompleted 
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                                    : "bg-white/80 border-slate-150 text-slate-700 hover:border-slate-300"
                                }`}
                              >
                                <span className="text-xs font-bold">{subject} Blueprint Mastered?</span>
                                <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                                  isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                                }`}>
                                  {isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-4 text-[10px] text-slate-400 font-medium leading-relaxed">
                          *Checklist updates dynamically for the current session to assist real-time mock testing planning.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Modal footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping"></span>
                  <span className="text-xs font-bold text-slate-500">Curriculum structured and audited according to NMC guidelines.</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedDegree(selectedDetailProgram.id);
                    setSelectedDetailProgram(null);
                    // Smoothly scroll down to the marketplace section to see results instantly
                    document.getElementById("marketplace-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
                >
                  Apply Filter & View Blueprints
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
