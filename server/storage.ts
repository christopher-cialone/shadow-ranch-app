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
            title: "Programmatic Ownership: Securing Your Ranch with a Program Derived Address (PDA)",
            narrative: "Welcome, digital homesteader! In this decentralized frontier, we value true ownership and privacy. Unlike the old world where deeds were on paper in a dusty office, here, your ranch deed can be controlled by pure code! This is the essence of cypher-punk – using cryptography and decentralized tech to protect privacy and freedom. Today, we're diving into Program Derived Addresses (PDAs). Imagine your ranch deed isn't owned by a specific wallet with a private key, but by a special, unhackable 'strongbox' that only your ranch program can open. This strongbox address is derived from your program's ID and some unique 'seeds' (like a secret password) and a 'bump' (a special number to make sure it's valid). This makes your ranch truly decentralized and secure, giving control to the smart contract code itself.",
            instructions: [
              "In the InitializeRanch struct, locate the #[account(...)] attribute for your ranch account",
              "Add a seeds argument to this attribute with b\"ranch\" and owner.key().as_ref()",
              "Add a bump argument to this attribute for PDA validation"
            ],
            hints: [
              "Think of PDAs like a magic lockbox only your program can open",
              "You need to tell Solana what 'words' (seeds) make this lockbox unique",
              "The bump is a special number that makes sure the lockbox address is perfect and unhackable",
              "Look at the #[account(...)] line for the ranch and add the seeds and bump keywords"
            ],
            validationRules: [
              {
                type: "regex",
                pattern: "seeds\\s*=\\s*\\[b\"ranch\",\\s*owner\\.key\\(\\)\\.as_ref\\(\\)\\]\\s*,\\s*bump",
                message: "Add 'seeds = [b\"ranch\", owner.key().as_ref()], bump' to the ranch account attribute",
                required: true
              }
            ],
            starterCode: "use anchor_lang::prelude::*;\n\ndeclare_id!(\"RanchManager111111111111111111111111111111\");\n\n#[program]\npub mod ranch_manager {\n    use super::*;\n\n    pub fn initialize_ranch(\n        ctx: Context<InitializeRanch>,\n        ranch_name: String,\n    ) -> Result<()> {\n        let ranch = &mut ctx.accounts.ranch;\n        ranch.owner = ctx.accounts.owner.key();\n        ranch.name = ranch_name;\n        ranch.level = 1;\n        ranch.experience = 0;\n        ranch.ranch_coin_balance = 500;\n        ranch.building_count = 0;\n        ranch.character_count = 0;\n        ranch.created_at = Clock::get()?.unix_timestamp;\n\n        msg!(\"Ranch '{}' initialized for owner {}\", ranch.name, ranch.owner);\n        Ok(())\n    }\n}\n\n#[derive(Accounts)]\n#[instruction(ranch_name: String)]\npub struct InitializeRanch<'info> {\n    #[account(\n        init,\n        payer = owner,\n        space = 8 + Ranch::INIT_SPACE,\n        // TODO: Add seeds and bump here\n        // seeds = [b\"ranch\", owner.key().as_ref()],\n        // bump\n    )]\n    pub ranch: Account<'info, Ranch>,\n\n    #[account(mut)]\n    pub owner: Signer<'info>,\n    pub system_program: Program<'info, System>,\n}\n\n#[account]\npub struct Ranch {\n    pub owner: Pubkey,\n    pub name: String,\n    pub level: u8,\n    pub experience: u64,\n    pub ranch_coin_balance: u64,\n    pub building_count: u8,\n    pub character_count: u8,\n    pub created_at: i64,\n}\n\nimpl Ranch {\n    const INIT_SPACE: usize = 32 + 4 + 32 + 1 + 8 + 8 + 1 + 1 + 8;\n}\n\n#[error_code]\npub enum ErrorCode {\n    #[msg(\"Unauthorized access to ranch\")]\n    UnauthorizedAccess,\n}",
            expectedOutput: "Fantastic! Your ranch account is now a true Program Derived Address (PDA)! Its deed is safely locked away, controlled by your program, not a private key. You've embraced programmatic ownership!"
          }
        ]
      },
      {
        title: "Introduction to NFTs: Minting Your First Digital Asset",
        description: "Learn how to create and mint Non-Fungible Tokens (NFTs) on Solana.",
        difficulty: "Intermediate",
        duration: "60 min",
        reward: 200,
        requiredLessons: [2] as number[],
        category: "nft",
        order: 3,
        isActive: true,
        steps: [
          {
            id: 1,
            title: "Coming Soon...",
            narrative: "This lesson is under development. Check back soon for exciting NFT challenges!",
            instructions: [
              "This lesson is currently being developed",
              "More NFT challenges coming soon"
            ],
            hints: [
              "Stay tuned for more advanced Solana development lessons"
            ],
            validationRules: [],
            starterCode: "// Coming soon - NFT minting challenges!",
            expectedOutput: "More challenges are on the way!"
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
      requiredLessons: insertLesson.requiredLessons ? [...insertLesson.requiredLessons] : null
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
    const lesson: Lesson = { 
      ...insertLesson, 
      id,
      isActive: insertLesson.isActive ?? true,
      reward: insertLesson.reward ?? 100,
      requiredLessons: insertLesson.requiredLessons ? [...insertLesson.requiredLessons] : null
    };
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

// Use Firestore if available, fallback to memory storage
const USE_FIRESTORE = process.env.NODE_ENV === 'production' && 
                     process.env.FIREBASE_API_KEY && 
                     process.env.FIREBASE_PROJECT_ID;

// Dynamic storage selection
let storageInstance: IStorage;

if (USE_FIRESTORE) {
  try {
    const { FirestoreStorage } = require('./firestore-complete');
    storageInstance = new FirestoreStorage();
    console.log('✓ Using Firestore storage backend');
  } catch (error) {
    console.warn('⚠ Firestore unavailable, falling back to memory storage:', error);
    storageInstance = new MemStorage();
  }
} else {
  storageInstance = new MemStorage();
  console.log('✓ Using in-memory storage backend');
}

export const storage = storageInstance;