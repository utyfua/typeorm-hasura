import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity
} from 'typeorm';
import { HasuraEntity, HasuraColumn } from '../../src';
import { Product } from './Product';
import { User } from './User';


@Entity({ schema: 'public', name: 'Org' })
@HasuraEntity({
    customName: 'org',
})
export class Org extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'text', nullable: true })
    @HasuraColumn({ customName: 'myOrgName' })
    name!: string;

    @OneToMany(() => User, (user) => user.org)
    users!: User[];

    @OneToMany(() => Product, (product) => product.org)
    products!: Product[];
}
