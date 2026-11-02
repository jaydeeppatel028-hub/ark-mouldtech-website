/**
 * Starting content for the website.
 *
 * Everything here is what the owner will be able to edit from the admin
 * panel (Step 3). Until the database is connected, the getters in
 * `src/lib/content.ts` read from this file.
 *
 * Rules from the brief: never invent clients, testimonials, certifications
 * or machine specifications. Leave optional fields empty instead.
 */

export type Company = {
  name: string;
  shortName: string;
  tagline: string;
  established: number;
  founder: string;
  address: { line1: string; line2: string; city: string; state: string; country: string; pincode?: string };
  phone: { display: string; tel: string };
  emails: { label: string; address: string; primary?: boolean }[];
  intro: string;
  about: string[];
  vision: string;
  mission: string;
  workshopArea: string;
  mapQuery: string;
  sectors: string[];
};

export type Category = {
  slug: string;
  name: string;
  group: string;
  summary: string;
  photo?: Photo;
  /** Show on the homepage "Products & Services" grid. */
  featured: boolean;
};

export type Photo = { src: string; alt: string; width: number; height: number };

export type Product = {
  slug: string;
  name: string;
  category: string; // Category.slug
  description?: string;
  material?: string;
  dimensions?: string;
  specifications?: string;
  applications?: string;
  photo?: Photo;
};

export type Machine = {
  name: string;
  quantity: string;
  brand?: string;
  model?: string;
  size?: string;
  xTravel?: string;
  yTravel?: string;
  zTravel?: string;
  tableSize?: string;
  maxCapacity?: string;
  other?: string;
  photo?: Photo;
};

export type GalleryItem = { caption: string; description?: string; photo?: Photo };
export type Client = { name: string; logo?: Photo; website?: string };
export type Testimonial = {
  customerName: string;
  companyName?: string;
  review?: string;
  screenshot?: Photo;
  logo?: Photo;
};
export type Reason = { icon: IconName; title: string; short: string; long: string };

export type IconName =
  | "factory"
  | "target"
  | "shield"
  | "draft"
  | "wrench"
  | "hand"
  | "pin"
  | "phone"
  | "mail"
  | "arrow"
  | "left"
  | "right"
  | "camera"
  | "image"
  | "check"
  | "plus"
  | "close"
  | "clock"
  | "users";

export const company: Company = {
  name: "ARK MOULDTECH SOLUTIONS",
  shortName: "ARK Mouldtech",
  tagline: "Precision Die & Mould Manufacturing",
  established: 2023,
  founder: "Mr. Nitin Mukesh",
  address: {
    line1: "WP-109, Women Park",
    line2: "Sanand GIDC, Sanand",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
  },
  phone: { display: "+91 75748 48090", tel: "+917574848090" },
  emails: [
    { label: "Sales", address: "nitin@arkmouldtech.com", primary: true },
    { label: "Design", address: "design@arkmouldtech.com" },
    { label: "Gmail", address: "arkmouldtech@gmail.com" },
  ],
  intro:
    "ARK Mouldtech Solutions was founded in 2023 to deliver reliable, high-quality moulding and tooling solutions. From our workshop in Sanand GIDC, one of Gujarat's major industrial hubs, we manufacture, repair and maintain precision moulds, dies, press tools and material handling equipment.",
  about: [
    "ARK Mouldtech Solutions was established in 2023 with a vision to deliver innovative, reliable and high-quality moulding and tooling solutions for a wide range of industries.",
    "Located in Sanand GIDC, Ahmedabad, one of Gujarat's major industrial hubs, the company specialises in manufacturing, repairing and maintaining precision moulds, dies, tooling and industrial handling equipment.",
    "We serve customers from the automotive, electronics, consumer goods and other manufacturing sectors, with a focus on quality manufacturing, technical expertise, reliable service and timely delivery.",
  ],
  vision:
    "To become a trusted and recognised engineering and manufacturing partner by delivering innovative, precision-driven and reliable tooling solutions.",
  mission:
    "To provide high-quality mould manufacturing, tooling and engineering solutions through modern infrastructure, technical expertise, continuous improvement and customer-focused service.",
  workshopArea: "7,000 sq. ft.",
  mapQuery: "WP-109 Women Park, Sanand GIDC, Sanand, Ahmedabad, Gujarat",
  sectors: ["Automotive", "Electronics", "Consumer goods", "General manufacturing"],
};

export const categories: Category[] = [
  {
    slug: "plastic-injection-mould",
    name: "Plastic Injection Mould",
    group: "Die & Mould Manufacturing",
    summary: "Custom injection moulds designed and built for consistent, repeatable plastic parts.",
    featured: true,
  },
  {
    slug: "blow-mould",
    name: "Blow Mould",
    group: "Die & Mould Manufacturing",
    summary: "Blow moulds for hollow plastic containers and components, made to your drawings.",
    featured: true,
  },
  {
    slug: "automobile-components-mould",
    name: "Automobile Components Mould",
    group: "Die & Mould Manufacturing",
    summary: "Moulds for automotive plastic parts, built to the fit and finish the industry expects.",
    featured: true,
  },
  {
    slug: "press-tools",
    name: "Press Tools",
    group: "Tooling",
    summary: "Press tools and dies for sheet metal forming, blanking and piercing operations.",
    featured: true,
  },
  {
    slug: "repair-maintenance",
    name: "Die & Mould Repair and Maintenance",
    group: "Repair & Maintenance",
    summary: "Repair, modification and reconditioning to bring injection and blow moulds back into production.",
    featured: true,
  },
  {
    slug: "industrial-trolleys",
    name: "Industrial Trolleys",
    group: "Material Handling",
    summary: "Part handling trolleys in mild steel and stainless steel, customised to your shop floor.",
    featured: true,
  },
  {
    slug: "precision-machining",
    name: "Precision Machining and Job Work",
    group: "Manufacturing & Job Work",
    summary: "VMC and EDM machining, moulding job work and custom engineering components.",
    featured: false,
  },
];

export const products: Product[] = [
  // Plastic injection mould
  { slug: "plastic-injection-mould-manufacturing", name: "Plastic Injection Mould Manufacturing", category: "plastic-injection-mould", description: "Injection moulds built to your part drawing or sample, for production of plastic components." },
  { slug: "custom-mould-design", name: "Custom Mould Design and Manufacturing", category: "plastic-injection-mould", description: "Mould design and manufacturing worked out around your part, material and production needs." },
  { slug: "precision-die-mould", name: "Precision Die and Mould Manufacturing", category: "plastic-injection-mould", description: "Dies and moulds machined in-house on VMC and EDM, then checked before delivery." },
  // Blow mould
  { slug: "blow-mould-manufacturing", name: "Blow Mould Manufacturing", category: "blow-mould", description: "Blow moulds for bottles, containers and hollow plastic parts." },
  // Automobile
  { slug: "automobile-components-mould-manufacturing", name: "Automobile Components Mould Manufacturing", category: "automobile-components-mould", description: "Moulds for plastic parts used in automobiles and two-wheelers." },
  // Press tools
  { slug: "press-tool-manufacturing", name: "Press Tool Manufacturing", category: "press-tools", description: "Press tools for blanking, piercing, bending and forming sheet metal parts." },
  // Repair and maintenance
  { slug: "injection-mould-repair", name: "Plastic Injection Mould Repair", category: "repair-maintenance", description: "Repair of damaged or worn injection moulds to get them back into production." },
  { slug: "blow-mould-repair", name: "Blow Mould Repair", category: "repair-maintenance", description: "Repair and correction of blow moulds." },
  { slug: "die-mould-maintenance", name: "Die and Mould Maintenance", category: "repair-maintenance", description: "Planned maintenance to keep dies and moulds running reliably." },
  { slug: "mould-modification", name: "Mould Modification", category: "repair-maintenance", description: "Changes to existing moulds for design updates or part improvements." },
  { slug: "tooling-reconditioning", name: "Tooling Repair and Reconditioning", category: "repair-maintenance", description: "Reconditioning of worn tooling to restore working condition." },
  // Trolleys
  { slug: "part-handling-trolley", name: "Part Handling Trolley", category: "industrial-trolleys", description: "Trolleys for moving parts safely between machines and stations." },
  { slug: "mild-steel-trolley", name: "Mild Steel Trolley", category: "industrial-trolleys", description: "Fabricated mild steel trolleys for general shop floor use." },
  { slug: "stainless-steel-trolley", name: "Stainless Steel Trolley", category: "industrial-trolleys", description: "Stainless steel trolleys for clean or corrosion-sensitive areas." },
  { slug: "customised-industrial-trolley", name: "Customised Industrial Trolley", category: "industrial-trolleys", description: "Trolleys built to your size, load and part-holding requirements." },
  { slug: "material-handling-solutions", name: "Material Handling Solutions", category: "industrial-trolleys", description: "Handling equipment designed around how parts move in your plant." },
  // Machining and job work
  { slug: "moulding-work", name: "All Types of Moulding Work", category: "precision-machining", description: "Moulding job work for plastic components." },
  { slug: "precision-machining-job-work", name: "Precision Machining Job Work", category: "precision-machining", description: "Machining job work to your drawings." },
  { slug: "vmc-machining", name: "VMC Machining", category: "precision-machining", description: "Vertical machining centre work for mould parts and components." },
  { slug: "edm-machining", name: "EDM Machining", category: "precision-machining", description: "Electrical discharge machining for detailed cavities and hard materials." },
  { slug: "custom-engineering-components", name: "Custom Engineering Components", category: "precision-machining", description: "One-off and small-batch engineering components made to order." },
];

export const machines: Machine[] = [
  { name: "VMC Machine", quantity: "2" },
  { name: "EDM Machine", quantity: "2" },
  { name: "Surface Grinding Machine", quantity: "1" },
  { name: "Milling Machine", quantity: "1" },
  { name: "M1TR Turret Milling Machine", quantity: "1" },
  { name: "Lathe Machine", quantity: "1" },
  { name: "Surface Plate", quantity: "1" },
  { name: "Inspection & Measuring Instruments", quantity: "Multiple" },
];

/** Gallery slots the owner will fill with real photographs. */
export const gallery: GalleryItem[] = [
  { caption: "Workshop exterior" },
  { caption: "Workshop interior" },
  { caption: "VMC machines" },
  { caption: "EDM machines" },
  { caption: "Grinding machine" },
  { caption: "Milling machines" },
  { caption: "Inspection equipment" },
  { caption: "Manufacturing operations" },
];

/** Filled by the owner from the admin panel. Never invent entries. */
export const clients: Client[] = [];
export const testimonials: Testimonial[] = [];

export const reasons: Reason[] = [
  {
    icon: "factory",
    title: "State-of-the-Art Infrastructure",
    short: "VMC, EDM, grinding and milling in-house, so work stays under our control.",
    long: "Our 7,000 sq. ft. workshop has VMC and EDM machining, surface grinding, milling and turning under one roof, so we control quality and timelines from start to finish.",
  },
  {
    icon: "target",
    title: "Precision Engineering",
    short: "Moulds and tools machined and checked against your drawings.",
    long: "Every mould and tool is machined to your drawing and checked with measuring instruments before it leaves the workshop.",
  },
  {
    icon: "shield",
    title: "Quality-Focused Manufacturing",
    short: "Inspection with measuring instruments at every key stage.",
    long: "We inspect parts at key stages of manufacturing rather than only at the end, so problems are caught early.",
  },
  {
    icon: "draft",
    title: "Customised Engineering Solutions",
    short: "Built around your part, your press and your production volume.",
    long: "No two parts are the same. We work from your drawing, sample or idea and build the tool around your machine and production volume.",
  },
  {
    icon: "wrench",
    title: "Repair & Maintenance Support",
    short: "Fast turnaround on mould repairs to keep your line running.",
    long: "Moulds wear and break. We repair, modify and recondition injection and blow moulds to get your production running again.",
  },
  {
    icon: "hand",
    title: "Customer-Oriented Approach",
    short: "Direct contact with the people building your tool, start to finish.",
    long: "You talk directly to the people designing and building your tool, with clear updates from inquiry to delivery.",
  },
  {
    icon: "pin",
    title: "Strategic Industrial Location",
    short: "Sanand GIDC, close to Ahmedabad's automotive and manufacturing belt.",
    long: "Based in Sanand GIDC, close to Ahmedabad's automotive and manufacturing belt, for quick visits, pickups and deliveries.",
  },
];

export const coreValues = [
  { title: "Quality", text: "Doing the job right, checked before it leaves our workshop." },
  { title: "Precision", text: "Working to the drawing, not close to it." },
  { title: "Integrity", text: "Honest timelines, honest pricing and clear communication." },
  { title: "Timely delivery", text: "Planning work so your production is not kept waiting." },
  { title: "Customer focus", text: "Building around what your part and process actually need." },
  { title: "Continuous improvement", text: "Learning from every tool we build and repair." },
];

export type PageSeo = { title: string; description: string };

export const seo: Record<string, PageSeo> = {
  home: {
    title: "Die & Mould Manufacturer in Sanand, Ahmedabad | ARK Mouldtech",
    description:
      "Plastic injection moulds, blow moulds, automobile component moulds, press tools and die & mould repair by ARK Mouldtech Solutions, Sanand GIDC, Ahmedabad.",
  },
  about: {
    title: "About Us | ARK Mouldtech Solutions, Sanand GIDC",
    description:
      "Established in 2023 by Mr. Nitin Mukesh, ARK Mouldtech Solutions is a die and mould manufacturing company in Sanand GIDC, Ahmedabad, Gujarat.",
  },
  products: {
    title: "Injection Moulds, Blow Moulds & Press Tools | ARK Mouldtech",
    description:
      "Plastic injection moulds, blow moulds, automobile component moulds, press tools, mould repair, industrial trolleys and VMC/EDM job work in Ahmedabad, Gujarat.",
  },
  infrastructure: {
    title: "Infrastructure: VMC & EDM Machines, Sanand | ARK Mouldtech",
    description:
      "A 7,000 sq. ft. workshop in Sanand GIDC with VMC machines, EDM machines, surface grinding, milling, turning and inspection equipment.",
  },
  why: {
    title: "Why Choose Us | ARK Mouldtech Solutions",
    description:
      "Why manufacturers choose ARK Mouldtech Solutions for die and mould manufacturing, repair and machining in Sanand, Ahmedabad.",
  },
  contact: {
    title: "Contact Us | ARK Mouldtech Solutions, Sanand GIDC, Ahmedabad",
    description:
      "Send an inquiry or call +91 75748 48090. ARK Mouldtech Solutions, WP-109, Women Park, Sanand GIDC, Ahmedabad, Gujarat.",
  },
};
