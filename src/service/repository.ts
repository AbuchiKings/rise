import AppDataSource from "../data-source";
import { Comments } from "../entity/comment"
import { Login, Users, } from "../entity/user"
import { Posts } from "../entity/post"

const UserRepository = AppDataSource.getRepository(Users);
const PostRepository = AppDataSource.getRepository(Posts);
const CommentRepository = AppDataSource.getRepository(Comments);
const LoginRepository = AppDataSource.getRepository(Login);


export const  Model = {
    user: UserRepository,
    post: PostRepository,
    comment: CommentRepository,
    login: LoginRepository,
}
