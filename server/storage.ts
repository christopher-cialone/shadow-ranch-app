import {
  users, ranches, lessons, userProgress, characters, buildings, rewardNfts,
  type User, type InsertUser, type Ranch, type InsertRanch, type Lesson, type InsertLesson,
  type UserProgress, type InsertUserProgress, type Character, type InsertCharacter,
  type Building, type InsertBuilding, type RewardNft, type InsertRewardNft, type LessonStep
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
    // Create default lessons including Lesson 2, Step 3 (Program Entrypoint & Instruction Dispatch)
    const defaultLessons: InsertLesson[] = [
      {
        title: "Introduction to Rust",
        description: "Learn the basics of Rust programming language and set up your development environment for Solana.",
        difficulty: "Beginner",
        duration: "30 min",
        reward: 100,
        requiredLessons: null,
        category: "rust",
        order: 1,
        isActive: true,
        steps: [
          {
            id: 1,
            title: "Your First Variable",
            narrative: "Welcome to Shadow Ranch, partner! Time to learn the basics of Rust. Let's start by declaring a simple variable.",
            instructions: [
              "Declare a variable named `greeting`",
              "Assign the string \"Hello, Solana!\""
            ],
            hints: [
              "Use 'let' keyword to declare variables in Rust",
              "String literals are enclosed in double quotes"
            ],
            validationRules: [
              {
                type: "contains",
                pattern: "let greeting",
                message: "Declare a variable named 'greeting'",
                required: true
              },
              {
                type: "contains", 
                pattern: "Hello, Solana!",
                message: "Assign the string \"Hello, Solana!\"",
                required: true
              }
            ],
            starterCode: "// Declare your greeting variable here\n",
            expectedOutput: "Variable declared successfully"
          }
        ]
      },
      {
        title: "Creating Your Ranch Account",
        description: "Build your first Solana program to manage ranch data",
        difficulty: "Beginner", 
        duration: "45 min",
        reward: 150,
        requiredLessons: [1] as number[],
        category: "solana",
        order: 2,
        isActive: true,
        steps: [
          {
            id: 1,
            title: "Define Ranch Owner Field",
            narrative: "Every ranch needs an owner. In the `Ranch` struct, add a `pubkey` field named `owner`. This will identify who controls the ranch.",
            instructions: [
              "In the Ranch struct, add a pubkey field named 'owner'",
              "Use proper Rust syntax with pub visibility",
              "Don't forget the comma for Rust!"
            ],
            hints: [
              "Rust syntax: pub owner: Pubkey,",
              "Make sure you've added it inside the Ranch definition",
              "Check for typos and correct capitalization!"
            ],
            validationRules: [
              {
                type: "regex",
                pattern: "pub\\s+owner:\\s*Pubkey,",
                message: "Add 'pub owner: Pubkey,' to the Ranch struct",
                required: true
              }
            ],
            starterCode: "use anchor_lang::prelude::*;\n\n#[account]\npub struct Ranch {\n    // TODO: Add owner field\n}\n",
            expectedOutput: "Excellent! The `owner` field has been added. Your ranch now knows who its rightful owner is!"
          },
          {
            id: 2,
            title: "Initialize Owner in `initialize_ranch`",
            narrative: "Now, inside the `initialize_ranch` function, assign the `owner` field of your `ranch` account to the `user.key()`.",
            instructions: [
              "Inside the initialize_ranch function, set ranch.owner",
              "Assign it to ctx.accounts.user.key()",
              "Remember the syntax: ranch.owner = ctx.accounts.user.key();"
            ],
            hints: [
              "Syntax: ranch.owner = ctx.accounts.user.key();",
              "Don't forget the semicolon",
              "Double-check the syntax for assigning the owner's key to the ranch account"
            ],
            validationRules: [
              {
                type: "regex",
                pattern: "ranch\\.owner\\s*=\\s*ctx\\.accounts\\.user\\.key\\(\\);",
                message: "Set ranch.owner = ctx.accounts.user.key();",
                required: true
              }
            ],
            starterCode: "pub fn initialize_ranch(ctx: Context<InitializeRanch>) -> Result<()> {\n    let ranch = &mut ctx.accounts.ranch;\n    // TODO: Set the owner\n    Ok(())\n}\n",
            expectedOutput: "Owner successfully initialized! Your ranch deed is now registered to you!"
          },
          {
            id: 3,
            title: "Program Entrypoint & Instruction Dispatch",
            narrative: "Time to create the main program entry point that handles different instructions. This is the heart of your Solana program!",
            instructions: [
              "Define the program entrypoint using #[program]",
              "Add instruction dispatch for initialize_ranch",
              "Include proper error handling with Result<()>"
            ],
            hints: [
              "Use #[program] attribute before the mod declaration",
              "Each instruction should be a public function",
              "Return Result<()> for proper error handling",
              "The program module should be public: pub mod"
            ],
            validationRules: [
              {
                type: "contains",
                pattern: "#[program]",
                message: "Add #[program] attribute",
                required: true
              },
              {
                type: "contains",
                pattern: "pub mod",
                message: "Define a public module",
                required: true
              },
              {
                type: "contains",
                pattern: "initialize_ranch",
                message: "Include initialize_ranch instruction",
                required: true
              }
            ],
            starterCode: "use anchor_lang::prelude::*;\n\ndeclare_id!(\"YourProgramIDHere\");\n\n// TODO: Add #[program] attribute and define the program module\n",
            expectedOutput: "Program entrypoint created with instruction dispatch! Your Solana program is ready to handle instructions!"
          }
        ]
      }
    ];

    // Initialize lessons
    for (const lessonData of defaultLessons) {
      const lesson = this.createLessonSync(lessonData);
    }

    // Create sample user
    const sampleUser: User = {
      id: 1,
      username: "cowboy",
      password: "password123",
      walletAddress: "11111111111111111111111111111112",
      pfpUrl: null,
      createdAt: new Date()
    };
    this.users.set(1, sampleUser);

    // Create sample ranch
    const sampleRanch: Ranch = {
      id: 1,
      name: "Shadow Ranch",
      userId: 1,
      level: 1,
      experience: 0,
      coins: 500,
      createdAt: new Date()
    };
    this.ranches.set(1, sampleRanch);
  }

  private createLessonSync(insertLesson: InsertLesson): Lesson {
    const id = this.currentId++;
    const lesson: Lesson = { 
      ...insertLesson, 
      id,
      isActive: insertLesson.isActive ?? true,
      reward: insertLesson.reward ?? 100,
      requiredLessons: insertLesson.requiredLessons || null
    };
    this.lessons.set(id, lesson);
    return lesson;
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
      createdAt: new Date(),
      walletAddress: insertUser.walletAddress ?? null,
      pfpUrl: insertUser.pfpUrl ?? null
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
      createdAt: new Date(),
      level: insertRanch.level ?? 1,
      experience: insertRanch.experience ?? 0,
      coins: insertRanch.coins ?? 100
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
      isCompleted: insertProgress.isCompleted ?? false,
      currentStep: insertProgress.currentStep ?? 1,
      attempts: insertProgress.attempts ?? 0,
      completedAt: insertProgress.isCompleted ? new Date() : null,
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
      completedAt: updates.isCompleted ? new Date() : progress.completedAt,
      lastAttemptAt: new Date()
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
      experience: insertCharacter.experience || 0,
      level: insertCharacter.level || 1,
      isActive: insertCharacter.isActive !== undefined ? insertCharacter.isActive : true,
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
      level: insertBuilding.level || 1,
      isActive: insertBuilding.isActive !== undefined ? insertBuilding.isActive : true,
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