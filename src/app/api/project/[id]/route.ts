import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { User } from "@/app/types/user";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
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

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = session.user as User;
        const userId = user.id;
        const projectId = parseInt(params.id, 10);
        if (isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        const body = await request.json();
        const { title, description, assignedToId } = body;

        // Check permissions (owner or contributor)
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { contributors: true, owner: true }
        });
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
        const isOwner = project.ownerId === Number(userId);
        const isContributor = project.contributors.some(c => c.id === userId);
        if (!isOwner && !isContributor) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                status: "todo",
                projectId,
                assignedToId,
            },
        });

        return NextResponse.json({ task: newTask }, { status: 201 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = session.user as User;
        const userId = user.id;
        const projectId = parseInt(params.id, 10);
        if (isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        const body = await request.json();
        const { taskId, status } = body;

        // Check permissions
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { contributors: true, owner: true }
        });
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
        const isOwner = project.ownerId === Number(userId);
        const isContributor = project.contributors.some(c => c.id === userId);
        if (!isOwner && !isContributor) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId, projectId },
            data: { status },
        });

        return NextResponse.json({ task: updatedTask }, { status: 200 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = session.user as User;
        const userId = user.id;
        const projectId = parseInt(params.id, 10);
        if (isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        const body = await request.json();
        const { taskId } = body;

        // Check permissions
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { contributors: true, owner: true }
        });
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
        const isOwner = project.ownerId === Number(userId);
        const isContributor = project.contributors.some(c => c.id === userId);
        if (!isOwner && !isContributor) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.task.delete({
            where: { id: taskId, projectId },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
