// ============================================================
// src/data/edportfolio.ts
// ✏️  Edit this file with Edgar's real information
// All content on the site comes from here
// ============================================================

// ── Interfaces (TypeScript shapes) ───────────────────────────
export interface Skill {
  name:     string;
  level:    number;   // 1–5
  category: "Data" | "Web" | "Tools";
}

export interface Project {
  id:          string;
  title:       string;
  category:    string;
  description: string;
  stack:       string[];
  link:        string;
  year:        string;
  image:       string | null;
  featured:    boolean;
}

export interface Education {
  period: string;
  degree: string;
  school: string;
  note:   string;
}

// ── Profile ──────────────────────────────────────────────────
// avatar: drop photo into public/images/ then change null to path
// e.g.  avatar: "/images/edgar.jpg"
export const PROFILE = {
  name:     "EDGAR SATIEL MATERU",
  initials: "CANTINO",
  role:     "Data Science Student",
  subtitle: "Transforming Data Into Decisions",
  bio:      "A driven Data Science student with a passion for uncovering patterns in complex data and building intelligent systems. I combine statistical rigour with full-stack development skills to deliver end-to-end data solutions that are both accurate and impactful.",
  email:    "materuedgar@gmail.com",
  github:   "https://github.com/materuedgar",
  linkedin: "https://linkedin.com/in/materuedgar",
  location: "Dar es Salaam, Tanzania",
  avatar:   "/images/edgar.jpeg",  // ← change to "/images/edgar.jpg"
};

// ── Skills (same discipline as Happiness) ────────────────────
export const SKILLS: Skill[] = [
  // Data Science
  { name: "Python",        level: 4, category: "Data" },
  { name: "R",             level: 3, category: "Data" },
  { name: "SQL",           level: 4, category: "Data" },
  { name: "Pandas",        level: 3, category: "Data" },
  { name: "NumPy",         level: 3, category: "Data" },
  { name: "Scikit-learn",  level: 3, category: "Data" },
  { name: "Matplotlib",    level: 3, category: "Data" },
  { name: "XGBoost",       level: 2, category: "Data" },

  // Web
  { name: "HTML & CSS",    level: 4, category: "Web"  },
  { name: "JavaScript",    level: 3, category: "Web"  },
  { name: "React",         level: 3, category: "Web"  },
  { name: "Node.js",       level: 2, category: "Web"  },
  { name: "PHP",           level: 3, category: "Web"  },
  { name: "Laravel",       level: 2, category: "Web"  },

  // Tools
  { name: "Git & GitHub",  level: 3, category: "Tools" },
  { name: "Jupyter",       level: 4, category: "Tools" },
  { name: "MySQL",         level: 3, category: "Tools" },
  { name: "VS Code",       level: 4, category: "Tools" },
];

// ── Projects ─────────────────────────────────────────────────
export const PROJECTS: Project[] = [
  {
    id:          "01",
    title:       "Premier League Match Outcome Predictor",
    category:    "Machine Learning",
    description: "Built a predictive model that forecasts Premier League match results using historical performance data, player statistics, and home/away factors. Achieved 79% prediction accuracy using a Random Forest classifier. Deployed as a lightweight Flask API.",
    stack:       ["Python", "Scikit-learn", "Pandas", "Flask", "SQL"],
    link:        "https://github.com/materuedgar",
    year:        "2024",
    image:       "/images/etsad.jpg",   // ← change to "/images/project1.jpg"
    featured:    true,
  },
  {
    id:          "02",
    title:       "Real-Time Sales Analytics Dashboard",
    category:    "Full-Stack · Data Viz",
    description: "Full-stack analytics platform that ingests retail sales data from MySQL, performs trend analysis and forecasting using Python, then displays KPIs and charts through a responsive React dashboard with live updates.",
    stack:       ["React", "Python", "MySQL", "Node.js", "Matplotlib"],
    link:        "https://github.com/materuedgar",
    year:        "2024",
    image:       null,   // ← change to "/images/project2.jpg"
    featured:    false,
  },
];

// ── Education ────────────────────────────────────────────────
export const EDUCATION: Education[] = [
  {
    period: "2023 – Present",
    degree: "Bachelor degree in Data Science",
    school: "EASTERN AFRICA STATISTICAL TRAINING CENTRE",   // ← update with real name
    note:   "Studying machine learning, statistical modelling, data engineering, and software development. Active in research projects involving real-world datasets.",
  },
  {
    period: "2023",
    degree: "Certificate: Google Web Development course",
    school: "Online / Self-study",
    note:   "Completed structured learning in HTML, CSS, JavaScript, React, and backend development with Node.js and Laravel.",
  },
];

// ── Colour map for skill categories ──────────────────────────
export const CATEGORY_COLORS: Record<string, string> = {
  Data:  "#6CABDD",   // Man City sky blue
  Web:   "#1C2C5B",   // deep navy
  Tools: "#C5A028",   // gold
};

// ── Stats shown on hero ───────────────────────────────────────
export const STATS = [
  { value: 2,  suffix: "+",  label: "Projects"       },
  { value: 18, suffix: "",   label: "Skills"         },
  { value: 79, suffix: "%",  label: "Best Accuracy"  },
  { value: 2,  suffix: "+",  label: "Years Studying" },
];