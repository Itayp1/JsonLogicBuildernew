import { 
  users, 
  type User, 
  type InsertUser, 
  jsonLogicExpressions, 
  type JsonLogicExpression, 
  type InsertJsonLogicExpression 
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // JSON Logic Expression methods
  getExpression(id: number): Promise<JsonLogicExpression | undefined>;
  getAllExpressions(): Promise<JsonLogicExpression[]>;
  createExpression(expression: InsertJsonLogicExpression): Promise<JsonLogicExpression>;
  updateExpression(id: number, expression: InsertJsonLogicExpression): Promise<JsonLogicExpression | undefined>;
  deleteExpression(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private expressions: Map<number, JsonLogicExpression>;
  private userCurrentId: number;
  private expressionCurrentId: number;

  constructor() {
    this.users = new Map();
    this.expressions = new Map();
    this.userCurrentId = 1;
    this.expressionCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getExpression(id: number): Promise<JsonLogicExpression | undefined> {
    return this.expressions.get(id);
  }

  async getAllExpressions(): Promise<JsonLogicExpression[]> {
    return Array.from(this.expressions.values());
  }

  async createExpression(insertExpression: InsertJsonLogicExpression): Promise<JsonLogicExpression> {
    const id = this.expressionCurrentId++;
    const expression: JsonLogicExpression = {
      ...insertExpression,
      id,
      createdAt: new Date().toISOString()
    };
    this.expressions.set(id, expression);
    return expression;
  }

  async updateExpression(id: number, data: InsertJsonLogicExpression): Promise<JsonLogicExpression | undefined> {
    const existing = this.expressions.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: JsonLogicExpression = {
      ...existing,
      ...data,
    };
    
    this.expressions.set(id, updated);
    return updated;
  }

  async deleteExpression(id: number): Promise<boolean> {
    return this.expressions.delete(id);
  }
}

export const storage = new MemStorage();
