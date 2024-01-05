import { DataSource, JoinColumn, ManyToOne, RelationId, ViewColumn, ViewEntity } from "typeorm";
import { HasuraColumn, HasuraEntity } from "../../src";
import { UserRole } from "../UserRole";
import { Org, UserView, Product } from ".";
import { CustomBaseEntity } from "../CustomBaseEntity";

@ViewEntity({
    name: 'ProductView',
    expression: (dataSource: DataSource) =>
        dataSource
            .createQueryBuilder()
            .select("Product.id", "id")
            .addSelect("Product.name", "name")
            .addSelect("Product.orgId", "orgId")
            .addSelect("Product.userId", "userId")
            .from(Product, "Product")
})
@HasuraEntity<ProductView>({
    customName: 'ProductView',
    permissions: {
        [UserRole.user]: {
            select: true,
        }
    }
})
export class ProductView extends CustomBaseEntity {
    @ViewColumn()
    @HasuraColumn({ permissions: { [UserRole.user]: ['select'] } })
    id!: string;

    @ViewColumn()
    @HasuraColumn({ permissions: { [UserRole.user]: ['select', 'update'] } })
    name!: string;

    @ViewColumn()
    @RelationId((frame: ProductView) => frame.org)
    @HasuraColumn({ permissions: { [UserRole.user]: ['select'] } })
    orgId!: string;

    @ManyToOne(() => Org)
    @JoinColumn({ name: "orgId" })
    org!: Org;

    @ViewColumn()
    @RelationId((frame: ProductView) => frame.user)
    @HasuraColumn({ permissions: { [UserRole.user]: ['select'] } })
    userId!: string;

    @ManyToOne(() => UserView)
    user!: UserView;
}
