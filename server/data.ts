import { storage } from "./storage";
import { 
  InsertConstituent, 
  InsertTeamMember, 
  InsertRequest, 
  InsertAppointment,
  InsertUser,
  Category, 
  Status, 
  Priority,
} from "@shared/schema";

const CONSTITUENT_AVATARS = [
  "https://i.imgur.com/ZkBjJx4.png", // Spirited Away - Chihiro
  "https://i.imgur.com/qwOQoLT.png", // Howl's Moving Castle - Sophie
  "https://i.imgur.com/BpblRzk.png", // Princess Mononoke - San
  "https://i.imgur.com/y2G76zZ.png", // My Neighbor Totoro - Satsuki
  "https://i.imgur.com/yjjVp1W.png", // Kiki's Delivery Service - Kiki
  "https://i.imgur.com/KLA9jnJ.png", // Ponyo - Ponyo
  "https://i.imgur.com/PWwIsIr.png", // Castle in the Sky - Sheeta
  "https://i.imgur.com/UYHoUBa.png", // Spirited Away - No Face
  "https://i.imgur.com/MlPHpHh.png"  // Howl's Moving Castle - Calcifer
];

const TEAM_AVATARS = [
  "https://i.imgur.com/Qte8Mpj.png", // Howl's Moving Castle - Howl
  "https://i.imgur.com/YLlvnJc.png", // Spirited Away - Haku
  "https://i.imgur.com/V1DINJu.png", // Princess Mononoke - Ashitaka
  "https://i.imgur.com/Eg2UTSN.png", // My Neighbor Totoro - Totoro
  "https://i.imgur.com/DQm5quF.png", // Porco Rosso
  "https://i.imgur.com/Ft0Jck0.png"  // Ponyo - Sosuke
];

// Sample constituents data
const constituents: InsertConstituent[] = [
  {
    name: "Venkateshwarlu Reddy",
    email: "venkateshwarlu.r@example.com",
    phone: "+91 98765 43210",
    avatar: CONSTITUENT_AVATARS[0],
    address: "24 Main Road, Mangalagiri, Guntur, Andhra Pradesh 522503",
    district: "Mangalagiri"
  },
  {
    name: "Narasimha Raju",
    email: "narasimha.r@example.com",
    phone: "+91 87654 32109",
    avatar: CONSTITUENT_AVATARS[1],
    address: "8B Brodipet, Guntur, Andhra Pradesh 522002",
    district: "Guntur West"
  },
  {
    name: "Ramachandra Prasad",
    email: "ramachandra.p@example.com",
    phone: "+91 76543 21098",
    avatar: CONSTITUENT_AVATARS[2],
    address: "45 Main Street, Tadikonda, Guntur, Andhra Pradesh 522236",
    district: "Tadikonda"
  },
  {
    name: "Lakshmamma Chowdary",
    email: "lakshmamma.c@example.com",
    phone: "+91 65432 10987",
    avatar: CONSTITUENT_AVATARS[3],
    address: "78 Market Street, Prathipadu, Guntur, Andhra Pradesh 522019",
    district: "Prathipadu"
  },
  {
    name: "Srinivasulu Konda",
    email: "srinivasulu.k@example.com",
    phone: "+91 54321 09876",
    avatar: CONSTITUENT_AVATARS[4],
    address: "112 Main Street, Guntur East, Guntur, Andhra Pradesh 522006",
    district: "Guntur East"
  },
  {
    name: "Venkateswara Gundabathula",
    email: "venkateswara.g@example.com",
    phone: "+91 98765 12345",
    avatar: CONSTITUENT_AVATARS[5],
    address: "35 Station Road, Tenali, Guntur, Andhra Pradesh 522201",
    district: "Tenali"
  },
  {
    name: "Suryakantamma Narne",
    email: "suryakantamma.n@example.com",
    phone: "+91 87654 56789",
    avatar: CONSTITUENT_AVATARS[1],
    address: "22 Gandhi Road, Guntur West, Guntur, Andhra Pradesh 522004",
    district: "Guntur West"
  },
  {
    name: "Ravi Yellamanchili",
    email: "ravi.y@example.com",
    phone: "+91 76543 67890",
    avatar: CONSTITUENT_AVATARS[0],
    address: "50 Canal Road, Ponnur, Guntur, Andhra Pradesh 522124",
    district: "Ponnur"
  },
  {
    name: "Padmavathi Bapatla",
    email: "padmavathi.b@example.com",
    phone: "+91 65432 78901",
    avatar: CONSTITUENT_AVATARS[3],
    address: "85 Temple Street, Mangalagiri, Guntur, Andhra Pradesh 522503",
    district: "Mangalagiri"
  }
];

// Sample team members data
const teamMembers: InsertTeamMember[] = [
  {
    name: "Annapurna Devi",
    email: "annapurna.devi@gov.in",
    role: "Administrative Officer",
    avatar: TEAM_AVATARS[0],
    phone: "+91 98765 10001"
  },
  {
    name: "Ravi Teja",
    email: "ravi.teja@gov.in",
    role: "Emergency Coordinator",
    avatar: TEAM_AVATARS[1],
    phone: "+91 87654 10002"
  },
  {
    name: "Venkata Subrahmanyam",
    email: "venkata.s@gov.in",
    role: "Infrastructure Specialist",
    avatar: TEAM_AVATARS[2],
    phone: "+91 76543 10003"
  },
  {
    name: "Padma Lakshmi",
    email: "padma.l@gov.in",
    role: "Public Relations Officer",
    avatar: TEAM_AVATARS[3],
    phone: "+91 65432 10004"
  }
];

// Sample requests data (to be expanded)
const requests: Array<InsertRequest & { status: Status, assignedToId?: number, createdAt?: Date }> = [
  {
    constituentId: 1, // Arjun Patel
    category: "startup-support" as Category,
    subject: "Funding assistance for agricultural technology startup",
    description: "We've developed a technology that helps farmers optimize water usage and increase crop yields. We're seeking funding to scale our operations across the state. We've already conducted successful pilots in three villages with positive results.",
    status: "in-progress" as Status,
    priority: "medium" as Priority,
    location: "Hyderabad Startup Hub",
    assignedToId: 1, // Meera Joshi
    createdAt: new Date(2023, 6, 14) // July 14, 2023
  },
  {
    constituentId: 2, // Lakshmi Reddy
    category: "emergency" as Category,
    subject: "Flood damage in Ramanpet village needing immediate relief",
    description: "Heavy rains have caused severe flooding in our village. Several houses are damaged, and about 50 families are without shelter. We need immediate relief supplies including food, medicine, and temporary shelters. The situation is critical.",
    status: "under-review" as Status,
    priority: "high" as Priority,
    location: "Ramanpet Village, Warangal",
    assignedToId: 2, // Raj Khanna
    createdAt: new Date(2023, 6, 14) // July 14, 2023
  },
  {
    constituentId: 3, // Kunal Chopra
    category: "infrastructure" as Category,
    subject: "Road repair needed in Jubilee Hills commercial area",
    description: "The main road in the commercial district has several large potholes that are causing accidents and traffic congestion. This is affecting businesses in the area. The damaged stretch is approximately 500 meters long.",
    status: "in-progress" as Status,
    priority: "medium" as Priority,
    location: "Jubilee Hills Road No. 5, Hyderabad",
    assignedToId: 3, // Nitin Gupta
    createdAt: new Date(2023, 6, 13) // July 13, 2023
  },
  {
    constituentId: 4, // Sunita Verma
    category: "public-issue" as Category,
    subject: "Water supply disruption in Banjara Colony for past 3 days",
    description: "Our colony has been without water for the past 3 days. The municipal authorities haven't provided any clear information about when the supply will be restored. There are over 200 households affected by this issue.",
    status: "resolved" as Status,
    priority: "high" as Priority,
    location: "Banjara Colony, Banjara Hills, Hyderabad",
    assignedToId: 1, // Meera Joshi
    createdAt: new Date(2023, 6, 13) // July 13, 2023
  },
  {
    constituentId: 5, // Mohammed Khan
    category: "appointment" as Category,
    subject: "Meeting request regarding local medical college proposal",
    description: "I represent a group of healthcare professionals who want to discuss a proposal for establishing a new medical college in Secunderabad. We have a detailed plan including funding arrangements and would like to present this to you.",
    status: "new" as Status,
    priority: "medium" as Priority,
    location: "Minister's Office, Hyderabad",
    createdAt: new Date(2023, 6, 12) // July 12, 2023
  }
];

// Sample appointment data (to be expanded)
const appointments: InsertAppointment[] = [
  {
    requestId: 5, // Mohammed Khan's appointment request
    scheduledDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // Today, 6 hours from now
    duration: 60, // 60 minutes
    location: "Minister's Office, Hyderabad",
    isConfirmed: true
  },
  {
    requestId: 1, // Arjun Patel's request
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    duration: 45, // 45 minutes
    location: "Minister's Office, Hyderabad",
    isConfirmed: true
  },
  {
    requestId: 3, // Kunal Chopra's request
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    duration: 30, // 30 minutes
    location: "Jubilee Hills Site Visit",
    isConfirmed: false
  }
];

// System users data
const users: InsertUser[] = [
  {
    username: "minister",
    password: "password123", // In a real app, would be hashed
    teamMemberId: null,
    role: "minister",
    isAdmin: true
  },
  {
    username: "meera",
    password: "staff123", // In a real app, would be hashed
    teamMemberId: 1,
    role: "staff",
    isAdmin: false
  },
  {
    username: "raj",
    password: "staff123", // In a real app, would be hashed
    teamMemberId: 2,
    role: "staff",
    isAdmin: false
  }
];

// Additional sample requests
const additionalRequests: Array<Partial<InsertRequest> & { constituentId: number, category: Category, subject: string, description: string, status: Status, priority: Priority, createdAt?: Date, assignedToId?: number }> = [
  {
    constituentId: 6, // Rajesh Kumar
    category: "appointment" as Category,
    subject: "Local Business Association Meeting",
    description: "As the president of the local business association, I would like to discuss the upcoming industrial policy and its implications for small businesses in our area.",
    status: "awaiting-feedback" as Status,
    priority: "medium" as Priority,
    createdAt: new Date(2023, 6, 10) // July 10, 2023
  },
  {
    constituentId: 7, // Priya Sharma
    category: "startup-support" as Category,
    subject: "Women Entrepreneur Initiative",
    description: "I'm leading a group of women entrepreneurs who are launching small businesses. We're seeking government support for training programs and microfinance options specific to women entrepreneurs.",
    status: "new" as Status,
    priority: "medium" as Priority,
    createdAt: new Date(2023, 6, 9) // July 9, 2023
  },
  {
    constituentId: 8, // Vikram Singh
    category: "infrastructure" as Category,
    subject: "Agricultural Irrigation Project",
    description: "Our village needs assistance with an irrigation project. The existing canal system is old and inefficient. We've prepared a proposal for a modern drip irrigation system that would benefit 200 farming families.",
    status: "under-review" as Status,
    priority: "high" as Priority,
    location: "Medak Rural District",
    createdAt: new Date(2023, 6, 8) // July 8, 2023
  },
  {
    constituentId: 9, // Anjali Mehta
    category: "public-issue" as Category,
    subject: "New School Funding Proposal",
    description: "Our growing community needs a new school. The nearest school is 10 km away, making it difficult for children to attend. We have identified suitable land and are seeking government funding for construction.",
    status: "in-progress" as Status,
    priority: "medium" as Priority,
    location: "Nizamabad District",
    // assignedToId: 4, // Aisha Khan
    createdAt: new Date(2023, 6, 7) // July 7, 2023
  },
  {
    constituentId: 2, // Lakshmi Reddy
    category: "emergency" as Category,
    subject: "Medical Supplies for Health Camp",
    description: "We're organizing a health camp in an underserved area and need support with medical supplies and possibly healthcare professionals. The camp is scheduled for next month and aims to serve approximately 500 people.",
    status: "new" as Status,
    priority: "high" as Priority,
    location: "Warangal Rural",
    createdAt: new Date(2023, 6, 6) // July 6, 2023
  },
  {
    constituentId: 3, // Kunal Chopra
    category: "public-issue" as Category,
    subject: "Traffic Management at School Zone",
    description: "The traffic around our local school is chaotic during drop-off and pick-up times, creating safety risks for children. We need traffic management measures like speed bumps, crossing guards, or designated drop-off areas.",
    status: "new" as Status,
    priority: "medium" as Priority,
    location: "Jubilee Hills, Hyderabad",
    createdAt: new Date(2023, 6, 5) // July 5, 2023
  },
  {
    constituentId: 4, // Sunita Verma
    category: "appointment" as Category,
    subject: "Community Development Project Discussion",
    description: "I'd like to discuss a community development project that focuses on skill development for unemployed youth in our area. We have a detailed plan and are looking for government support.",
    status: "awaiting-feedback" as Status,
    priority: "low" as Priority,
    createdAt: new Date(2023, 6, 4) // July 4, 2023
  }
];

// Generate more sample data for a total of 40+ requests
const categories: Category[] = ["appointment", "startup-support", "infrastructure", "public-issue", "emergency"];
const statuses: Status[] = ["new", "in-progress", "under-review", "awaiting-feedback", "resolved"];
const priorities: Priority[] = ["high", "medium", "low"];
const subjects = [
  "Streetlight Installation Request",
  "Public Park Maintenance Issue",
  "School Bus Service Request",
  "Public Library Funding",
  "Community Center Renovation",
  "Senior Citizen Support Services",
  "Youth Sports Program Funding",
  "Village Road Construction",
  "Public Transport Frequency",
  "Healthcare Facility Request",
  "Agricultural Loan Assistance",
  "Small Business Support Program",
  "Digital Literacy Program",
  "Drinking Water Quality Issue",
  "Waste Management System",
  "Renewable Energy Project",
  "School Teacher Appointment",
  "Vocational Training Center",
  "Flood Control Measures",
  "Wildlife Conservation Project"
];

// This function will set up the initial sample data in the database
// Helper function to automatically assign team members based on issue category
export function getAssigneeForCategory(category: string): number {
  switch(category) {
    case 'appointment':
      return 1; // Annapurna Devi (Administrative Officer)
    case 'emergency':
      return 2; // Ravi Teja (Emergency Coordinator)
    case 'infrastructure':
      return 3; // Venkata Subrahmanyam (Infrastructure Specialist)
    case 'public-issue':
      return 4; // Padma Lakshmi (Public Relations Officer)
    case 'startup-support':
      return 1; // Annapurna Devi (Administrative Officer)
    default:
      return 1; // Default to Administrative Officer
  }
}

export async function seedDatabase() {
  console.log("Seeding database with sample data...");
  
  // Add sample constituents
  for (const constituent of constituents) {
    await storage.createConstituent(constituent);
  }
  console.log(`Added ${constituents.length} constituents`);
  
  // Add sample team members
  for (const member of teamMembers) {
    await storage.createTeamMember(member);
  }
  console.log(`Added ${teamMembers.length} team members`);
  
  // Add initial sample requests
  for (const request of requests) {
    const { status, assignedToId, createdAt, ...requestData } = request;
    const newRequest = await storage.createRequest(requestData as InsertRequest);
    
    // Update the request with status and assignedToId
    if (status !== "new" || assignedToId) {
      await storage.updateRequest(newRequest.id, { 
        status, 
        assignedToId
      });
    }
    
    // If it's a request with a specific creation date, update the timestamps
    if (createdAt) {
      // Direct access to update the timestamps in the map
      const existingRequest = await storage.getRequestById(newRequest.id);
      if (existingRequest) {
        const updatedRequest = {
          ...existingRequest,
          createdAt,
          updatedAt: createdAt
        };
        (storage as any).requests.set(newRequest.id, updatedRequest);
      }
    }
  }
  console.log(`Added ${requests.length} initial requests`);
  
  // Add additional sample requests
  for (const request of additionalRequests) {
    const { status, assignedToId, createdAt, ...requestData } = request;
    const newRequest = await storage.createRequest(requestData as InsertRequest);
    
    // Update the request with status and assignedToId
    if (status !== "new" || assignedToId) {
      await storage.updateRequest(newRequest.id, { 
        status, 
        assignedToId
      });
    }
    
    // If it's a request with a specific creation date, update the timestamps
    if (createdAt) {
      // Direct access to update the timestamps in the map
      const existingRequest = await storage.getRequestById(newRequest.id);
      if (existingRequest) {
        const updatedRequest = {
          ...existingRequest,
          createdAt,
          updatedAt: createdAt
        };
        (storage as any).requests.set(newRequest.id, updatedRequest);
      }
    }
  }
  console.log(`Added ${additionalRequests.length} additional requests`);
  
  // Generate more random requests to reach 40+
  const currentRequestCount = requests.length + additionalRequests.length;
  const additionalRequestsNeeded = Math.max(0, 40 - currentRequestCount);
  
  for (let i = 0; i < additionalRequestsNeeded; i++) {
    const constituentId = Math.floor(Math.random() * constituents.length) + 1;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const description = `Detailed description for ${subject.toLowerCase()} request from constituent #${constituentId}.`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    // Auto-assign based on the request category
    const assignedToId = getAssigneeForCategory(category);
    
    // Create the request with a random date in the past 30 days
    const daysPast = Math.floor(Math.random() * 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysPast);
    
    const requestData: InsertRequest = {
      constituentId,
      category,
      subject,
      description,
      priority,
      location: constituentId % 2 === 0 ? `Location for request #${i+1}` : undefined
    };
    
    const newRequest = await storage.createRequest(requestData);
    
    // Update status and assignment
    if (status !== "new" || assignedToId) {
      await storage.updateRequest(newRequest.id, { 
        status, 
        assignedToId
      });
    }
    
    // Update timestamps
    const existingRequest = await storage.getRequestById(newRequest.id);
    if (existingRequest) {
      const updatedRequest = {
        ...existingRequest,
        createdAt,
        updatedAt: createdAt
      };
      (storage as any).requests.set(newRequest.id, updatedRequest);
    }
  }
  
  if (additionalRequestsNeeded > 0) {
    console.log(`Added ${additionalRequestsNeeded} random requests`);
  }
  
  // Add sample appointments
  for (const appointment of appointments) {
    await storage.createAppointment(appointment);
  }
  console.log(`Added ${appointments.length} appointments`);
  
  // Add sample users
  for (const user of users) {
    await storage.createUser(user);
  }
  console.log(`Added ${users.length} users`);
  
  console.log("Database seeding completed successfully!");
}

export function getFutureDateString(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}
