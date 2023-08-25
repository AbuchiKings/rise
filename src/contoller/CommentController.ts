import { Router, Request, Response, NextFunction } from 'express';

import AppDataSource from "../data-source";
import { BadRequestError, NotFoundError } from '../utils/requestUtils/ApiError';
import { CreatedSuccessResponse } from '../utils/requestUtils/ApiResponse';
import { Comment } from "../entity/comment"
import { Controller } from "utils/interfaces/interface";
import { Post } from "../entity/post"
import { User } from "../entity/user"

class CommentController implements Controller {
    public path = '/posts/:postId/comments';
    public router = Router();
    private UserRepository = AppDataSource.getRepository(User);
    private PostRepository = AppDataSource.getRepository(Post);
    private CommentRepository = AppDataSource.getRepository(Comment);

    constructor() {
        //this.create = this.create.bind(this)
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.route(this.path,)
            .post(this.create)
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { content, body } = req.body;
            const [user, post] = await Promise.all([
                this.UserRepository.findOne({ where: { id: +req.body.userId }, select: ['id'] }),
                this.PostRepository.findOne({ where: { id: +req.params.postId }, select: ['id'] }),
            ]) 
            console.log(user)
            if (!user) throw new BadRequestError('Cannot create comment for non existent user.');
            if (!post) throw new NotFoundError('Post not found');

            const comment = this.CommentRepository.create({ content, user, post });
            const data = await this.CommentRepository.save(comment);
            new CreatedSuccessResponse('User successfully created.', data, 1).send(res);
            return;
        } catch (error) {
            next(error)
        }
    }

}

export default CommentController