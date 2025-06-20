// Enhanced Firestore Storage Implementation - V7 Complete
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import type { User, Ranch, Lesson, UserProgress, Character, Building, InsertUser, InsertRanch, InsertLesson, InsertUserProgress, InsertCharacter, InsertBuilding } from '../shared/schema';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  private idCounter: number = 1000; // Start with high number to avoid conflicts

  private generateId(): number {
    return ++this.idCounter;
  }

  private getUserCollectionRef(userId: string, collectionName: string) {
    return collection(db, `users/${userId}/${collectionName}`);
  }

  private getPublicCollectionRef(collectionName: string) {
    return collection(db, collectionName);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const docRef = doc(db, 'users', id.toString());
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id, ...docSnap.data() } as User : undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const q = query(collection(db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return undefined;
      const doc = querySnapshot.docs[0];
      return { id: parseInt(doc.id), ...doc.data() } as User;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.generateId();
    const user: User = { 
      id, 
      ...insertUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      await setDoc(doc(db, 'users', id.toString()), user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const docRef = doc(db, 'users', id.toString());
      const updateData = { ...updates, updatedAt: new Date().toISOString() };
      await updateDoc(docRef, updateData);
      return this.getUser(id);
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  // Ranch operations
  async getRanch(id: number): Promise<Ranch | undefined> {
    try {
      const docRef = doc(db, 'ranches', id.toString());
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id, ...docSnap.data() } as Ranch : undefined;
    } catch (error) {
      console.error('Error getting ranch:', error);
      return undefined;
    }
  }

  async getRanchByUserId(userId: number): Promise<Ranch | undefined> {
    try {
      const q = query(collection(db, 'ranches'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return undefined;
      const doc = querySnapshot.docs[0];
      return { id: parseInt(doc.id), ...doc.data() } as Ranch;
    } catch (error) {
      console.error('Error getting ranch by user ID:', error);
      return undefined;
    }
  }

  async createRanch(insertRanch: InsertRanch): Promise<Ranch> {
    const id = this.generateId();
    const ranch: Ranch = { 
      id, 
      ...insertRanch,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      await setDoc(doc(db, 'ranches', id.toString()), ranch);
      return ranch;
    } catch (error) {
      console.error('Error creating ranch:', error);
      throw error;
    }
  }

  async updateRanch(id: number, updates: Partial<InsertRanch>): Promise<Ranch | undefined> {
    try {
      const docRef = doc(db, 'ranches', id.toString());
      const updateData = { ...updates, updatedAt: new Date().toISOString() };
      await updateDoc(docRef, updateData);
      return this.getRanch(id);
    } catch (error) {
      console.error('Error updating ranch:', error);
      return undefined;
    }
  }

  // Lesson operations
  async getLesson(id: number): Promise<Lesson | undefined> {
    try {
      const docRef = doc(db, 'lessons', id.toString());
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id, ...docSnap.data() } as Lesson : undefined;
    } catch (error) {
      console.error('Error getting lesson:', error);
      return undefined;
    }
  }

  async getAllLessons(): Promise<Lesson[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'lessons'));
      return querySnapshot.docs.map(doc => ({ id: parseInt(doc.id), ...doc.data() } as Lesson));
    } catch (error) {
      console.error('Error getting all lessons:', error);
      return [];
    }
  }

  async getLessonsByCategory(category: string): Promise<Lesson[]> {
    try {
      const q = query(collection(db, 'lessons'), where('category', '==', category));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: parseInt(doc.id), ...doc.data() } as Lesson));
    } catch (error) {
      console.error('Error getting lessons by category:', error);
      return [];
    }
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = this.generateId();
    const lesson: Lesson = { 
      id, 
      ...insertLesson,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      await setDoc(doc(db, 'lessons', id.toString()), lesson);
      return lesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  }

  // User Progress operations
  async getUserProgress(userId: number, lessonId: number): Promise<UserProgress | undefined> {
    try {
      const docRef = doc(db, 'userProgress', `${userId}-${lessonId}`);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() as UserProgress : undefined;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return undefined;
    }
  }

  async getUserProgressByUserId(userId: number): Promise<UserProgress[]> {
    try {
      const q = query(collection(db, 'userProgress'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as UserProgress);
    } catch (error) {
      console.error('Error getting user progress by user ID:', error);
      return [];
    }
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const progress: UserProgress = { 
      ...insertProgress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      const docId = `${insertProgress.userId}-${insertProgress.lessonId}`;
      await setDoc(doc(db, 'userProgress', docId), progress);
      return progress;
    } catch (error) {
      console.error('Error creating user progress:', error);
      throw error;
    }
  }

  async updateUserProgress(userId: number, lessonId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress | undefined> {
    try {
      const docRef = doc(db, 'userProgress', `${userId}-${lessonId}`);
      const updateData = { ...updates, updatedAt: new Date().toISOString() };
      await updateDoc(docRef, updateData);
      return this.getUserProgress(userId, lessonId);
    } catch (error) {
      console.error('Error updating user progress:', error);
      return undefined;
    }
  }

  // Character operations
  async getCharacter(id: number): Promise<Character | undefined> {
    try {
      const docRef = doc(db, 'characters', id.toString());
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id, ...docSnap.data() } as Character : undefined;
    } catch (error) {
      console.error('Error getting character:', error);
      return undefined;
    }
  }

  async getCharactersByRanchId(ranchId: number): Promise<Character[]> {
    try {
      const q = query(collection(db, 'characters'), where('ranchId', '==', ranchId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: parseInt(doc.id), ...doc.data() } as Character));
    } catch (error) {
      console.error('Error getting characters by ranch ID:', error);
      return [];
    }
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.generateId();
    const character: Character = { 
      id, 
      ...insertCharacter,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      await setDoc(doc(db, 'characters', id.toString()), character);
      return character;
    } catch (error) {
      console.error('Error creating character:', error);
      throw error;
    }
  }

  async updateCharacter(id: number, updates: Partial<InsertCharacter>): Promise<Character | undefined> {
    try {
      const docRef = doc(db, 'characters', id.toString());
      const updateData = { ...updates, updatedAt: new Date().toISOString() };
      await updateDoc(docRef, updateData);
      return this.getCharacter(id);
    } catch (error) {
      console.error('Error updating character:', error);
      return undefined;
    }
  }

  // Building operations
  async getBuilding(id: number): Promise<Building | undefined> {
    try {
      const docRef = doc(db, 'buildings', id.toString());
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id, ...docSnap.data() } as Building : undefined;
    } catch (error) {
      console.error('Error getting building:', error);
      return undefined;
    }
  }

  async getBuildingsByRanchId(ranchId: number): Promise<Building[]> {
    try {
      const q = query(collection(db, 'buildings'), where('ranchId', '==', ranchId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: parseInt(doc.id), ...doc.data() } as Building));
    } catch (error) {
      console.error('Error getting buildings by ranch ID:', error);
      return [];
    }
  }

  async createBuilding(insertBuilding: InsertBuilding): Promise<Building> {
    const id = this.generateId();
    const building: Building = { 
      id, 
      ...insertBuilding,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      await setDoc(doc(db, 'buildings', id.toString()), building);
      return building;
    } catch (error) {
      console.error('Error creating building:', error);
      throw error;
    }
  }

  async updateBuilding(id: number, updates: Partial<InsertBuilding>): Promise<Building | undefined> {
    try {
      const docRef = doc(db, 'buildings', id.toString());
      const updateData = { ...updates, updatedAt: new Date().toISOString() };
      await updateDoc(docRef, updateData);
      return this.getBuilding(id);
    } catch (error) {
      console.error('Error updating building:', error);
      return undefined;
    }
  }
}

export const storage = new FirestoreStorage();