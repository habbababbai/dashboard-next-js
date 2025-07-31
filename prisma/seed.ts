import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Hash passwords
    const alicePassword = await hash("password123", 10);
    const bobPassword = await hash("password123", 10);

    // Create or update users using upsert
    const alice = await prisma.user.upsert({
        where: { email: "alice@example.com" },
        update: {},
        create: {
            name: "Alice",
            email: "alice@example.com",
            password: alicePassword,
        },
    });

    const bob = await prisma.user.upsert({
        where: { email: "bob@example.com" },
        update: {},
        create: {
            name: "Bob",
            email: "bob@example.com",
            password: bobPassword,
        },
    });

    // Create 15 projects for Alice
    const projectNames = [
        "E-commerce Platform",
        "Mobile App Development",
        "Website Redesign",
        "API Integration",
        "Database Migration",
        "Cloud Infrastructure",
        "Security Audit",
        "Performance Optimization",
        "User Authentication System",
        "Payment Gateway Integration",
        "Content Management System",
        "Analytics Dashboard",
        "Email Marketing Platform",
        "Customer Support Portal",
        "Inventory Management System",
    ];

    const projectDescriptions = [
        "Building a modern e-commerce platform with React and Node.js",
        "Developing a cross-platform mobile app using React Native",
        "Redesigning the company website with modern UI/UX principles",
        "Integrating third-party APIs for enhanced functionality",
        "Migrating legacy database to modern cloud solution",
        "Setting up scalable cloud infrastructure on AWS",
        "Conducting comprehensive security audit and vulnerability assessment",
        "Optimizing application performance and load times",
        "Implementing secure user authentication and authorization",
        "Integrating payment processing with Stripe and PayPal",
        "Building a flexible content management system",
        "Creating real-time analytics and reporting dashboard",
        "Developing email marketing automation platform",
        "Building customer support ticket management system",
        "Creating inventory tracking and management solution",
    ];

    const projects = [];

    for (let i = 0; i < 15; i++) {
        const project = await prisma.project.upsert({
            where: {
                id: i + 1, // Use sequential IDs
            },
            update: {},
            create: {
                name: projectNames[i],
                description: projectDescriptions[i],
                ownerId: alice.id,
                tasks: {
                    create: [
                        {
                            title: `Task 1 for ${projectNames[i]}`,
                            description: "Initial setup and planning",
                            status:
                                i % 3 === 0
                                    ? "completed"
                                    : i % 3 === 1
                                    ? "in_progress"
                                    : "todo",
                            assignedToId: alice.id,
                        },
                        {
                            title: `Task 2 for ${projectNames[i]}`,
                            description: "Development and implementation",
                            status: i % 4 === 0 ? "completed" : "in_progress",
                            assignedToId: bob.id,
                        },
                    ],
                },
            },
        });
        projects.push(project);
    }

    console.log("Seeding completed successfully!");
    console.log({ alice, bob, projectsCount: projects.length });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
