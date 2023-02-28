import { mediaStatus, mediaType } from "src/utils/enums";
import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from "typeorm"

@Entity({name: "media"})

export class Media {

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: "enum", enum: mediaType})
    type: mediaType;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column()
    description: string;

    @Column({type: "enum", enum: mediaStatus, default: mediaStatus.Active})
    status: mediaStatus;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
}