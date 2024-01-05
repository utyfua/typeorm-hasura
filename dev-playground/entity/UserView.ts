import { DataSource, ManyToOne, OneToMany, RelationId, ViewColumn, ViewEntity } from "typeorm";
import { HasuraColumn, HasuraEntity } from "../../src";
import { UserRole } from "../UserRole";
import { Org, User, ProductView } from ".";
import { CustomBaseEntity } from "../CustomBaseEntity";

@ViewEntity({
  name: 'UserView',
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select("User.id", "id")
      .addSelect("User.name", "name")
      .addSelect("User.orgId", "orgId")
      .addSelect("User.testJsonB", "testJsonB")
      .from(User, "User")
})
@HasuraEntity<UserView>({
  customName: 'UserView',
  permissions: {
    [UserRole.user]: {
      select: true,
    },
  },
})
export class UserView extends CustomBaseEntity {
  @ViewColumn()
  @HasuraColumn({ permissions: { [UserRole.user]: ['select'] } })
  id!: string;

  @ViewColumn()
  @HasuraColumn({ permissions: { [UserRole.user]: ['select', 'update'] } })
  name!: string;

  @ViewColumn()
  @RelationId((frame: UserView) => frame.org)
  @HasuraColumn({ permissions: { [UserRole.user]: ['select'] } })
  orgId!: string;

  @ViewColumn()
  testJsonB!: object

  @ManyToOne(() => Org)
  org!: Org;

  @OneToMany(() => ProductView, (product) => product.user)
  products!: ProductView[];
}
