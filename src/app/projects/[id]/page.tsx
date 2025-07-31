import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { User } from "@/app/types/user";
import { notFound, redirect } from "next/navigation";
import ProjectDetailsClient from "@/app/projects/[id]/ProjectDetailsClient";

interface ProjectDetailsPageProps {
    params: { id: string };
}

export default async function ProjectDetailsPage({
    params,
}: ProjectDetailsPageProps) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as User;

        if (!user) {
            redirect("/signin");
        }
        const { id } = await params;
        const projectId = await parseInt(id);
        if (isNaN(projectId)) {
            notFound();
        }

        // Fetch project with all related data
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                contributors: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                tasks: {
                    include: {
                        assignedTo: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        if (!project) {
            notFound();
        }

        // Check authorization - owner or contributors can view project details
        const isOwner = project.ownerId === Number(user.id);

        const isContributor = project.contributors.some(
            (contributor) => contributor.id === user.id
        );

        if (!isOwner && !isContributor) {
            redirect("/projects");
        }

        // Transform Prisma data to match expected types
        const transformedProject = {
            ...project,
            description: project.description || "",
            createdAt: project.createdAt.toISOString(),
            contributors: project.contributors,
            tasks: project.tasks.map((task) => ({
                ...task,
                description: task.description || "",
                createdAt: task.createdAt.toISOString(),
                assignedTo: task.assignedTo || "",
            })),
        };

        return (
            <div className="container mx-auto px-4 py-8">
                <ProjectDetailsClient project={transformedProject} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching project details:", error);
        redirect("/projects");
    }
}
