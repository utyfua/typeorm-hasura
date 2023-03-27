import {
    Entity,
    PrimaryGeneratedColumn,
    Column, ManyToOne,
    JoinColumn,
    BaseEntity
} from 'typeorm';
import { User } from './User';
import { Org } from "./Org";


@Entity({ schema: 'public', name: 'Product' })
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    name: string;

    @Column({ name: 'orgId', type: 'uuid', nullable: true })
    orgId: string;

    @ManyToOne(() => Org, (org) => org.products)
    @JoinColumn({ name: 'orgId' })
    org: Org;

    @Column({ name: 'userId', type: 'uuid', nullable: true })
    userId: string;

    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: 'userId' })
    user: User;
}
