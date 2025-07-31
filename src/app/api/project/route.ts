import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/project?userId=123&page=1&pageSize=10 - Get paginated projects for a specific user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = parseInt(searchParams.get("pageSize") || "12", 10);

        if (!userId) {
            return NextResponse.json(
                { error: "userId parameter is required" },
                { status: 400 }
            );
        }

        const userIdInt = parseInt(userId);
        if (isNaN(userIdInt)) {
            return NextResponse.json(
                { error: "userId must be a valid integer" },
                { status: 400 }
            );
        }

        const skip = (page - 1) * pageSize;

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where: {
                    ownerId: userIdInt,
                },
                include: {
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    tasks: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            assignedTo: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: pageSize,
            }),
            prisma.project.count({
                where: {
                    ownerId: userIdInt,
                },
            }),
        ]);

        return NextResponse.json({ projects, total });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}
