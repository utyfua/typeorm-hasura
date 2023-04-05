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
import { UserRole } from '../UserRole';


@Entity({ schema: 'public', name: 'User' })
@HasuraEntity<User>({
    customName: 'User',
    permissions: {
        [UserRole.user]: {
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
    @HasuraColumn({ permissions: { [UserRole.user]: ['select'] } })
    id!: string;

    @Column({ type: 'text', nullable: true })
    @HasuraColumn({ permissions: { [UserRole.user]: ['select', 'update'] } })
    name!: string;

    @Column({ name: 'orgId', type: 'uuid', nullable: true })
    @HasuraColumn({ permissions: { [UserRole.user]: ['select'] } })
    orgId!: string;

    @ManyToOne(() => Org, (org) => org.users)
    @JoinColumn({ name: 'orgId' })
    org!: Org;

    @OneToMany(() => Product, (product) => product.user)
    products!: Product[];
}


