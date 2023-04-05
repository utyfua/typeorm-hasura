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
import { UserRole } from '../UserRole';


@Entity({ schema: 'public', name: 'Org' })
@HasuraEntity<Org>({
    customName: 'Org',
    permissions: {
        [UserRole.user]: {
            where: {
                users: {
                    id: 'X-Hasura-User-Id'
                }
            },
            select: true,
            update: true,
        }
    },
})
export class Org extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @HasuraColumn({
        permissions: {
            [UserRole.user]: ['select']
        }
    })
    id!: string;

    @Column({ type: 'text', nullable: true })
    @HasuraColumn({
        // customName: 'myOrgName',
        permissions: {
            [UserRole.user]: ['select', 'update']
        }
    })
    name!: string;

    @OneToMany(() => User, (user) => user.org)
    users!: User[];

    @OneToMany(() => Product, (product) => product.org)
    products!: Product[];
}
