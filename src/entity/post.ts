import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, CreateDateColumn } from "typeorm";
import { PostInterface } from "../utils/interfaces/interface"

import { User } from "./user"


@Entity()
export class Post implements PostInterface {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    title: string

    @Column()
    body: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date

    @ManyToOne(() => User, { cascade: ["remove"] })
    @Index()
    user: User
}