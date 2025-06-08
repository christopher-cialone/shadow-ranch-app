import {
  users, ranches, lessons, userProgress, characters, buildings, rewardNfts,
  type User, type InsertUser, type Ranch, type InsertRanch, type Lesson, type InsertLesson,
  type UserProgress, type InsertUserProgress, type Character, type InsertCharacter,
  type Building, type InsertBuilding, type RewardNft, type InsertRewardNft, type LessonStep
} from "@shared/schema";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";

// Firebase configuration using environment secrets
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase on the server-side
const firebaseApp = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(firebaseApp);

// Define base paths for Firestore collections
const ARTIFACTS_PATH = `artifacts/shadow-ranch`;

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

export class FirestoreStorage implements IStorage {
  private db: any;

  constructor() {
    this.db = firestoreDb;
    this.initializeDefaultLessons();
  }

  private getUserCollectionRef(userId: string, collectionName: string) {
    return collection(this.db, `${ARTIFACTS_PATH}/users/${userId}/${collectionName}`);
  }

  private getPublicCollectionRef(collectionName: string) {
    return collection(this.db, `${ARTIFACTS_PATH}/public/data/${collectionName}`);
  }

  private async initializeDefaultLessons() {
    try {
      const lessonsRef = this.getPublicCollectionRef('lessons');
      const snapshot = await getDocs(lessonsRef);
      if (snapshot.empty) {
        const defaultLessons = [
          {
            id: 1,
            title: "Solana Basics & Wallet Setup",
            description: "Learn the fundamentals of Solana and set up your Web3 wallet",
            difficulty: 'beginner',
            duration: '30 min',
            reward: 100,
            requiredLessons: [],
            category: 'fundamentals',
            order: 1,
            isActive: true,
            steps: [
              {
                id: 1,
                title: "Ping the Blockchain",
                narrative: "Welcome to Shadow Ranch, partner! Time to connect to the Solana network.",
                instructions: [
                  "Write `get_network_status()` to check Devnet health.",
                  "Execute the command to ping the blockchain"
                ],
                hints: [
                  "Use the exact function name: get_network_status()",
                  "Make sure to include the parentheses"
                ],
                validationRules: [
                  {
                    type: "contains",
                    pattern: "get_network_status()",
                    message: "Function call must be exactly 'get_network_status()'",
                    required: true
                  }
                ],
                starterCode: "// Connect to Solana Devnet\n// TODO: Call get_network_status() function\n",
                expectedOutput: "Network Status: Connected! Ping: 45ms | Current Slot: 245891023"
              }
            ]
          },
          {
            id: 2,
            title: "Creating Your Ranch Account",
            description: "Build your first Solana program to manage ranch data",
            difficulty: 'beginner',
            duration: '45 min',
            reward: 150,
            requiredLessons: [1],
            category: 'programming',
            order: 2,
            isActive: true,
            steps: [
              {
                id: 1,
                title: "Define Ranch Owner Field",
                narrative: "Every ranch needs an owner. Let's add that to our Ranch struct.",
                instructions: [
                  "In the Ranch struct, add a pubkey field named 'owner'",
                  "Use proper Rust syntax with pub visibility"
                ],
                hints: [
                  "Rust syntax: pub owner: Pubkey,",
                  "Don't forget the comma at the end"
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
                expectedOutput: "Ranch struct defined with owner field"
              },
              {
                id: 2,
                title: "Initialize Owner in Function",
                narrative: "Now let's assign the owner when creating a ranch.",
                instructions: [
                  "In initialize_ranch function, set ranch.owner to ctx.accounts.user.key()",
                  "Use proper Rust assignment syntax"
                ],
                hints: [
                  "Syntax: ranch.owner = ctx.accounts.user.key();",
                  "Don't forget the semicolon"
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
                expectedOutput: "Ranch owner initialized successfully"
              },
              {
                id: 3,
                title: "Program Entrypoint & Instruction Dispatch",
                narrative: "Time to create the main program entry point that handles different instructions.",
                instructions: [
                  "Define the program entrypoint using #[program]",
                  "Add instruction dispatch for initialize_ranch",
                  "Include proper error handling"
                ],
                hints: [
                  "Use #[program] attribute before the mod declaration",
                  "Each instruction should be a public function",
                  "Return Result<()> for proper error handling"
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
                expectedOutput: "Program entrypoint created with instruction dispatch"
              }
            ]
          }
        ];

        for (const lessonData of defaultLessons) {
          await setDoc(doc(lessonsRef, lessonData.id.toString()), lessonData);
        }
      }
    } catch (error) {
      console.warn('Failed to initialize Firestore lessons, falling back to local storage:', error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const userDoc = doc(this.getPublicCollectionRef('users'), id.toString());
      const userSnap = await getDoc(userDoc);
      if (!userSnap.exists()) return undefined;
      return { ...userSnap.data(), id: parseInt(userSnap.id) } as User;
    } catch (error) {
      console.warn('Firestore getUser failed:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const q = query(this.getPublicCollectionRef('users'), where('username', '==', username));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return undefined;
      const docData = snapshot.docs[0].data();
      return { ...docData, id: parseInt(snapshot.docs[0].id) } as User;
    } catch (error) {
      console.warn('Firestore getUserByUsername failed:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const newUserRef = doc(this.getPublicCollectionRef('users'), Date.now().toString());
      const userData = { ...insertUser, createdAt: new Date() };
      await setDoc(newUserRef, userData);
      return { ...userData, id: parseInt(newUserRef.id) } as User;
    } catch (error) {
      console.warn('Firestore createUser failed:', error);
      // Fallback to mock user
      return {
        id: Date.now(),
        username: insertUser.username,
        password: insertUser.password,
        walletAddress: insertUser.walletAddress || null,
        pfpUrl: insertUser.pfpUrl || null,
        createdAt: new Date()
      };
    }
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const userRef = doc(this.getPublicCollectionRef('users'), id.toString());
      await updateDoc(userRef, updates);
      const updatedUser = await getDoc(userRef);
      return { ...updatedUser.data(), id } as User;
    } catch (error) {
      console.warn('Firestore updateUser failed:', error);
      return undefined;
    }
  }

  // Ranch operations
  async getRanch(id: number): Promise<Ranch | undefined> {
    try {
      const ranchDoc = doc(this.getPublicCollectionRef('ranches'), id.toString());
      const ranchSnap = await getDoc(ranchDoc);
      if (!ranchSnap.exists()) return undefined;
      return { ...ranchSnap.data(), id: parseInt(ranchSnap.id) } as Ranch;
    } catch (error) {
      console.warn('Firestore getRanch failed:', error);
      return undefined;
    }
  }

  async getRanchByUserId(userId: number): Promise<Ranch | undefined> {
    try {
      const q = query(this.getPublicCollectionRef('ranches'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return undefined;
      const docData = snapshot.docs[0].data();
      return { ...docData, id: parseInt(snapshot.docs[0].id) } as Ranch;
    } catch (error) {
      console.warn('Firestore getRanchByUserId failed:', error);
      return undefined;
    }
  }

  async createRanch(insertRanch: InsertRanch): Promise<Ranch> {
    try {
      const newRanchRef = doc(this.getPublicCollectionRef('ranches'), Date.now().toString());
      const ranchData = { 
        ...insertRanch, 
        level: insertRanch.level || 1,
        experience: insertRanch.experience || 0,
        coins: insertRanch.coins || 500,
        createdAt: new Date() 
      };
      await setDoc(newRanchRef, ranchData);
      return { ...ranchData, id: parseInt(newRanchRef.id) } as Ranch;
    } catch (error) {
      console.warn('Firestore createRanch failed:', error);
      // Fallback to mock ranch
      return {
        id: Date.now(),
        name: insertRanch.name,
        userId: insertRanch.userId,
        level: insertRanch.level || 1,
        experience: insertRanch.experience || 0,
        coins: insertRanch.coins || 500,
        createdAt: new Date()
      };
    }
  }

  async updateRanch(id: number, updates: Partial<InsertRanch>): Promise<Ranch | undefined> {
    try {
      const ranchRef = doc(this.getPublicCollectionRef('ranches'), id.toString());
      await updateDoc(ranchRef, updates);
      const updatedRanch = await getDoc(ranchRef);
      return { ...updatedRanch.data(), id } as Ranch;
    } catch (error) {
      console.warn('Firestore updateRanch failed:', error);
      return undefined;
    }
  }

  // Lesson operations
  async getLesson(id: number): Promise<Lesson | undefined> {
    try {
      const lessonDoc = doc(this.getPublicCollectionRef('lessons'), id.toString());
      const lessonSnap = await getDoc(lessonDoc);
      if (!lessonSnap.exists()) return undefined;
      return { ...lessonSnap.data(), id: parseInt(lessonSnap.id) } as Lesson;
    } catch (error) {
      console.warn('Firestore getLesson failed:', error);
      return undefined;
    }
  }

  async getAllLessons(): Promise<Lesson[]> {
    try {
      const snapshot = await getDocs(this.getPublicCollectionRef('lessons'));
      return snapshot.docs.map(doc => ({ 
        ...doc.data(), 
        id: parseInt(doc.id) 
      })) as Lesson[];
    } catch (error) {
      console.warn('Firestore getAllLessons failed:', error);
      return [];
    }
  }

  async getLessonsByCategory(category: string): Promise<Lesson[]> {
    try {
      const q = query(this.getPublicCollectionRef('lessons'), where('category', '==', category));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        ...doc.data(), 
        id: parseInt(doc.id) 
      })) as Lesson[];
    } catch (error) {
      console.warn('Firestore getLessonsByCategory failed:', error);
      return [];
    }
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    try {
      const newLessonRef = doc(this.getPublicCollectionRef('lessons'), Date.now().toString());
      await setDoc(newLessonRef, insertLesson);
      return { ...insertLesson, id: parseInt(newLessonRef.id) } as Lesson;
    } catch (error) {
      console.warn('Firestore createLesson failed:', error);
      return { ...insertLesson, id: Date.now() } as Lesson;
    }
  }

  // User Progress operations  
  async getUserProgress(userId: number, lessonId: number): Promise<UserProgress | undefined> {
    try {
      const q = query(this.getUserCollectionRef(userId.toString(), 'progress'), where('lessonId', '==', lessonId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return undefined;
      const docData = snapshot.docs[0].data();
      return { ...docData, id: parseInt(snapshot.docs[0].id) } as UserProgress;
    } catch (error) {
      console.warn('Firestore getUserProgress failed:', error);
      return undefined;
    }
  }

  async getUserProgressByUserId(userId: number): Promise<UserProgress[]> {
    try {
      const snapshot = await getDocs(this.getUserCollectionRef(userId.toString(), 'progress'));
      return snapshot.docs.map(doc => ({ 
        ...doc.data(), 
        id: parseInt(doc.id) 
      })) as UserProgress[];
    } catch (error) {
      console.warn('Firestore getUserProgressByUserId failed:', error);
      return [];
    }
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    try {
      const progressRef = this.getUserCollectionRef(insertProgress.userId.toString(), 'progress');
      const docRef = await addDoc(progressRef, {
        ...insertProgress,
        completedAt: insertProgress.isCompleted ? new Date() : null,
        lastAttemptAt: new Date()
      });
      const newProgress = await getDoc(docRef);
      return { ...newProgress.data(), id: parseInt(docRef.id) } as UserProgress;
    } catch (error) {
      console.warn('Firestore createUserProgress failed:', error);
      return {
        id: Date.now(),
        userId: insertProgress.userId,
        lessonId: insertProgress.lessonId,
        isCompleted: insertProgress.isCompleted || false,
        currentStep: insertProgress.currentStep || 1,
        attempts: insertProgress.attempts || 0,
        completedAt: insertProgress.isCompleted ? new Date() : null,
        lastAttemptAt: new Date()
      };
    }
  }

  async updateUserProgress(userId: number, lessonId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress | undefined> {
    try {
      const q = query(this.getUserCollectionRef(userId.toString(), 'progress'), where('lessonId', '==', lessonId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return undefined;
      
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, {
        ...updates,
        completedAt: updates.isCompleted ? new Date() : null,
        lastAttemptAt: new Date()
      });
      
      const updatedProgress = await getDoc(docRef);
      return { ...updatedProgress.data(), id: parseInt(docRef.id) } as UserProgress;
    } catch (error) {
      console.warn('Firestore updateUserProgress failed:', error);
      return undefined;
    }
  }

  // Character operations
  async getCharacter(id: number): Promise<Character | undefined> {
    return undefined; // Simplified for now
  }

  async getCharactersByRanchId(ranchId: number): Promise<Character[]> {
    return []; // Simplified for now
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    return {
      id: Date.now(),
      name: insertCharacter.name,
      type: insertCharacter.type,
      rarity: insertCharacter.rarity,
      level: insertCharacter.level || 1,
      experience: insertCharacter.experience || 0,
      position: insertCharacter.position,
      isActive: insertCharacter.isActive || true,
      ranchId: insertCharacter.ranchId,
      acquiredAt: new Date()
    };
  }

  async updateCharacter(id: number, updates: Partial<InsertCharacter>): Promise<Character | undefined> {
    return undefined; // Simplified for now
  }

  // Building operations
  async getBuilding(id: number): Promise<Building | undefined> {
    return undefined; // Simplified for now
  }

  async getBuildingsByRanchId(ranchId: number): Promise<Building[]> {
    return []; // Simplified for now
  }

  async createBuilding(insertBuilding: InsertBuilding): Promise<Building> {
    return {
      id: Date.now(),
      name: insertBuilding.name,
      type: insertBuilding.type,
      level: insertBuilding.level || 1,
      position: insertBuilding.position,
      isActive: insertBuilding.isActive || true,
      ranchId: insertBuilding.ranchId,
      builtAt: new Date()
    };
  }

  async updateBuilding(id: number, updates: Partial<InsertBuilding>): Promise<Building | undefined> {
    return undefined; // Simplified for now
  }
}

export const storage = new FirestoreStorage();