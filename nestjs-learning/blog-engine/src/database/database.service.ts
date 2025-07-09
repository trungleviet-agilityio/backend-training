/*
Database service is used to define the service for the database.
*/

import { Injectable } from '@nestjs/common';
import { Database } from 'sqlite3';

/*
DatabaseService is a service that provides the database functionality for the application.
*/
@Injectable()
export class DatabaseService {
    private readonly database: Database;

    constructor() {
        this.database = new Database('blog.db');
    }

    async createTable() {
        this.database.run(`
            CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                content TEXT,
                createdAt TEXT,
                updatedAt TEXT
            )
        `);
    }
}
