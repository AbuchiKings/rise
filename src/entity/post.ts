import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, CreateDateColumn } from "typeorm";
import { PostInterface } from "../utils/interfaces/interface"

import { Users } from "./user"


@Entity()
export class Posts implements PostInterface {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    title: string

    @Column()
    body: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date

    @ManyToOne(() => Users, { cascade: ["remove"] })
    @Index()
    user: Users
}