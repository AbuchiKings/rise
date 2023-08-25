import { Router } from 'express';

export interface UserInterface {
    id: number;
    name: string;
    passwor?: string
    createdAt?: Date;
}
export interface PostInterface {
    userId?: number;
    id: number;
    title?: string;
    body?: string;
    createdAt?: Date;
}
export interface CommentInterface {
    id: number;
    userId?: number;
    content?: string;
    createdAt?: Date;
}

export interface Controller {
    path: string;
    router: Router
}
