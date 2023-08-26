import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, CreateDateColumn } from "typeorm";
import { CommentInterface } from "../utils/interfaces/interface"

import { Posts } from "./post"
import { Users } from "./user"


@Entity()
export class Comments implements CommentInterface {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    content: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date

    @ManyToOne(() => Posts, { cascade: ["remove"] })
    @Index()
    post: Posts

    @ManyToOne(() => Users, { cascade: ["remove"] })
    @Index()
    user: Users
}