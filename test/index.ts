import { AppDataSource } from "./data-source";
import { User, Org, Product } from "./entity";

async function main() {
    try {
        await AppDataSource.initialize();

        console.log("Inserting a new organization into the database...");
        const org = new Org();
        org.name = "Example Organization";
        await org.save();
        console.log("Saved a new organization with id: " + org.id);

        console.log("Inserting a new user into the database...");
        const user = new User();
        user.name = "John Doe";
        user.orgId = org.id;
        await user.save();
        console.log("Saved a new user with id: " + user.id);

        console.log("Inserting a new product into the database...");
        const product = new Product();
        product.name = "Example Product";
        product.orgId = org.id;
        product.userId = user.id;
        await product.save();
        console.log("Saved a new product with id: " + product.id);

        console.log("Loading organizations, users, and products from the database...");
        const organizations = await Org.find();
        const users = await User.find();
        const products = await Product.find();
        console.log("Loaded organizations: ", organizations);
        console.log("Loaded users: ", users);
        console.log("Loaded products: ", products);

        console.log("Here you can set up and run express / fastify / any other framework.");
    } catch (error) {
        console.log(error);
    }
}

main();
