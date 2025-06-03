import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { LessonStep, ValidationRule } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Lessons API
  app.get("/api/lessons", async (req, res) => {
    try {
      const lessons = await storage.getAllLessons();
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lesson = await storage.getLesson(id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // User Progress API
  app.get("/api/user-progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgressByUserId(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  app.post("/api/user-progress", async (req, res) => {
    try {
      const progressData = req.body;
      const progress = await storage.createUserProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user progress" });
    }
  });

  app.put("/api/user-progress/:userId/:lessonId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const lessonId = parseInt(req.params.lessonId);
      const updates = req.body;
      
      const progress = await storage.updateUserProgress(userId, lessonId, updates);
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user progress" });
    }
  });

  // Ranch API
  app.get("/api/ranch/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const ranch = await storage.getRanchByUserId(userId);
      if (!ranch) {
        return res.status(404).json({ message: "Ranch not found" });
      }
      res.json(ranch);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ranch" });
    }
  });

  app.put("/api/ranch/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const ranch = await storage.updateRanch(id, updates);
      if (!ranch) {
        return res.status(404).json({ message: "Ranch not found" });
      }
      res.json(ranch);
    } catch (error) {
      res.status(500).json({ message: "Failed to update ranch" });
    }
  });

  // Characters API
  app.get("/api/characters/:ranchId", async (req, res) => {
    try {
      const ranchId = parseInt(req.params.ranchId);
      const characters = await storage.getCharactersByRanchId(ranchId);
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  app.post("/api/characters", async (req, res) => {
    try {
      const characterData = req.body;
      const character = await storage.createCharacter(characterData);
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: "Failed to create character" });
    }
  });

  // Buildings API
  app.get("/api/buildings/:ranchId", async (req, res) => {
    try {
      const ranchId = parseInt(req.params.ranchId);
      const buildings = await storage.getBuildingsByRanchId(ranchId);
      res.json(buildings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch buildings" });
    }
  });

  app.post("/api/buildings", async (req, res) => {
    try {
      const buildingData = req.body;
      const building = await storage.createBuilding(buildingData);
      res.json(building);
    } catch (error) {
      res.status(500).json({ message: "Failed to create building" });
    }
  });

  // Code Compilation and Validation API
  const compileSchema = z.object({
    code: z.string(),
    language: z.string(),
    lessonId: z.number(),
    currentStep: z.number()
  });

  app.post("/api/compile", async (req, res) => {
    try {
      const { code, language, lessonId, currentStep } = compileSchema.parse(req.body);
      
      // Get lesson and step for validation
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ 
          success: false, 
          message: "Lesson not found",
          output: "Error: Lesson not found"
        });
      }

      const step = lesson.steps.find(s => s.id === currentStep);
      if (!step) {
        return res.status(404).json({ 
          success: false, 
          message: "Step not found",
          output: "Error: Step not found"
        });
      }

      // Simulate compilation process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate code against step requirements
      const validation = validateCode(code, step);
      
      if (validation.success) {
        res.json({
          success: true,
          message: "Code compiled and executed successfully!",
          output: step.expectedOutput || "Code executed successfully",
          validation: validation.results,
          experience: 25,
          coins: 10
        });
      } else {
        res.json({
          success: false,
          message: "Code compiled but validation failed",
          output: validation.message,
          validation: validation.results,
          errors: validation.errors
        });
      }
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: "Invalid request",
        output: "Error: " + (error instanceof Error ? error.message : "Unknown error")
      });
    }
  });

  app.post("/api/validate", async (req, res) => {
    try {
      const { code, lessonId, currentStep } = req.body;
      
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ success: false, message: "Lesson not found" });
      }

      const step = lesson.steps.find(s => s.id === currentStep);
      if (!step) {
        return res.status(404).json({ success: false, message: "Step not found" });
      }

      const validation = validateCode(code, step);
      res.json(validation);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Validation failed",
        errors: [error instanceof Error ? error.message : "Unknown error"]
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Code validation helper function
function validateCode(code: string, step: LessonStep) {
  const results: { rule: ValidationRule; passed: boolean; message: string }[] = [];
  let allPassed = true;
  const errors: string[] = [];

  for (const rule of step.validationRules) {
    let passed = false;
    let message = rule.message;

    switch (rule.type) {
      case "contains":
        passed = code.includes(rule.pattern);
        if (!passed && rule.required) {
          allPassed = false;
          errors.push(rule.message);
        }
        break;
      
      case "regex":
        const regex = new RegExp(rule.pattern);
        passed = regex.test(code);
        if (!passed && rule.required) {
          allPassed = false;
          errors.push(rule.message);
        }
        break;
      
      case "function_exists":
        passed = code.includes(`fn ${rule.pattern}`) || code.includes(`function ${rule.pattern}`);
        if (!passed && rule.required) {
          allPassed = false;
          errors.push(rule.message);
        }
        break;
      
      case "variable_exists":
        passed = code.includes(`let ${rule.pattern}`) || code.includes(`var ${rule.pattern}`) || code.includes(`const ${rule.pattern}`);
        if (!passed && rule.required) {
          allPassed = false;
          errors.push(rule.message);
        }
        break;
    }

    results.push({ rule, passed, message });
  }

  return {
    success: allPassed,
    message: allPassed ? "All validation rules passed!" : "Some validation rules failed",
    results,
    errors
  };
}
