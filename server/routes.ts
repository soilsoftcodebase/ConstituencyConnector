import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { seedDatabase, getAssigneeForCategory } from "./data";
import { 
  categoryEnum, 
  statusEnum,
  priorityEnum,
  insertRequestSchema, 
  insertRequestNoteSchema,
  insertCallLogSchema,
} from "@shared/schema";
import { z } from "zod";

// Zod validation schema for filters
const filtersSchema = z.object({
  category: z.union([categoryEnum, z.literal("all")]).optional().default("all"),
  status: z.union([statusEnum, z.literal("all")]).optional().default("all"),
  priority: z.union([priorityEnum, z.literal("all")]).optional().default("all"),
  searchTerm: z.string().optional(),
});

// Zod validation schema for request updates
const updateRequestSchema = z.object({
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  assignedToId: z.number().nullable().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the database with sample data
  await seedDatabase();

  // === Constituents Routes ===
  app.get("/api/constituents", async (req: Request, res: Response) => {
    try {
      const searchTerm = req.query.search as string;
      const constituents = await storage.getConstituents(searchTerm);
      res.json(constituents);
    } catch (error) {
      console.error("Error fetching constituents:", error);
      res.status(500).json({ message: "Error fetching constituents" });
    }
  });

  app.get("/api/constituents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const constituent = await storage.getConstituentById(id);
      
      if (!constituent) {
        return res.status(404).json({ message: "Constituent not found" });
      }
      
      res.json(constituent);
    } catch (error) {
      console.error("Error fetching constituent:", error);
      res.status(500).json({ message: "Error fetching constituent" });
    }
  });

  // === Team Members Routes ===
  app.get("/api/team", async (req: Request, res: Response) => {
    try {
      const teamMembers = await storage.getTeamMembers();
      res.json(teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Error fetching team members" });
    }
  });

  app.get("/api/team/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const teamMember = await storage.getTeamMemberById(id);
      
      if (!teamMember) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      res.json(teamMember);
    } catch (error) {
      console.error("Error fetching team member:", error);
      res.status(500).json({ message: "Error fetching team member" });
    }
  });

  // === Requests Routes ===
  app.get("/api/requests", async (req: Request, res: Response) => {
    try {
      const parseResult = filtersSchema.safeParse(req.query);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid filter parameters", errors: parseResult.error.errors });
      }
      
      const filters = parseResult.data;
      const requests = await storage.getRequests(filters);
      
      // Map requests to include constituent and assigned team member info
      const requestsWithRelations = await Promise.all(requests.map(async (request) => {
        const constituent = await storage.getConstituentById(request.constituentId);
        let assignedTo = null;
        
        if (request.assignedToId) {
          assignedTo = await storage.getTeamMemberById(request.assignedToId);
        }
        
        return {
          id: request.id,
          constituent: constituent ? {
            name: constituent.name,
            email: constituent.email,
            avatar: constituent.avatar
          } : null,
          category: request.category,
          subject: request.subject,
          date: new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          priority: request.priority,
          status: request.status,
          assignedTo: assignedTo ? {
            name: assignedTo.name,
            avatar: assignedTo.avatar
          } : null
        };
      }));
      
      res.json(requestsWithRelations);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Error fetching requests" });
    }
  });

  app.get("/api/requests/count", async (req: Request, res: Response) => {
    try {
      const parseResult = filtersSchema.safeParse(req.query);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid filter parameters", errors: parseResult.error.errors });
      }
      
      const filters = parseResult.data;
      const count = await storage.getRequestCount(filters);
      
      res.json(count);
    } catch (error) {
      console.error("Error fetching request count:", error);
      res.status(500).json({ message: "Error fetching request count" });
    }
  });

  app.get("/api/requests/details/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getRequestWithRelations(id);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      res.json(request);
    } catch (error) {
      console.error("Error fetching request details:", error);
      res.status(500).json({ message: "Error fetching request details" });
    }
  });

  app.post("/api/requests", async (req: Request, res: Response) => {
    try {
      const parseResult = insertRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid request data", errors: parseResult.error.errors });
      }
      
      const requestData = parseResult.data;
      const request = await storage.createRequest(requestData);
      
      // Auto-assign the request based on category
      const assignedToId = getAssigneeForCategory(requestData.category as any);
      await storage.updateRequest(request.id, { assignedToId });
      
      // Get the updated request with the assignee
      const updatedRequest = await storage.getRequestById(request.id);
      
      res.status(201).json(updatedRequest);
    } catch (error) {
      console.error("Error creating request:", error);
      res.status(500).json({ message: "Error creating request" });
    }
  });

  app.patch("/api/requests/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const parseResult = updateRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid update data", errors: parseResult.error.errors });
      }
      
      const updateData = parseResult.data;
      const updatedRequest = await storage.updateRequest(id, updateData);
      
      if (!updatedRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error updating request:", error);
      res.status(500).json({ message: "Error updating request" });
    }
  });

  // === Request Notes Routes ===
  app.post("/api/requests/:id/notes", async (req: Request, res: Response) => {
    try {
      const requestId = parseInt(req.params.id);
      const request = await storage.getRequestById(requestId);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      const noteData = {
        requestId,
        teamMemberId: null, // Would come from authenticated user in a real app
        text: req.body.text
      };
      
      const parseResult = insertRequestNoteSchema.safeParse(noteData);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid note data", errors: parseResult.error.errors });
      }
      
      const note = await storage.createRequestNote(parseResult.data);
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Error creating note" });
    }
  });

  // === Call Logs Routes ===
  app.post("/api/requests/:id/call-logs", async (req: Request, res: Response) => {
    try {
      const requestId = parseInt(req.params.id);
      const request = await storage.getRequestById(requestId);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      const logData = {
        requestId,
        teamMemberId: null, // Would come from authenticated user in a real app
        outcome: req.body.outcome,
        notes: req.body.notes
      };
      
      const parseResult = insertCallLogSchema.safeParse(logData);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid call log data", errors: parseResult.error.errors });
      }
      
      const log = await storage.createCallLog(parseResult.data);
      res.status(201).json(log);
    } catch (error) {
      console.error("Error creating call log:", error);
      res.status(500).json({ message: "Error creating call log" });
    }
  });

  // === Appointment Routes ===
  app.get("/api/appointments/upcoming", async (req: Request, res: Response) => {
    try {
      const appointments = await storage.getUpcomingAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error);
      res.status(500).json({ message: "Error fetching upcoming appointments" });
    }
  });

  // === Statistics Routes ===
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const timePeriod = req.query.timePeriod as string;
      const stats = await storage.getStatistics(timePeriod);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Error fetching statistics" });
    }
  });

  app.get("/api/stats/categories", async (req: Request, res: Response) => {
    try {
      const timePeriod = req.query.timePeriod as string;
      const categoryStats = await storage.getCategoryStats(timePeriod);
      res.json(categoryStats);
    } catch (error) {
      console.error("Error fetching category statistics:", error);
      res.status(500).json({ message: "Error fetching category statistics" });
    }
  });

  app.get("/api/stats/statuses", async (req: Request, res: Response) => {
    try {
      const timePeriod = req.query.timePeriod as string;
      const statusStats = await storage.getStatusStats(timePeriod);
      res.json(statusStats);
    } catch (error) {
      console.error("Error fetching status statistics:", error);
      res.status(500).json({ message: "Error fetching status statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
