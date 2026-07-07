// src/features/search/utils/skillIcons.js
//
// Maps a skill/subcategory name to an icon + accent color.
// - Tech/dev skills use real brand logos (react-icons/si)
// - Everything else uses a field-relevant icon (react-icons/fa6)
// - Unmapped skills fall back to a generic briefcase icon
//
// Requires: npm install react-icons

import {
  FaCode, FaMobileScreen, FaServer, FaCss3, FaRobot, FaBrain,
  FaShieldHalved, FaCubes, FaVial, FaGears, FaPlug,
  FaPalette, FaPenNib, FaObjectGroup, FaBrush, FaFilm, FaCouch, FaShirt,
  FaBoxOpen, FaImage,
  FaMagnifyingGlass, FaEnvelope, FaLink, FaBullhorn, FaChartLine, FaLinkedin,
  FaFeather, FaPenFancy, FaFileLines, FaUserSecret, FaAddressCard, FaBlog,
  FaLanguage, FaSpellCheck, FaPen,
  FaCalculator, FaFileInvoiceDollar, FaBook, FaReceipt, FaSackDollar,
  FaBriefcase, FaChartPie, FaChartBar,
  FaScaleBalanced, FaFileContract, FaStamp, FaLightbulb, FaBuilding,
  FaPhone, FaHandshake, FaHeadset,
  FaRoad, FaBolt, FaMicrochip, FaCompassDrafting,
  FaFaucet, FaHammer, FaPaintRoller, FaTrowelBricks, FaSnowflake,
  FaTemperatureLow, FaVideo, FaDroplet, FaScrewdriverWrench,
  FaScissors, FaSpa, FaHandSparkles, FaHandHoldingHeart, FaLeaf,
  FaDumbbell, FaAppleWhole,
  FaBookOpen, FaComments, FaMusic,
  FaStethoscope, FaTooth, FaUserNurse, FaPills, FaFlaskVial,
  FaHelmetSafety, FaRulerCombined,
  FaCar, FaMotorcycle,
  FaCamera, FaCalendarCheck, FaRing,
  FaIndustry,
  FaTruck, FaWarehouse, FaBoxesStacked,
  FaBroom, FaUtensils, FaBaby, FaPaw,
  FaTractor, FaCow, FaDrumstickBite,
  FaUserShield, FaFireExtinguisher,
  FaSliders, FaMicrophoneLines, FaClapperboard, FaHashtag, FaMicrophone,
  FaUserTie, FaKeyboard, FaListCheck, FaBoxesPacking, FaUsers, FaPlane,
  FaUmbrella, FaHouse,
} from 'react-icons/fa6';

import {
  SiReact, SiNodedotjs, SiPython, SiPhp, SiLaravel, SiWordpress, SiShopify,
  SiFlutter, SiDotnet, SiAngular, SiVuedotjs,
  SiGooglecloud, SiDocker, SiMongodb, SiEthereum,
  SiGoogleads, SiFacebook, SiInstagram, SiYoutube,
} from 'react-icons/si';

// name -> { icon: Component, color: hex }
export const SKILL_ICON_MAP = {
  // Software & IT
  'Full Stack Developer': { icon: FaCode, color: '#29c8d6' },
  'Frontend Developer': { icon: FaCss3, color: '#38bdf8' },
  'Backend Developer': { icon: FaServer, color: '#22c55e' },
  'Mobile App Developer (Android/iOS)': { icon: FaMobileScreen, color: '#a855f7' },
  'Flutter Developer': { icon: SiFlutter, color: '#02569B' },
  'React Native Developer': { icon: SiReact, color: '#61DAFB' },
  'WordPress Developer': { icon: SiWordpress, color: '#21759B' },
  'Shopify Developer': { icon: SiShopify, color: '#96BF48' },
  'Laravel Developer': { icon: SiLaravel, color: '#FF2D20' },
  'PHP Developer': { icon: SiPhp, color: '#777BB4' },
  'Python Developer': { icon: SiPython, color: '#3776AB' },
  'Java Developer': { icon: FaCode, color: '#f97316' },
  'C#/.NET Developer': { icon: SiDotnet, color: '#512BD4' },
  'Node.js Developer': { icon: SiNodedotjs, color: '#5FA04E' },
  'React.js Developer': { icon: SiReact, color: '#61DAFB' },
  'Angular Developer': { icon: SiAngular, color: '#DD0031' },
  'Vue.js Developer': { icon: SiVuedotjs, color: '#4FC08D' },
  'AI Developer': { icon: FaRobot, color: '#8b5cf6' },
  'Machine Learning Engineer': { icon: FaBrain, color: '#a855f7' },
  'Data Scientist': { icon: FaChartPie, color: '#0ea5e9' },
  'DevOps Engineer': { icon: SiDocker, color: '#2496ED' },
  'Cloud Engineer': { icon: SiGooglecloud, color: '#4285F4' },
  'Cyber Security Expert': { icon: FaShieldHalved, color: '#ef4444' },
  'Blockchain Developer': { icon: SiEthereum, color: '#627EEA' },
  'QA Tester': { icon: FaVial, color: '#eab308' },
  'Database Administrator': { icon: SiMongodb, color: '#47A248' },
  'ERP Developer': { icon: FaGears, color: '#64748b' },
  'API Developer': { icon: FaPlug, color: '#22c55e' },

  // Design & Creative
  'Graphic Designer': { icon: FaPalette, color: '#f43f5e' },
  'UI Designer': { icon: FaPenNib, color: '#a855f7' },
  'UX Designer': { icon: FaObjectGroup, color: '#8b5cf6' },
  'Logo Designer': { icon: FaPenNib, color: '#f97316' },
  'Brand Identity Designer': { icon: FaPalette, color: '#ec4899' },
  'Illustrator': { icon: FaBrush, color: '#f59e0b' },
  'Motion Graphics Designer': { icon: FaFilm, color: '#0ea5e9' },
  'Video Editor': { icon: FaFilm, color: '#22c55e' },
  'Animator': { icon: FaCubes, color: '#a855f7' },
  '3D Artist': { icon: FaCubes, color: '#6366f1' },
  'Interior Designer': { icon: FaCouch, color: '#d97706' },
  'Fashion Designer': { icon: FaShirt, color: '#ec4899' },
  'Product Designer': { icon: FaBoxOpen, color: '#0ea5e9' },
  'Packaging Designer': { icon: FaBoxOpen, color: '#f97316' },
  'NFT Artist': { icon: FaImage, color: '#8b5cf6' },

  // Digital Marketing
  'SEO Expert': { icon: FaMagnifyingGlass, color: '#22c55e' },
  'SEM Expert': { icon: SiGoogleads, color: '#4285F4' },
  'Google Ads Specialist': { icon: SiGoogleads, color: '#4285F4' },
  'Facebook Ads Expert': { icon: SiFacebook, color: '#1877F2' },
  'Instagram Marketing': { icon: SiInstagram, color: '#E4405F' },
  'LinkedIn Marketing': { icon: FaLinkedin, color: '#0A66C2' },
  'YouTube Marketing': { icon: SiYoutube, color: '#FF0000' },
  'Email Marketing': { icon: FaEnvelope, color: '#f59e0b' },
  'Affiliate Marketer': { icon: FaLink, color: '#0ea5e9' },
  'Content Marketer': { icon: FaBullhorn, color: '#f97316' },
  'Influencer Marketing': { icon: FaHashtag, color: '#ec4899' },
  'Marketing Consultant': { icon: FaChartLine, color: '#22c55e' },

  // Writing & Translation
  'Content Writer': { icon: FaFeather, color: '#0ea5e9' },
  'Copywriter': { icon: FaPenFancy, color: '#a855f7' },
  'Technical Writer': { icon: FaFileLines, color: '#64748b' },
  'Ghost Writer': { icon: FaUserSecret, color: '#334155' },
  'Resume Writer': { icon: FaAddressCard, color: '#f59e0b' },
  'Blog Writer': { icon: FaBlog, color: '#22c55e' },
  'Script Writer': { icon: FaFilm, color: '#f43f5e' },
  'Translator': { icon: FaLanguage, color: '#0ea5e9' },
  'Proofreader': { icon: FaSpellCheck, color: '#22c55e' },
  'Editor': { icon: FaPen, color: '#8b5cf6' },

  // Business & Finance
  'Accountant': { icon: FaCalculator, color: '#0ea5e9' },
  'Chartered Accountant': { icon: FaFileInvoiceDollar, color: '#22c55e' },
  'Bookkeeper': { icon: FaBook, color: '#f59e0b' },
  'Tax Consultant': { icon: FaReceipt, color: '#a855f7' },
  'Financial Advisor': { icon: FaSackDollar, color: '#22c55e' },
  'Business Consultant': { icon: FaBriefcase, color: '#64748b' },
  'Virtual CFO': { icon: FaChartLine, color: '#0ea5e9' },
  'Data Analyst': { icon: FaChartPie, color: '#8b5cf6' },
  'Business Analyst': { icon: FaChartBar, color: '#f97316' },

  // Legal
  'Lawyer': { icon: FaScaleBalanced, color: '#334155' },
  'Legal Advisor': { icon: FaScaleBalanced, color: '#475569' },
  'Contract Drafting': { icon: FaFileContract, color: '#0ea5e9' },
  'Trademark Expert': { icon: FaStamp, color: '#a855f7' },
  'Patent Consultant': { icon: FaLightbulb, color: '#f59e0b' },
  'Company Registration Consultant': { icon: FaBuilding, color: '#22c55e' },

  // Sales & Customer Support
  'Telecaller': { icon: FaPhone, color: '#22c55e' },
  'Sales Executive': { icon: FaHandshake, color: '#0ea5e9' },
  'Business Development Executive': { icon: FaHandshake, color: '#a855f7' },
  'Customer Support Executive': { icon: FaHeadset, color: '#f97316' },
  'Chat Support Agent': { icon: FaHeadset, color: '#ec4899' },
  'Call Center Representative': { icon: FaHeadset, color: '#0ea5e9' },

  // Engineering
  'Civil Engineer': { icon: FaRoad, color: '#64748b' },
  'Mechanical Engineer': { icon: FaGears, color: '#f97316' },
  'Electrical Engineer': { icon: FaBolt, color: '#eab308' },
  'Electronics Engineer': { icon: FaMicrochip, color: '#22c55e' },
  'Structural Engineer': { icon: FaBuilding, color: '#0ea5e9' },
  'AutoCAD Designer': { icon: FaCompassDrafting, color: '#a855f7' },
  'Architect': { icon: FaCompassDrafting, color: '#334155' },

  // Home Services
  'Electrician': { icon: FaBolt, color: '#eab308' },
  'Plumber': { icon: FaFaucet, color: '#0ea5e9' },
  'Carpenter': { icon: FaHammer, color: '#92400e' },
  'Painter': { icon: FaPaintRoller, color: '#f43f5e' },
  'Mason': { icon: FaTrowelBricks, color: '#a16207' },
  'AC Technician': { icon: FaSnowflake, color: '#0ea5e9' },
  'Refrigerator Technician': { icon: FaTemperatureLow, color: '#22c55e' },
  'CCTV Installer': { icon: FaVideo, color: '#334155' },
  'RO Technician': { icon: FaDroplet, color: '#0ea5e9' },
  'Appliance Repair': { icon: FaScrewdriverWrench, color: '#64748b' },

  // Beauty & Wellness
  'Makeup Artist': { icon: FaBrush, color: '#ec4899' },
  'Hair Stylist': { icon: FaScissors, color: '#a855f7' },
  'Beautician': { icon: FaSpa, color: '#f43f5e' },
  'Nail Artist': { icon: FaHandSparkles, color: '#ec4899' },
  'Spa Therapist': { icon: FaSpa, color: '#22c55e' },
  'Massage Therapist': { icon: FaHandHoldingHeart, color: '#0ea5e9' },
  'Yoga Trainer': { icon: FaLeaf, color: '#22c55e' },
  'Fitness Trainer': { icon: FaDumbbell, color: '#f97316' },
  'Personal Trainer': { icon: FaDumbbell, color: '#ef4444' },
  'Nutritionist': { icon: FaAppleWhole, color: '#22c55e' },

  // Education
  'Tutor': { icon: FaBookOpen, color: '#0ea5e9' },
  'Teacher': { icon: FaBookOpen, color: '#a855f7' },
  'Online Tutor': { icon: FaBookOpen, color: '#22c55e' },
  'Spoken English Trainer': { icon: FaComments, color: '#f97316' },
  'Coding Instructor': { icon: FaCode, color: '#29c8d6' },
  'Music Teacher': { icon: FaMusic, color: '#ec4899' },
  'Dance Teacher': { icon: FaMusic, color: '#f43f5e' },
  'Language Teacher': { icon: FaLanguage, color: '#0ea5e9' },

  // Healthcare
  'Doctor': { icon: FaStethoscope, color: '#0ea5e9' },
  'Dentist': { icon: FaTooth, color: '#22c55e' },
  'Physiotherapist': { icon: FaHandHoldingHeart, color: '#a855f7' },
  'Nurse': { icon: FaUserNurse, color: '#ec4899' },
  'Pharmacist': { icon: FaPills, color: '#f97316' },
  'Lab Technician': { icon: FaFlaskVial, color: '#22c55e' },
  'Caregiver': { icon: FaHandHoldingHeart, color: '#f43f5e' },
  'Medical Consultant': { icon: FaStethoscope, color: '#0ea5e9' },

  // Construction
  'Contractor': { icon: FaHelmetSafety, color: '#f97316' },
  'Builder': { icon: FaHelmetSafety, color: '#eab308' },
  'Site Supervisor': { icon: FaHelmetSafety, color: '#64748b' },
  'Quantity Surveyor': { icon: FaRulerCombined, color: '#0ea5e9' },
  'Surveyor': { icon: FaRulerCombined, color: '#22c55e' },
  'Building Consultant': { icon: FaBuilding, color: '#a855f7' },

  // Automotive
  'Car Mechanic': { icon: FaCar, color: '#334155' },
  'Bike Mechanic': { icon: FaMotorcycle, color: '#f97316' },
  'Auto Electrician': { icon: FaBolt, color: '#eab308' },
  'Car Detailer': { icon: FaCar, color: '#0ea5e9' },
  'Driver': { icon: FaCar, color: '#22c55e' },

  // Event Services
  'Photographer': { icon: FaCamera, color: '#334155' },
  'Videographer': { icon: FaVideo, color: '#0ea5e9' },
  'DJ': { icon: FaMusic, color: '#a855f7' },
  'Anchor': { icon: FaMicrophone, color: '#f43f5e' },
  'Event Planner': { icon: FaCalendarCheck, color: '#22c55e' },
  'Wedding Planner': { icon: FaRing, color: '#ec4899' },
  'Decorator': { icon: FaPalette, color: '#f97316' },

  // Manufacturing
  'Welder': { icon: FaIndustry, color: '#f97316' },
  'Fabricator': { icon: FaIndustry, color: '#64748b' },
  'Machine Operator': { icon: FaGears, color: '#0ea5e9' },
  'CNC Programmer': { icon: FaGears, color: '#a855f7' },
  'Production Supervisor': { icon: FaIndustry, color: '#334155' },

  // Logistics
  'Delivery Partner': { icon: FaTruck, color: '#22c55e' },
  'Courier Service': { icon: FaTruck, color: '#0ea5e9' },
  'Transport Contractor': { icon: FaTruck, color: '#f97316' },
  'Warehouse Staff': { icon: FaWarehouse, color: '#64748b' },
  'Forklift Operator': { icon: FaBoxesStacked, color: '#eab308' },

  // Domestic Services
  'Maid': { icon: FaBroom, color: '#0ea5e9' },
  'Housekeeper': { icon: FaBroom, color: '#22c55e' },
  'Cook': { icon: FaUtensils, color: '#f97316' },
  'Babysitter': { icon: FaBaby, color: '#ec4899' },
  'Elder Care': { icon: FaHandHoldingHeart, color: '#a855f7' },
  'Pet Care': { icon: FaPaw, color: '#f59e0b' },

  // Agriculture
  'Farmer': { icon: FaTractor, color: '#22c55e' },
  'Tractor Operator': { icon: FaTractor, color: '#a16207' },
  'Dairy Expert': { icon: FaCow, color: '#0ea5e9' },
  'Poultry Expert': { icon: FaDrumstickBite, color: '#f97316' },
  'Irrigation Technician': { icon: FaDroplet, color: '#0ea5e9' },

  // Security
  'Security Guard': { icon: FaShieldHalved, color: '#334155' },
  'Bouncer': { icon: FaUserShield, color: '#64748b' },
  'CCTV Operator': { icon: FaVideo, color: '#0ea5e9' },
  'Fire Safety Officer': { icon: FaFireExtinguisher, color: '#ef4444' },

  // Media & Entertainment
  'Singer': { icon: FaMicrophone, color: '#a855f7' },
  'Music Producer': { icon: FaSliders, color: '#0ea5e9' },
  'Voice Over Artist': { icon: FaMicrophoneLines, color: '#f97316' },
  'Actor': { icon: FaClapperboard, color: '#334155' },
  'Model': { icon: FaCamera, color: '#ec4899' },
  'Influencer': { icon: FaHashtag, color: '#f43f5e' },

  // Miscellaneous
  'Virtual Assistant': { icon: FaUserTie, color: '#0ea5e9' },
  'Data Entry Operator': { icon: FaKeyboard, color: '#64748b' },
  'Project Manager': { icon: FaListCheck, color: '#22c55e' },
  'Procurement Specialist': { icon: FaBoxesPacking, color: '#f97316' },
  'Recruiter (HR)': { icon: FaUsers, color: '#a855f7' },
  'Travel Agent': { icon: FaPlane, color: '#0ea5e9' },
  'Insurance Advisor': { icon: FaUmbrella, color: '#22c55e' },
  'Real Estate Agent': { icon: FaHouse, color: '#f59e0b' },
};

const FALLBACK = { icon: FaBriefcase, color: '#64748b' };

export const getSkillIcon = (skillName) => SKILL_ICON_MAP[skillName] || FALLBACK;