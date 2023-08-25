import { Router, Request, Response, NextFunction } from 'express';

import AppDataSource from "../data-source";
import { Controller } from "utils/interfaces/interface";
import { SuccessResponse, CreatedSuccessResponse } from '../utils/requestUtils/ApiResponse';
import { User } from "../entity/user"

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserRepository = AppDataSource.getRepository(User);

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
            const { name } = req.body;
            const user = this.UserRepository.create({ name: name.toLowerCase() });
            const data = await this.UserRepository.save(user)
            new CreatedSuccessResponse('User successfully created.', data, 1).send(res);
            return;
        } catch (error) {
            next(error)
        }
    }

    private getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.UserRepository.find({});
            new SuccessResponse('Users successfully retrieved.', data, data.length).send(res);
            return;
        } catch (error) {
            next(error)
        }
    }

}

export default UserController