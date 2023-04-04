import {
    Entity,
    PrimaryGeneratedColumn,
    Column, ManyToOne,
    JoinColumn,
    BaseEntity
} from 'typeorm';
import { HasuraColumn, HasuraEntity } from '../../src';
import { User } from './User';
import { Org } from "./Org";


@Entity({ schema: 'public', name: 'Product' })
@HasuraEntity<Product>({
    customName: 'product',
    permissions: {
        user: {
            where: [
                { userId: 'X-Hasura-User-Id' },
                {
                    org: {
                        users: {
                            id: 'X-Hasura-User-Id'
                        }
                    }
                }
            ],
            select: true,
            update: true,
        }
    }
})
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @HasuraColumn({
        permissions: {
            user: ['select']
        }
    })
    id!: string;

    @Column({ type: 'text', nullable: true })
    @HasuraColumn({
        permissions: {
            user: ['select', 'update']
        }
    })
    name!: string;

    @Column({ name: 'orgId', type: 'uuid', nullable: true })
    @HasuraColumn({
        permissions: {
            user: ['select']
        }
    })
    orgId!: string;

    @ManyToOne(() => Org, (org) => org.products)
    @JoinColumn({ name: 'orgId' })
    org!: Org;

    @Column({ name: 'userId', type: 'uuid', nullable: true })
    @HasuraColumn({
        permissions: {
            user: ['select']
        }
    })
    userId!: string;

    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: 'userId' })
    user!: User;
}
