import {
    Entity,
    PrimaryGeneratedColumn,
    Column, ManyToOne,
    JoinColumn,
} from 'typeorm';
import { HasuraColumn, HasuraEntity } from '../../src';
import { User } from './User';
import { Org } from "./Org";
import { UserRole } from '../UserRole';
import { CustomBaseEntity } from '../CustomBaseEntity';


@Entity({ schema: 'public', name: 'Product' })
@HasuraEntity<Product>({
    customName: 'Product',
    permissions: {
        [UserRole.user]: {
            where: [
                { userId: 'X-Hasura-User-Id' },
                {
                    org: [
                        {
                            users: {
                                id: 'X-Hasura-User-Id'
                            }
                        },
                        {
                            isPublic: true
                        }
                    ]
                }
            ],
            select: true,
            update: true,
        }
    }
})
export class Product extends CustomBaseEntity {
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

    @Column({ name: 'orgId', type: 'uuid', nullable: true })
    @HasuraColumn({
        permissions: {
            [UserRole.user]: ['select']
        }
    })
    orgId!: string;

    @ManyToOne(() => Org, (org) => org.products)
    @JoinColumn({ name: 'orgId' })
    org!: Org;

    @Column({ name: 'userId', type: 'uuid', nullable: true })
    @HasuraColumn({
        permissions: {
            [UserRole.user]: ['select']
        }
    })
    userId!: string;

    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: 'userId' })
    user!: User;
}
