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
@HasuraEntity<Org>({
    customName: 'org',
    permissions: {
        user: {
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
            user: ['select']
        }
    })
    id!: string;

    @Column({ type: 'text', nullable: true })
    @HasuraColumn({
        // customName: 'myOrgName',
        permissions: {
            user: ['select', 'update']
        }
    })
    name!: string;

    @OneToMany(() => User, (user) => user.org)
    users!: User[];

    @OneToMany(() => Product, (product) => product.org)
    products!: Product[];
}
