import { users, type User, type InsertUser, proxyHistory, type ProxyHistory } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface ProxyHistoryItem {
  url: string;
  timestamp: Date;
  ip: string;
  success?: boolean;
  errorMessage?: string;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  addToHistory(item: ProxyHistoryItem): Promise<void>;
  getHistory(): Promise<ProxyHistoryItem[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async addToHistory(item: ProxyHistoryItem): Promise<void> {
    await db.insert(proxyHistory).values({
      url: item.url,
      timestamp: item.timestamp,
      ip: item.ip,
      success: item.success,
      errorMessage: item.errorMessage
    });
  }

  async getHistory(): Promise<ProxyHistoryItem[]> {
    const history = await db
      .select()
      .from(proxyHistory)
      .orderBy(desc(proxyHistory.timestamp))
      .limit(1000);
    
    return history.map(item => ({
      url: item.url,
      timestamp: item.timestamp,
      ip: item.ip,
      success: item.success,
      errorMessage: item.errorMessage
    }));
  }
}

export const storage = new DatabaseStorage();
