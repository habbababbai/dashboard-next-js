import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { User } from "@/app/types/user";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        console.log("Session:", session);
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const user = session.user as User;
        const userId = user.id;
        const projectId = parseInt(params.id, 10);
        if (isNaN(projectId)) {
            return NextResponse.json(
                { error: "Invalid project ID" },
                { status: 400 }
            );
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                owner: { select: { id: true, name: true, email: true } },
                contributors: { select: { id: true, name: true, email: true } },
                tasks: {
                    include: {
                        assignedTo: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        const isOwner = project.ownerId === Number(userId);
        const isContributor = project.contributors.some(
            (contributor) => contributor.id === userId
        );

        if (!isOwner && !isContributor) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Transform data if needed
        const transformedProject = {
            ...project,
            description: project.description || "",
            createdAt: project.createdAt.toISOString(),
            contributors: project.contributors,
            tasks: project.tasks.map((task) => ({
                ...task,
                description: task.description || "",
                createdAt: task.createdAt.toISOString(),
                assignedTo: task.assignedTo || undefined,
            })),
        };

        return NextResponse.json(
            { project: transformedProject },
            { status: 200 }
        );
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
