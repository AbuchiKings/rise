export interface User {
    id: number;
    name: string;
    passwor?: string
    createdAt?: Date;
}
export interface Post {
    userId?: number;
    id: number;
    title?: string;
    body?: string;
    createdAt?: Date;
}
export interface Comment {
    id: number;
    userId?: number;
    content?: string;
    createdAt?: Date;
}