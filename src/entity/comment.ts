import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, CreateDateColumn } from "typeorm";
import { CommentInterface } from "../utils/interfaces/interface"

import { Post } from "./post"
import { User } from "./user"


@Entity()
export class Comment implements CommentInterface {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    content: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date

    @ManyToOne(() => Post, { cascade: ["remove"] })
    @Index()
    post: Post

    @ManyToOne(() => User, { cascade: ["remove"] })
    @Index()
    user: User
}