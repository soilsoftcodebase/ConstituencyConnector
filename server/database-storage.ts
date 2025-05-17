import { 
  constituents, 
  teamMembers, 
  requests, 
  requestNotes, 
  callLogs, 
  appointments,
  users,
  Category,
  Status,
  Priority,
  Request,
  Constituent,
  TeamMember,
  RequestNote,
  CallLog,
  Appointment,
  User,
  InsertConstituent,
  InsertTeamMember,
  InsertRequest,
  InsertRequestNote,
  InsertCallLog,
  InsertAppointment,
  InsertUser,
  categoryEnum,
  statusEnum,
  priorityEnum
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { 
  eq, 
  like, 
  and, 
  or, 
  isNull, 
  desc, 
  asc, 
  sql,
  gte,
  lt,
  SQL
} from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // Constituents
  async getConstituents(searchTerm?: string): Promise<Constituent[]> {
    if (searchTerm) {
      const searchPattern = `%${searchTerm}%`;
      return db
        .select()
        .from(constituents)
        .where(
          or(
            like(constituents.name, searchPattern),
            like(constituents.email, searchPattern),
            like(constituents.phone, searchPattern),
            like(constituents.district, searchPattern)
          )
        );
    }
    return db.select().from(constituents);
  }

  async getConstituentById(id: number): Promise<Constituent | undefined> {
    const results = await db
      .select()
      .from(constituents)
      .where(eq(constituents.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createConstituent(constituent: InsertConstituent): Promise<Constituent> {
    const [newConstituent] = await db
      .insert(constituents)
      .values(constituent)
      .returning();
    return newConstituent;
  }

  async updateConstituent(
    id: number,
    constituentData: Partial<InsertConstituent>
  ): Promise<Constituent | undefined> {
    const [updatedConstituent] = await db
      .update(constituents)
      .set(constituentData)
      .where(eq(constituents.id, id))
      .returning();
    return updatedConstituent;
  }

  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    return db.select().from(teamMembers);
  }

  async getTeamMemberById(id: number): Promise<TeamMember | undefined> {
    const results = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember> {
    const [newTeamMember] = await db
      .insert(teamMembers)
      .values(teamMember)
      .returning();
    return newTeamMember;
  }

  async updateTeamMember(
    id: number,
    teamMemberData: Partial<InsertTeamMember>
  ): Promise<TeamMember | undefined> {
    const [updatedTeamMember] = await db
      .update(teamMembers)
      .set(teamMemberData)
      .where(eq(teamMembers.id, id))
      .returning();
    return updatedTeamMember;
  }

  // Requests
  async getRequests(filters?: {
    category?: Category | "all";
    status?: Status | "all";
    priority?: Priority | "all";
    searchTerm?: string;
  }): Promise<Request[]> {
    let query = db.select().from(requests);
    
    if (filters) {
      const conditions: SQL[] = [];

      if (filters.category && filters.category !== "all") {
        conditions.push(eq(requests.category, categoryEnum.parse(filters.category)));
      }

      if (filters.status && filters.status !== "all") {
        conditions.push(eq(requests.status, statusEnum.parse(filters.status)));
      }

      if (filters.priority && filters.priority !== "all") {
        conditions.push(eq(requests.priority, priorityEnum.parse(filters.priority)));
      }

      if (filters.searchTerm) {
        const searchPattern = `%${filters.searchTerm}%`;
        conditions.push(sql<boolean>`(${requests.subject} LIKE ${searchPattern} OR ${requests.description} LIKE ${searchPattern})`);
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }
    }

    return query.orderBy(desc(requests.createdAt));
  }

  async getRequestById(id: number): Promise<Request | undefined> {
    const results = await db
      .select()
      .from(requests)
      .where(eq(requests.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getRequestWithRelations(id: number): Promise<any | undefined> {
    const request = await this.getRequestById(id);
    if (!request) return undefined;

    const constituent = await this.getConstituentById(request.constituentId);
    let assignedTo = null;
    if (request.assignedToId) {
      assignedTo = await this.getTeamMemberById(request.assignedToId);
    }

    const notes = await this.getRequestNotes(id);
    const callLogs = await this.getCallLogs(id);

    return {
      ...request,
      constituent,
      assignedTo,
      notes,
      callLogs
    };
  }

  async createRequest(request: InsertRequest): Promise<Request> {
    const [newRequest] = await db
      .insert(requests)
      .values({
        constituentId: request.constituentId,
        category: categoryEnum.parse(request.category),
        subject: request.subject,
        description: request.description,
        priority: priorityEnum.parse(request.priority),
        location: request.location,
        attachments: request.attachments,
        status: statusEnum.parse('new'),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newRequest;
  }

  async updateRequest(
    id: number,
    requestData: Partial<InsertRequest> & { status?: Status, assignedToId?: number | null }
  ): Promise<Request | undefined> {
    const updateValues: Partial<typeof requests.$inferInsert> = {
      updatedAt: new Date()
    };

    if (requestData.category) updateValues.category = categoryEnum.parse(requestData.category);
    if (requestData.status) updateValues.status = statusEnum.parse(requestData.status);
    if (requestData.priority) updateValues.priority = priorityEnum.parse(requestData.priority);
    if (requestData.subject) updateValues.subject = requestData.subject;
    if (requestData.description) updateValues.description = requestData.description;
    if (requestData.location) updateValues.location = requestData.location;
    if (requestData.attachments) updateValues.attachments = requestData.attachments;
    if ('assignedToId' in requestData) updateValues.assignedToId = requestData.assignedToId;

    const [updatedRequest] = await db
      .update(requests)
      .set(updateValues)
      .where(eq(requests.id, id))
      .returning();
    return updatedRequest;
  }

  async getRequestCount(filters?: {
    category?: Category | "all";
    status?: Status | "all";
    priority?: Priority | "all";
    searchTerm?: string;
  }): Promise<number> {
    const allRequests = await this.getRequests(filters);
    return allRequests.length;
  }

  // Request Notes
  async getRequestNotes(requestId: number): Promise<RequestNote[]> {
    return db
      .select()
      .from(requestNotes)
      .where(eq(requestNotes.requestId, requestId))
      .orderBy(desc(requestNotes.createdAt));
  }

  async createRequestNote(note: InsertRequestNote): Promise<RequestNote> {
    const [newNote] = await db
      .insert(requestNotes)
      .values({
        ...note,
        createdAt: new Date()
      })
      .returning();
    return newNote;
  }

  // Call Logs
  async getCallLogs(requestId: number): Promise<CallLog[]> {
    return db
      .select()
      .from(callLogs)
      .where(eq(callLogs.requestId, requestId))
      .orderBy(desc(callLogs.callTime));
  }

  async createCallLog(log: InsertCallLog): Promise<CallLog> {
    const [newLog] = await db
      .insert(callLogs)
      .values({
        ...log,
        callTime: new Date()
      })
      .returning();
    return newLog;
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return db
      .select()
      .from(appointments)
      .orderBy(asc(appointments.scheduledDate));
  }

  async getUpcomingAppointments(): Promise<any[]> {
    const today = new Date();
    const appointmentList = await db
      .select()
      .from(appointments)
      .where(gte(appointments.scheduledDate, today))
      .orderBy(asc(appointments.scheduledDate))
      .limit(5);

    const result = [];
    for (const appointment of appointmentList) {
      const request = await this.getRequestById(appointment.requestId);
      if (request) {
        const constituent = await this.getConstituentById(request.constituentId);
        if (constituent) {
          const date = new Date(appointment.scheduledDate);
          const isToday = 
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

          result.push({
            id: appointment.id,
            constituentId: request.constituentId,
            constituent: {
              name: constituent.name,
              avatar: constituent.avatar
            },
            subject: request.subject,
            date: date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }),
            time: date.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit'
            }),
            isToday
          });
        }
      }
    }
    return result;
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const results = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return newAppointment;
  }

  async updateAppointment(
    id: number,
    appointmentData: Partial<InsertAppointment>
  ): Promise<Appointment | undefined> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set(appointmentData)
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }

  // Statistics
  async getStatistics(timePeriod?: string): Promise<any> {
    const dateFilter = this.getDateFilterByTimePeriod(timePeriod);
    const previousPeriodStart = this.getPreviousPeriodStart(timePeriod);

    let baseQuery = db.select().from(requests);
    let query = dateFilter ? baseQuery.where(() => gte(requests.createdAt, dateFilter)) : baseQuery;

    let previousPeriodQuery = previousPeriodStart && dateFilter 
      ? baseQuery.where(and(
          gte(requests.createdAt, previousPeriodStart),
          lt(requests.createdAt, dateFilter)
        ))
      : null;

    const [allRequests, previousPeriodRequests] = await Promise.all([
      query,
      previousPeriodQuery ? previousPeriodQuery : Promise.resolve([])
    ]);

    const totalRequests = allRequests.length;
    const previousTotalRequests = previousPeriodRequests.length;

    const pendingRequests = allRequests.filter(
      req => req.status !== 'resolved'
    ).length;
    const previousPendingRequests = previousPeriodRequests.filter(
      req => req.status !== 'resolved'
    ).length;

    const completedRequests = allRequests.filter(
      req => req.status === 'resolved'
    ).length;
    const previousCompletedRequests = previousPeriodRequests.filter(
      req => req.status === 'resolved'
    ).length;

    const emergencyRequests = allRequests.filter(
      req => req.category === 'emergency'
    ).length;
    
    const criticalEmergencies = allRequests.filter(
      req => req.category === 'emergency' && req.priority === 'high'
    ).length;

    // Calculate percentage changes
    const totalRequestsChange = previousTotalRequests === 0 
      ? 100 
      : Math.round(((totalRequests - previousTotalRequests) / previousTotalRequests) * 100);
    
    const pendingRequestsChange = previousPendingRequests === 0 
      ? 100 
      : Math.round(((pendingRequests - previousPendingRequests) / previousPendingRequests) * 100);
    
    const completedRequestsChange = previousCompletedRequests === 0 
      ? 100 
      : Math.round(((completedRequests - previousCompletedRequests) / previousCompletedRequests) * 100);

    return {
      totalRequests,
      totalRequestsChange,
      pendingRequests,
      pendingRequestsChange,
      completedRequests,
      completedRequestsChange,
      emergencyRequests,
      criticalEmergencies
    };
  }

  async getCategoryStats(timePeriod?: string): Promise<any> {
    const dateFilter = this.getDateFilterByTimePeriod(timePeriod);
    
    let query = db.select().from(requests);
    
    if (dateFilter) {
      query = query.where(gte(requests.createdAt, dateFilter)) as any;
    }
    
    const allRequests = await query;
    const total = allRequests.length;
    
    const categoryMap = new Map<string, number>();
    
    allRequests.forEach(request => {
      const category = request.category as Category;
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + 1);
    });
    
    const categoryColors = {
      'appointment': '#1a56db',
      'startup-support': '#7e3af2',
      'infrastructure': '#0694a2',
      'public-issue': '#ff5a1f',
      'emergency': '#e02424'
    };
    
    const categoryLabels = {
      'appointment': 'Appointments',
      'startup-support': 'Startup Support',
      'infrastructure': 'Infrastructure',
      'public-issue': 'Public Issues',
      'emergency': 'Emergency'
    };
    
    return Array.from(categoryMap.entries()).map(([category, count]) => {
      return {
        name: categoryLabels[category as keyof typeof categoryLabels] || category,
        value: count,
        percentage: Math.round((count / total) * 100),
        color: categoryColors[category as keyof typeof categoryColors] || '#9ca3af'
      };
    });
  }

  async getStatusStats(timePeriod?: string): Promise<Array<{name: string, count: number, percentage: number, color: string}>> {
    const dateFilter = this.getDateFilterByTimePeriod(timePeriod);
    
    let query = db.select().from(requests);
    if (dateFilter) {
      query = query.where(() => gte(requests.createdAt, dateFilter)) as typeof query;
    }
    
    const allRequests = await query;
    const total = allRequests.length;
    
    const statusMap = new Map<Status, number>();
    
    // Initialize all statuses with 0 count
    const allStatuses: Status[] = ["new", "in-progress", "under-review", "awaiting-feedback", "resolved"];
    allStatuses.forEach((status: Status) => {
      statusMap.set(status, 0);
    });
    
    // Count actual statuses
    allRequests.forEach((request: Request) => {
      const status = request.status as Status;
      const current = statusMap.get(status) ?? 0;
      statusMap.set(status, current + 1);
    });
    
    const statusColors: Record<Status, string> = {
      'new': '#9ca3af',
      'in-progress': '#3b82f6',
      'under-review': '#8b5cf6',
      'awaiting-feedback': '#f97316',
      'resolved': '#10b981'
    };
    
    const statusLabels: Record<Status, string> = {
      'new': 'New',
      'in-progress': 'In Progress',
      'under-review': 'Under Review',
      'awaiting-feedback': 'Awaiting Feedback',
      'resolved': 'Resolved'
    };
    
    return Array.from(statusMap.entries()).map(([status, count]) => ({
      name: statusLabels[status],
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: statusColors[status]
    }));
  }

  // Users
  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values(user)
      .returning();
    return newUser;
  }

  // Helper functions
  private getDateFilterByTimePeriod(timePeriod?: string): Date | null {
    const now = new Date();
    
    if (!timePeriod || timePeriod === 'all') {
      return null;
    }
    
    if (timePeriod === 'today') {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      return today;
    }
    
    if (timePeriod === 'this-week') {
      const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for first day of week (Monday)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      return startOfWeek;
    }
    
    if (timePeriod === 'this-month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return startOfMonth;
    }
    
    if (timePeriod === 'this-year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return startOfYear;
    }
    
    if (timePeriod === 'last-quarter') {
      const currentMonth = now.getMonth();
      const currentQuarter = Math.floor(currentMonth / 3);
      const startOfQuarter = new Date(now.getFullYear(), currentQuarter * 3, 1);
      return startOfQuarter;
    }
    
    return null;
  }

  private getPreviousPeriodStart(timePeriod?: string): Date | null {
    const currentPeriodStart = this.getDateFilterByTimePeriod(timePeriod);
    if (!currentPeriodStart) return null;
    
    const now = new Date();
    
    if (timePeriod === 'today') {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      return yesterday;
    }
    
    if (timePeriod === 'this-week') {
      const previousWeekStart = new Date(currentPeriodStart);
      previousWeekStart.setDate(currentPeriodStart.getDate() - 7);
      return previousWeekStart;
    }
    
    if (timePeriod === 'this-month') {
      const previousMonthStart = new Date(currentPeriodStart);
      previousMonthStart.setMonth(currentPeriodStart.getMonth() - 1);
      return previousMonthStart;
    }
    
    if (timePeriod === 'this-year') {
      const previousYearStart = new Date(currentPeriodStart);
      previousYearStart.setFullYear(currentPeriodStart.getFullYear() - 1);
      return previousYearStart;
    }
    
    if (timePeriod === 'last-quarter') {
      const previousQuarterStart = new Date(currentPeriodStart);
      previousQuarterStart.setMonth(currentPeriodStart.getMonth() - 3);
      return previousQuarterStart;
    }
    
    return null;
  }
}