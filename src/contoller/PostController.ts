import { Router, Request, Response, NextFunction } from 'express';

import AppDataSource from "../data-source";
import { BadRequestError } from '../utils/requestUtils/ApiError';
import { CreatedSuccessResponse, SuccessResponse } from '../utils/requestUtils/ApiResponse';
import { Controller } from "utils/interfaces/interface";
import { Post } from "../entity/post"
import { User } from "../entity/user"

class PostController implements Controller {
    public path = '/users/:id/posts';
    public router = Router();
    private UserRepository = AppDataSource.getRepository(User);
    private PostRepository = AppDataSource.getRepository(Post);

    constructor() {
        //this.create = this.create.bind(this)
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.route(this.path,)
            .post(this.create)
            .get(this.getAll)
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { title, body } = req.body;
            const user = await this.UserRepository.findOne({ where: { id: +req.params.id }, select: ['id'] });
            console.log(user)
            if (!user) throw new BadRequestError('Cannot create post for non existent user.');

            const post = this.PostRepository.create({ title, body, user: user })
            const data = await this.PostRepository.save(post);
            new CreatedSuccessResponse('User successfully created.', data, 1).send(res);
            return;
        } catch (error) {
            next(error)
        }
    }

    private getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.PostRepository.find({
                // @ts-ignore
                where: {
                    user: +req.params.id
                }
            });
            new SuccessResponse('Users successfully retrieved.', data, data.length).send(res);
            return;
        } catch (error) {
            next(error)
        }
    }

}

export default PostController