import { Router, Request, Response, NextFunction } from 'express';

import AppDataSource from "../data-source";
import { BadRequestError, NotFoundError } from '../utils/requestUtils/ApiError';
import { CreatedSuccessResponse, SuccessResponse } from '../utils/requestUtils/ApiResponse';
import { Comments } from "../entity/comment"
import { Controller } from "utils/interfaces/interface";
import { Posts } from "../entity/post"
import { Users } from "../entity/user"

import { verifyToken } from "../middleware/auth";

class CommentController implements Controller {
    public path = '/posts';
    public router = Router();
    private UserRepository = AppDataSource.getRepository(Users);
    private PostRepository = AppDataSource.getRepository(Posts);
    private CommentRepository = AppDataSource.getRepository(Comments);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.route(`${this.path}/:postId/comments`)
            .post(verifyToken, this.create)
        this.router.route(`${this.path}/users`)
            .get(verifyToken, this.getTopThree)
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { content, body } = req.body;
            const [user, post] = await Promise.all([
                this.UserRepository.findOne({ where: { id: +req.body.userId }, select: ['id'] }),
                this.PostRepository.findOne({ where: { id: +req.params.postId }, select: ['id'] }),
            ])
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

    private getTopThree = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await AppDataSource.query(
               `SELECT u.id, u.name, COUNT(p.id) AS post_count, c.id, c.content, c."createdAt"
                FROM users u JOIN posts p ON u.id = p."userId"
                LEFT JOIN (
                    SELECT c1."userId", c1.id, c1.content, c1."createdAt"
                    FROM
                        comments c1
                    WHERE
                        c1."createdAt" = (
                            SELECT MAX(c2."createdAt")
                            FROM Comments c2
                            WHERE c2."userId" = c1."userId"
                        )
                ) c ON u.id = c."userId"
                GROUP BY u.id, u.name, c.id, c.content, c."createdAt"
                ORDER BY post_count DESC
                LIMIT 3;
            `)

            console.log(data)
            new SuccessResponse('Users successfully retrieved.', data, data.length).send(res);
            return;
        } catch (error) {
            next(error)
        }
    }

}

export default CommentController