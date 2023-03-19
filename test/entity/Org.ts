import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity
} from 'typeorm';
import { Product } from './Product';
import { User } from './User';


@Entity({ schema: 'hasura_zero', name: 'Org' })
export class Org extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    name: string;

    @OneToMany(() => User, (user) => user.org)
    users: User[];

    @OneToMany(() => Product, (product) => product.org)
    products: Product[];
}
