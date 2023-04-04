import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    BaseEntity,
} from 'typeorm';
import { HasuraColumn, HasuraEntity } from '../../src';
import { Org } from './Org';
import { Product } from './Product';


@Entity({ schema: 'public', name: 'User' })
@HasuraEntity<User>({
    customName: 'user',
    permissions: {
        user: {
            select: true,
            update: {
                where: {
                    id: 'X-Hasura-User-Id'
                }
            },
        }
    }
})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @HasuraColumn({ permissions: { user: ['select'] } })
    id!: string;

    @Column({ type: 'text', nullable: true })
    @HasuraColumn({ permissions: { user: ['select', 'update'] } })
    name!: string;

    @Column({ name: 'orgId', type: 'uuid', nullable: true })
    @HasuraColumn({ permissions: { user: ['select'] } })
    orgId!: string;

    @ManyToOne(() => Org, (org) => org.users)
    @JoinColumn({ name: 'orgId' })
    org!: Org;

    @OneToMany(() => Product, (product) => product.user)
    products!: Product[];
}


