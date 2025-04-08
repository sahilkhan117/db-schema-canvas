
import Dexie, { Table } from 'dexie';

export interface Project {
  id?: number;
  name: string;
  dbml: string;
  jsonData?: string;
  createdAt: Date;
  updatedAt: Date;
}

class DBCanvasDatabase extends Dexie {
  projects!: Table<Project>;

  constructor() {
    super('DBCanvasDatabase');
    this.version(1).stores({
      projects: '++id, name, createdAt, updatedAt'
    });
  }
}

export const db = new DBCanvasDatabase();

export async function getProjects(): Promise<Project[]> {
  return await db.projects.orderBy('updatedAt').reverse().toArray();
}

export async function getProject(id: number): Promise<Project | undefined> {
  return await db.projects.get(id);
}

export async function createProject(name: string): Promise<number> {
  const now = new Date();
  // Default DBML for new projects
  const defaultDbml = `// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table users {
  id integer [primary key]
  username varchar
  email varchar
  created_at timestamp
}

Table posts {
  id integer [primary key]
  title varchar
  body text [note: 'Content of the post']
  user_id integer
  status post_status
  created_at timestamp
}

Enum post_status {
  draft
  published
  archived
}

Ref: posts.user_id > users.id // many-to-one
`;

  return await db.projects.add({
    name,
    dbml: defaultDbml,
    createdAt: now,
    updatedAt: now
  });
}

export async function updateProject(id: number, updates: Partial<Project>): Promise<number> {
  updates.updatedAt = new Date();
  return await db.projects.update(id, updates);
}

export async function deleteProject(id: number): Promise<void> {
  await db.projects.delete(id);
}
