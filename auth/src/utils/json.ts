import fs from 'node:fs';
import path from 'node:path';


// Path to your users.json file
const usersFilePath = path.join(__dirname, '../../../data/users.json');

// TODO: add types for user
export function getUserByUsername(username: string): any | null {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        const users = JSON.parse(data);
        return users.find((user: any) => user.username === username) || null;
    } catch (error) {
        return null;
    }
}

export function userExists(username: string): boolean {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        const users = JSON.parse(data);
        return users.some((user: any) => user.username === username);
    } catch (error) {
        return false;
    }
}

export function writeUser(user: any): void {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        const users = JSON.parse(data);
        users.push(user);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        fs.writeFileSync(usersFilePath, JSON.stringify([user], null, 2));
    }
}