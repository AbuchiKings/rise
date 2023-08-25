import dotenv from 'dotenv';

import App from './app';
import CommentController  from './contoller/CommentController';
import UserController  from './contoller/UserController';
import PostController  from './contoller/PostController';

import validateEnv from './utils/validateEnv';

dotenv.config();

validateEnv();

const app = new App([new UserController(), new PostController(), new CommentController()], Number(process.env.PORT));
app.listen();