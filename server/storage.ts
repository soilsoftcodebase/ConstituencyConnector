import {
  Constituent,
  InsertConstituent,
  TeamMember,
  InsertTeamMember,
  Request,
  InsertRequest,
  Category,
  Status,
  Priority,
  RequestNote,
  InsertRequestNote,
  CallLog,
  InsertCallLog,
  Appointment,
  InsertAppointment,
  User,
  InsertUser,
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Constituents
  getConstituents(searchTerm?: string): Promise<Constituent[]>;
  getConstituentById(id: number): Promise<Constituent | undefined>;
  createConstituent(constituent: InsertConstituent): Promise<Constituent>;
  updateConstituent(id: number, constituent: Partial<InsertConstituent>): Promise<Constituent | undefined>;

  // Team Members
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMemberById(id: number): Promise<TeamMember | undefined>;
  createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, teamMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;

  // Requests
  getRequests(filters?: {
    category?: Category | "all";
    status?: Status | "all";
    priority?: Priority | "all";
    searchTerm?: string;
  }): Promise<Request[]>;
  getRequestById(id: number): Promise<Request | undefined>;
  getRequestWithRelations(id: number): Promise<any | undefined>;
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequest(id: number, request: Partial<InsertRequest>): Promise<Request | undefined>;
  getRequestCount(filters?: {
    category?: Category | "all";
    status?: Status | "all";
    priority?: Priority | "all";
    searchTerm?: string;
  }): Promise<number>;

  // Request Notes
  getRequestNotes(requestId: number): Promise<RequestNote[]>;
  createRequestNote(note: InsertRequestNote): Promise<RequestNote>;

  // Call Logs
  getCallLogs(requestId: number): Promise<CallLog[]>;
  createCallLog(log: InsertCallLog): Promise<CallLog>;

  // Appointments
  getAppointments(): Promise<Appointment[]>;
  getUpcomingAppointments(): Promise<any[]>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;

  // Statistics
  getStatistics(timePeriod?: string): Promise<any>;
  getCategoryStats(timePeriod?: string): Promise<any>;
  getStatusStats(timePeriod?: string): Promise<any>;

  // Users
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private constituents: Map<number, Constituent>;
  private teamMembers: Map<number, TeamMember>;
  private requests: Map<number, Request>;
  private requestNotes: Map<number, RequestNote>;
  private callLogs: Map<number, CallLog>;
  private appointments: Map<number, Appointment>;
  private users: Map<number, User>;
  
  private constituentId: number = 1;
  private teamMemberId: number = 1;
  private requestId: number = 1;
  private requestNoteId: number = 1;
  private callLogId: number = 1;
  private appointmentId: number = 1;
  private userId: number = 1;

  constructor() {
    this.constituents = new Map();
    this.teamMembers = new Map();
    this.requests = new Map();
    this.requestNotes = new Map();
    this.callLogs = new Map();
    this.appointments = new Map();
    this.users = new Map();
  }

  // Constituent methods
  async getConstituents(searchTerm?: string): Promise<Constituent[]> {
    let constituents = Array.from(this.constituents.values());
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      constituents = constituents.filter(
        (constituent) =>
          constituent.name.toLowerCase().includes(term) ||
          constituent.email.toLowerCase().includes(term) ||
          constituent.phone.toLowerCase().includes(term) ||
          (constituent.district && constituent.district.toLowerCase().includes(term))
      );
    }
    
    return constituents;
  }

  async getConstituentById(id: number): Promise<Constituent | undefined> {
    return this.constituents.get(id);
  }

  async createConstituent(constituent: InsertConstituent): Promise<Constituent> {
    const newConstituent: Constituent = {
      ...constituent,
      id: this.constituentId++,
      address: constituent.address ?? null,
      district: constituent.district ?? null,
    };
    this.constituents.set(newConstituent.id, newConstituent);
    return newConstituent;
  }

  async updateConstituent(id: number, constituent: Partial<InsertConstituent>): Promise<Constituent | undefined> {
    const existingConstituent = this.constituents.get(id);
    
    if (!existingConstituent) {
      return undefined;
    }
    
    const updatedConstituent = {
      ...existingConstituent,
      ...constituent,
    };
    
    this.constituents.set(id, updatedConstituent);
    return updatedConstituent;
  }

  // Team Member methods
  async getTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values());
  }

  async getTeamMemberById(id: number): Promise<TeamMember | undefined> {
    return this.teamMembers.get(id);
  }

  async createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember> {
    const newTeamMember: TeamMember = {
      ...teamMember,
      id: this.teamMemberId++,
    };
    this.teamMembers.set(newTeamMember.id, newTeamMember);
    return newTeamMember;
  }

  async updateTeamMember(id: number, teamMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const existingTeamMember = this.teamMembers.get(id);
    
    if (!existingTeamMember) {
      return undefined;
    }
    
    const updatedTeamMember = {
      ...existingTeamMember,
      ...teamMember,
    };
    
    this.teamMembers.set(id, updatedTeamMember);
    return updatedTeamMember;
  }

  // Request methods
  async getRequests(filters?: {
    category?: Category | "all";
    status?: Status | "all";
    priority?: Priority | "all";
    searchTerm?: string;
  }): Promise<Request[]> {
    let requests = Array.from(this.requests.values());
    
    if (filters) {
      if (filters.category && filters.category !== "all") {
        requests = requests.filter((request) => request.category === filters.category);
      }
      
      if (filters.status && filters.status !== "all") {
        requests = requests.filter((request) => request.status === filters.status);
      }
      
      if (filters.priority && filters.priority !== "all") {
        requests = requests.filter((request) => request.priority === filters.priority);
      }
      
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        requests = requests.filter(async (request) => {
          const constituent = await this.getConstituentById(request.constituentId);
          return (
            request.subject.toLowerCase().includes(term) ||
            request.description.toLowerCase().includes(term) ||
            (constituent && constituent.name.toLowerCase().includes(term))
          );
        });
      }
    }
    
    // Sort by creation date (newest first)
    return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getRequestById(id: number): Promise<Request | undefined> {
    return this.requests.get(id);
  }
  
  async getRequestWithRelations(id: number): Promise<any | undefined> {
    const request = this.requests.get(id);
    
    if (!request) {
      return undefined;
    }
    
    const constituent = await this.getConstituentById(request.constituentId);
    let assignedTo = null;
    
    if (request.assignedToId) {
      assignedTo = await this.getTeamMemberById(request.assignedToId);
    }
    
    return {
      ...request,
      constituent,
      assignedTo
    };
  }

  async createRequest(request: InsertRequest): Promise<Request> {
    const now = new Date();
    const newRequest: Request = {
      ...request,
      id: this.requestId++,
      status: "new",
      createdAt: now,
      updatedAt: now,
    } as Request;
    
    this.requests.set(newRequest.id, newRequest);
    return newRequest;
  }

  async updateRequest(id: number, request: Partial<InsertRequest> & { status?: Status, assignedToId?: number | null }): Promise<Request | undefined> {
    const existingRequest = this.requests.get(id);
    
    if (!existingRequest) {
      return undefined;
    }
    
    const updatedRequest: Request = {
      ...existingRequest,
      ...request,
      category: request.category ? request.category as "appointment" | "startup-support" | "infrastructure" | "public-issue" | "emergency" : existingRequest.category,
      priority: request.priority ? request.priority as "high" | "medium" | "low" : existingRequest.priority,
      updatedAt: new Date(),
    };
    
    this.requests.set(id, updatedRequest);
    return updatedRequest;
  }
  
  async getRequestCount(filters?: {
    category?: Category | "all";
    status?: Status | "all";
    priority?: Priority | "all";
    searchTerm?: string;
  }): Promise<number> {
    const requests = await this.getRequests(filters);
    return requests.length;
  }

  // Request Notes methods
  async getRequestNotes(requestId: number): Promise<RequestNote[]> {
    const notes = Array.from(this.requestNotes.values())
      .filter((note) => note.requestId === requestId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return notes;
  }

  async createRequestNote(note: InsertRequestNote): Promise<RequestNote> {
    const newNote: RequestNote = {
      ...note,
      id: this.requestNoteId++,
      createdAt: new Date(),
      teamMemberId: note.teamMemberId === undefined ? null : note.teamMemberId,
    };
    
    this.requestNotes.set(newNote.id, newNote);
    return newNote;
  }

  // Call Logs methods
  async getCallLogs(requestId: number): Promise<CallLog[]> {
    const logs = Array.from(this.callLogs.values())
      .filter((log) => log.requestId === requestId)
      .sort((a, b) => new Date(b.callTime).getTime() - new Date(a.callTime).getTime());
    
    return logs;
  }

  async createCallLog(log: InsertCallLog): Promise<CallLog> {
    const newLog: CallLog = {
      ...log,
      id: this.callLogId++,
      callTime: new Date(),
      teamMemberId: log.teamMemberId !== undefined ? log.teamMemberId : null,
      notes: log.notes !== undefined ? log.notes : null,
    };
    
    this.callLogs.set(newLog.id, newLog);
    return newLog;
  }

  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }
  
  async getUpcomingAppointments(): Promise<any[]> {
    const appointments = Array.from(this.appointments.values())
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
    
    const upcomingAppointments = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const appointment of appointments) {
      const request = this.requests.get(appointment.requestId);
      if (!request) continue;
      
      const constituent = await this.getConstituentById(request.constituentId);
      if (!constituent) continue;
      
      const appointmentDate = new Date(appointment.scheduledDate);
      const formattedDate = appointmentDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      
      const formattedTime = appointmentDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true
      });
      
      const isToday = appointmentDate.setHours(0, 0, 0, 0) === today.getTime();
      
      upcomingAppointments.push({
        id: appointment.id,
        constituentId: constituent.id,
        constituent: {
          name: constituent.name,
          avatar: constituent.avatar
        },
        subject: request.subject,
        date: formattedDate,
        time: formattedTime,
        isToday
      });
      
      // Limit to next 5 appointments
      if (upcomingAppointments.length >= 5) break;
    }
    
    return upcomingAppointments;
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const newAppointment: Appointment = {
      ...appointment,
      id: this.appointmentId++,
      location: appointment.location ?? null,
      isConfirmed: appointment.isConfirmed ?? null,
    };
    
    this.appointments.set(newAppointment.id, newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const existingAppointment = this.appointments.get(id);
    
    if (!existingAppointment) {
      return undefined;
    }
    
    const updatedAppointment = {
      ...existingAppointment,
      ...appointment,
    };
    
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
  
  // Statistics methods
  async getStatistics(timePeriod?: string): Promise<any> {
    const requests = Array.from(this.requests.values());
    const dateFilter = this.getDateFilterByTimePeriod(timePeriod);
    
    const filteredRequests = dateFilter 
      ? requests.filter(request => new Date(request.createdAt) >= dateFilter)
      : requests;
    
    const completedRequests = filteredRequests.filter(req => req.status === "resolved");
    const pendingRequests = filteredRequests.filter(req => req.status !== "resolved");
    const emergencyRequests = filteredRequests.filter(req => req.category === "emergency");
    const criticalEmergencies = emergencyRequests.filter(req => req.priority === "high");
    
    // Get previous period stats for comparison
    const previousPeriodStart = this.getPreviousPeriodStart(timePeriod);
    const previousPeriodRequests = previousPeriodStart
      ? requests.filter(request => {
          const date = new Date(request.createdAt);
          return date >= previousPeriodStart && date < dateFilter!;
        })
      : [];
    
    const prevTotal = previousPeriodRequests.length || 1; // Avoid division by zero
    const prevCompleted = previousPeriodRequests.filter(req => req.status === "resolved").length || 1;
    const prevPending = previousPeriodRequests.filter(req => req.status !== "resolved").length || 1;
    
    const totalChange = prevTotal ? Math.round(((filteredRequests.length - prevTotal) / prevTotal) * 100) : 0;
    const completedChange = prevCompleted ? Math.round(((completedRequests.length - prevCompleted) / prevCompleted) * 100) : 0;
    const pendingChange = prevPending ? Math.round(((pendingRequests.length - prevPending) / prevPending) * 100) : 0;
    
    return {
      totalRequests: filteredRequests.length,
      totalRequestsChange: totalChange,
      pendingRequests: pendingRequests.length,
      pendingRequestsChange: pendingChange,
      completedRequests: completedRequests.length,
      completedRequestsChange: completedChange,
      emergencyRequests: emergencyRequests.length,
      criticalEmergencies: criticalEmergencies.length
    };
  }

  async getCategoryStats(timePeriod?: string): Promise<any> {
    const requests = Array.from(this.requests.values());
    const dateFilter = this.getDateFilterByTimePeriod(timePeriod);
    
    const filteredRequests = dateFilter 
      ? requests.filter(request => new Date(request.createdAt) >= dateFilter)
      : requests;
    
    const total = filteredRequests.length || 1; // Avoid division by zero
    
    const categoryStats = [
      { 
        name: "Appointments", 
        value: filteredRequests.filter(req => req.category === "appointment").length,
        color: "#1a56db"
      },
      { 
        name: "Startup Support", 
        value: filteredRequests.filter(req => req.category === "startup-support").length,
        color: "#7e3af2"
      },
      { 
        name: "Infrastructure", 
        value: filteredRequests.filter(req => req.category === "infrastructure").length,
        color: "#0694a2"
      },
      { 
        name: "Public Issues", 
        value: filteredRequests.filter(req => req.category === "public-issue").length,
        color: "#ff5a1f"
      },
      { 
        name: "Emergency", 
        value: filteredRequests.filter(req => req.category === "emergency").length,
        color: "#e02424"
      }
    ];
    
    // Calculate percentages
    return categoryStats.map(stat => ({
      ...stat,
      percentage: Math.round((stat.value / total) * 100)
    }));
  }

  async getStatusStats(timePeriod?: string): Promise<any> {
    const requests = Array.from(this.requests.values());
    const dateFilter = this.getDateFilterByTimePeriod(timePeriod);
    
    const filteredRequests = dateFilter 
      ? requests.filter(request => new Date(request.createdAt) >= dateFilter)
      : requests;
    
    const total = filteredRequests.length || 1; // Avoid division by zero
    
    const statusStats = [
      { 
        name: "New", 
        count: filteredRequests.filter(req => req.status === "new").length,
        color: "#9ca3af"
      },
      { 
        name: "In Progress", 
        count: filteredRequests.filter(req => req.status === "in-progress").length,
        color: "#3b82f6"
      },
      { 
        name: "Under Review", 
        count: filteredRequests.filter(req => req.status === "under-review").length,
        color: "#8b5cf6"
      },
      { 
        name: "Awaiting Feedback", 
        count: filteredRequests.filter(req => req.status === "awaiting-feedback").length,
        color: "#06b6d4"
      },
      { 
        name: "Resolved", 
        count: filteredRequests.filter(req => req.status === "resolved").length,
        color: "#10b981"
      }
    ];
    
    // Calculate percentages
    return statusStats.map(stat => ({
      ...stat,
      percentage: Math.round((stat.count / total) * 100)
    }));
  }
  
  // User methods
  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = Array.from(this.users.values());
    return users.find(user => user.username === username);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      ...user,
      id: this.userId++,
      teamMemberId: user.teamMemberId === undefined ? null : user.teamMemberId,
      isAdmin: user.isAdmin === undefined ? null : user.isAdmin,
    };
    
    this.users.set(newUser.id, newUser);
    return newUser;
  }
  
  // Helper methods for date filtering
  private getDateFilterByTimePeriod(timePeriod?: string): Date | null {
    if (!timePeriod) return null;
    
    const now = new Date();
    
    switch (timePeriod) {
      case 'today':
        now.setHours(0, 0, 0, 0);
        return now;
      case 'this-week':
        now.setDate(now.getDate() - now.getDay());
        now.setHours(0, 0, 0, 0);
        return now;
      case 'this-month':
        now.setDate(1);
        now.setHours(0, 0, 0, 0);
        return now;
      case 'last-quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        now.setMonth(quarter * 3);
        now.setDate(1);
        now.setHours(0, 0, 0, 0);
        return now;
      case 'this-year':
        now.setMonth(0, 1);
        now.setHours(0, 0, 0, 0);
        return now;
      default:
        return null;
    }
  }
  
  private getPreviousPeriodStart(timePeriod?: string): Date | null {
    if (!timePeriod) return null;
    
    const currentPeriodStart = this.getDateFilterByTimePeriod(timePeriod);
    if (!currentPeriodStart) return null;
    
    const previousPeriodStart = new Date(currentPeriodStart);
    
    switch (timePeriod) {
      case 'today':
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
        return previousPeriodStart;
      case 'this-week':
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
        return previousPeriodStart;
      case 'this-month':
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
        return previousPeriodStart;
      case 'last-quarter':
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 3);
        return previousPeriodStart;
      case 'this-year':
        previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1);
        return previousPeriodStart;
      default:
        return null;
    }
  }
}

export const storage = new MemStorage();
