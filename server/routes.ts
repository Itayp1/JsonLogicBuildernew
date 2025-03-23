import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertJsonLogicExpressionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all expressions
  app.get("/api/expressions", async (req, res) => {
    const expressions = await storage.getAllExpressions();
    res.json(expressions);
  });

  // Get a specific expression
  app.get("/api/expressions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const expression = await storage.getExpression(id);
    if (!expression) {
      return res.status(404).json({ message: "Expression not found" });
    }

    res.json(expression);
  });

  // Create new expression
  app.post("/api/expressions", async (req, res) => {
    try {
      const data = insertJsonLogicExpressionSchema.parse(req.body);
      const expression = await storage.createExpression(data);
      res.status(201).json(expression);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid expression data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Update an expression
  app.put("/api/expressions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const data = insertJsonLogicExpressionSchema.parse(req.body);
      const expression = await storage.updateExpression(id, data);
      
      if (!expression) {
        return res.status(404).json({ message: "Expression not found" });
      }

      res.json(expression);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid expression data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Delete an expression
  app.delete("/api/expressions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const success = await storage.deleteExpression(id);
    if (!success) {
      return res.status(404).json({ message: "Expression not found" });
    }

    res.status(204).send();
  });

  // Test an expression with data
  app.post("/api/expressions/test", async (req, res) => {
    try {
      const testSchema = z.object({
        expression: z.any(),
        data: z.record(z.any())
      });

      const { expression, data } = testSchema.parse(req.body);
      
      // Import jsonLogic dynamically
      const jsonLogic = (await import('json-logic-js')).default;
      
      const result = jsonLogic.apply(expression, data);
      res.json({ result });
    } catch (error) {
      res.status(400).json({ message: "Invalid test data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
