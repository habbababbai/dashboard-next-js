import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");
    // Hash passwords
    const alicePassword = await hash("password123", 10);
    const bobPassword = await hash("password123", 10);
    // Create users
    const alice = await prisma.user.create({
        data: {
            name: "Alice",
            email: "alice@example.com",
            password: alicePassword,
        },
    });

    const bob = await prisma.user.create({
        data: {
            name: "Bob",
            email: "bob@example.com",
            password: bobPassword,
        },
    });

    // Create a project for Alice
    const project = await prisma.project.create({
        data: {
            name: "Demo Project",
            description: "A sample project for testing",
            ownerId: alice.id,
            tasks: {
                create: [
                    {
                        title: "Set up project",
                        description: "Initialize the project repository",
                        status: "todo",
                        assignedToId: alice.id,
                    },
                    {
                        title: "Invite Bob",
                        description: "Add Bob to the project",
                        status: "in_progress",
                        assignedToId: bob.id,
                    },
                ],
            },
        },
    });

    console.log({ alice, bob, project });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
