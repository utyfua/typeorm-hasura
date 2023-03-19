import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    BaseEntity,
} from 'typeorm';
import { Org } from './Org';
import { Product } from './Product';

@Entity({ schema: 'hasura_zero', name: 'User' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    name: string;

    @Column({ name: 'orgId', type: 'uuid', nullable: true })
    orgId: string;

    @ManyToOne(() => Org, (org) => org.users)
    @JoinColumn({ name: 'orgId' })
    org: Org;

    @OneToMany(() => Product, (product) => product.user)
    products: Product[];
}


