import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { UserInterface } from "../utils/interfaces/interface"


@Entity()
export class Users implements UserInterface {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ unique: true })
    name: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date
}

@Entity()
export class Login implements UserInterface {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date
}