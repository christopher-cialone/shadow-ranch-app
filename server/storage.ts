import { 
  users, ranches, lessons, userProgress, characters, buildings,
  type User, type Ranch, type Lesson, type UserProgress, type Character, type Building,
  type InsertUser, type InsertRanch, type InsertLesson, type InsertUserProgress, 
  type InsertCharacter, type InsertBuilding, type LessonStep
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Ranch operations
  getRanch(id: number): Promise<Ranch | undefined>;
  getRanchByUserId(userId: number): Promise<Ranch | undefined>;
  createRanch(ranch: InsertRanch): Promise<Ranch>;
  updateRanch(id: number, updates: Partial<InsertRanch>): Promise<Ranch | undefined>;

  // Lesson operations
  getLesson(id: number): Promise<Lesson | undefined>;
  getAllLessons(): Promise<Lesson[]>;
  getLessonsByCategory(category: string): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // User Progress operations
  getUserProgress(userId: number, lessonId: number): Promise<UserProgress | undefined>;
  getUserProgressByUserId(userId: number): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: number, lessonId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress | undefined>;

  // Character operations
  getCharacter(id: number): Promise<Character | undefined>;
  getCharactersByRanchId(ranchId: number): Promise<Character[]>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, updates: Partial<InsertCharacter>): Promise<Character | undefined>;

  // Building operations
  getBuilding(id: number): Promise<Building | undefined>;
  getBuildingsByRanchId(ranchId: number): Promise<Building[]>;
  createBuilding(building: InsertBuilding): Promise<Building>;
  updateBuilding(id: number, updates: Partial<InsertBuilding>): Promise<Building | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private ranches: Map<number, Ranch>;
  private lessons: Map<number, Lesson>;
  private userProgress: Map<string, UserProgress>; // key: `${userId}-${lessonId}`
  private characters: Map<number, Character>;
  private buildings: Map<number, Building>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.ranches = new Map();
    this.lessons = new Map();
    this.userProgress = new Map();
    this.characters = new Map();
    this.buildings = new Map();
    this.currentId = 1;
    
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default lessons
    const defaultLessons: InsertLesson[] = [
      {
        title: "Introduction to Rust",
        description: "Learn the basics of Rust programming language and set up your development environment for Solana.",
        difficulty: "Beginner",
        duration: "30 min",
        reward: 100,
        requiredLessons: [],
        category: "rust",
        order: 1,
        steps: [
          {
            id: 1,
            title: "Your First Variable",
            narrative: "Welcome to Shadow Ranch, partner! Time to learn the basics of Rust. Let's start by declaring a simple variable.",
            instructions: [
              "Declare a variable named `greeting`",
              "Assign the string \"Hello, Solana!\"",
              "Print the variable using println! macro"
            ],
            hints: [
              "In Rust, strings are created with double quotes",
              "The syntax is: `let variable_name = \"string value\";`",
              "Use `println!(\"{}\", variable_name);` to print"
            ],
            validationRules: [
              {
                type: "contains",
                pattern: "let greeting",
                message: "Create a variable named 'greeting'",
                required: true
              },
              {
                type: "contains",
                pattern: "Hello, Solana!",
                message: "Assign the correct string value",
                required: true
              },
              {
                type: "contains",
                pattern: "println!",
                message: "Use println! macro to display the output",
                required: true
              }
            ],
            starterCode: "fn main() {\n    // Write your code here\n    \n}",
            expectedOutput: "Hello, Solana!"
          },
          {
            id: 2,
            title: "Working with Numbers",
            narrative: "Good work! Now let's explore Rust's number types. In the frontier, counting your coins is essential!",
            instructions: [
              "Create a variable `coins` with value 150",
              "Create a variable `gems` with value 25",
              "Calculate and print their sum"
            ],
            hints: [
              "Rust has integer types like i32, u32, etc.",
              "You can use + to add numbers",
              "Variables are immutable by default in Rust"
            ],
            validationRules: [
              {
                type: "contains",
                pattern: "let coins",
                message: "Create a 'coins' variable",
                required: true
              },
              {
                type: "contains",
                pattern: "let gems",
                message: "Create a 'gems' variable",
                required: true
              },
              {
                type: "contains",
                pattern: "coins + gems",
                message: "Calculate the sum of coins and gems",
                required: true
              }
            ],
            starterCode: "fn main() {\n    // Declare your variables here\n    \n}",
            expectedOutput: "175"
          }
        ]
      },
      {
        title: "Anchor Framework Basics",
        description: "Dive into Anchor framework and build your first Solana program with automatic IDL generation.",
        difficulty: "Intermediate",
        duration: "45 min",
        reward: 200,
        requiredLessons: [1],
        category: "anchor",
        order: 2,
        steps: [
          {
            id: 1,
            title: "Setting up Anchor",
            narrative: "Time to saddle up with Anchor! This framework makes Solana development as smooth as a well-oiled saddle.",
            instructions: [
              "Import the anchor_lang prelude",
              "Define a basic program structure",
              "Create an Initialize instruction"
            ],
            hints: [
              "Use `use anchor_lang::prelude::*;`",
              "Programs are defined with `#[program]`",
              "Instructions are functions in the program module"
            ],
            validationRules: [
              {
                type: "contains",
                pattern: "use anchor_lang::prelude::*",
                message: "Import anchor_lang prelude",
                required: true
              },
              {
                type: "contains",
                pattern: "#[program]",
                message: "Define a program with #[program] attribute",
                required: true
              }
            ],
            starterCode: "// Import Anchor prelude\n\n// Define your program here\n",
            expectedOutput: "Program compiled successfully"
          }
        ]
      },
      {
        title: "Advanced Solana Programs",
        description: "Build complex DeFi protocols and NFT marketplaces using advanced Solana programming patterns.",
        difficulty: "Advanced",
        duration: "60 min",
        reward: 500,
        requiredLessons: [1, 2],
        category: "anchor",
        order: 3,
        steps: [
          {
            id: 1,
            title: "Complex State Management",
            narrative: "You've reached the advanced frontier! Time to handle complex state like a true blockchain sheriff.",
            instructions: [
              "Define a complex account structure",
              "Implement state transitions",
              "Handle error cases"
            ],
            hints: [
              "Use Account<'info, T> for account deserialization",
              "Define custom error types",
              "Use constraint validations"
            ],
            validationRules: [
              {
                type: "contains",
                pattern: "#[account]",
                message: "Define an account structure",
                required: true
              }
            ],
            starterCode: "// Advanced Solana program structure\n",
            expectedOutput: "Advanced program deployed"
          }
        ]
      }
    ];

    // Initialize lessons
    defaultLessons.forEach(lesson => {
      this.createLesson(lesson);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    
    // Create default ranch for user
    await this.createRanch({
      userId: id,
      name: `${insertUser.username}'s Ranch`,
      coins: 100,
      experience: 0,
      level: 1
    });
    
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Ranch operations
  async getRanch(id: number): Promise<Ranch | undefined> {
    return this.ranches.get(id);
  }

  async getRanchByUserId(userId: number): Promise<Ranch | undefined> {
    return Array.from(this.ranches.values()).find(ranch => ranch.userId === userId);
  }

  async createRanch(insertRanch: InsertRanch): Promise<Ranch> {
    const id = this.currentId++;
    const ranch: Ranch = { 
      ...insertRanch, 
      id, 
      createdAt: new Date() 
    };
    this.ranches.set(id, ranch);
    return ranch;
  }

  async updateRanch(id: number, updates: Partial<InsertRanch>): Promise<Ranch | undefined> {
    const ranch = this.ranches.get(id);
    if (!ranch) return undefined;
    
    const updatedRanch = { ...ranch, ...updates };
    this.ranches.set(id, updatedRanch);
    return updatedRanch;
  }

  // Lesson operations
  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async getAllLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).sort((a, b) => a.order - b.order);
  }

  async getLessonsByCategory(category: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.category === category)
      .sort((a, b) => a.order - b.order);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = this.currentId++;
    const lesson: Lesson = { ...insertLesson, id };
    this.lessons.set(id, lesson);
    return lesson;
  }

  // User Progress operations
  async getUserProgress(userId: number, lessonId: number): Promise<UserProgress | undefined> {
    return this.userProgress.get(`${userId}-${lessonId}`);
  }

  async getUserProgressByUserId(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = this.currentId++;
    const progress: UserProgress = { 
      ...insertProgress, 
      id, 
      lastAttemptAt: new Date() 
    };
    this.userProgress.set(`${insertProgress.userId}-${insertProgress.lessonId}`, progress);
    return progress;
  }

  async updateUserProgress(userId: number, lessonId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress | undefined> {
    const key = `${userId}-${lessonId}`;
    const progress = this.userProgress.get(key);
    if (!progress) return undefined;
    
    const updatedProgress = { 
      ...progress, 
      ...updates, 
      lastAttemptAt: new Date(),
      completedAt: updates.isCompleted ? new Date() : progress.completedAt
    };
    this.userProgress.set(key, updatedProgress);
    return updatedProgress;
  }

  // Character operations
  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async getCharactersByRanchId(ranchId: number): Promise<Character[]> {
    return Array.from(this.characters.values()).filter(character => character.ranchId === ranchId);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.currentId++;
    const character: Character = { 
      ...insertCharacter, 
      id, 
      acquiredAt: new Date() 
    };
    this.characters.set(id, character);
    return character;
  }

  async updateCharacter(id: number, updates: Partial<InsertCharacter>): Promise<Character | undefined> {
    const character = this.characters.get(id);
    if (!character) return undefined;
    
    const updatedCharacter = { ...character, ...updates };
    this.characters.set(id, updatedCharacter);
    return updatedCharacter;
  }

  // Building operations
  async getBuilding(id: number): Promise<Building | undefined> {
    return this.buildings.get(id);
  }

  async getBuildingsByRanchId(ranchId: number): Promise<Building[]> {
    return Array.from(this.buildings.values()).filter(building => building.ranchId === ranchId);
  }

  async createBuilding(insertBuilding: InsertBuilding): Promise<Building> {
    const id = this.currentId++;
    const building: Building = { 
      ...insertBuilding, 
      id, 
      builtAt: new Date() 
    };
    this.buildings.set(id, building);
    return building;
  }

  async updateBuilding(id: number, updates: Partial<InsertBuilding>): Promise<Building | undefined> {
    const building = this.buildings.get(id);
    if (!building) return undefined;
    
    const updatedBuilding = { ...building, ...updates };
    this.buildings.set(id, updatedBuilding);
    return updatedBuilding;
  }
}

export const storage = new MemStorage();
