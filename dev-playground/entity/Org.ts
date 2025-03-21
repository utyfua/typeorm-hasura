import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from 'typeorm';
import { HasuraEntity, HasuraColumn } from '../../src';
import { Product } from './Product';
import { User } from './User';
import { UserRole } from '../UserRole';
import { CustomBaseEntity } from '../CustomBaseEntity';


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
export class Org extends CustomBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @HasuraColumn({
        permissions: {
            [UserRole.user]: ['select']
        }
    })
    id!: string;

    @Column({ type: 'text', nullable: true })
    @HasuraColumn({
        permissions: {
            [UserRole.user]: ['select', 'update']
        }
    })
    name!: string;

    @Column({ type: 'boolean', nullable: true })
    isPublic!: boolean;

    @OneToMany(() => User, (user) => user.org)
    users!: User[];

    @OneToMany(() => Product, (product) => product.org)
    products!: Product[];
}
