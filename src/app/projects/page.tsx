import { getProjectsByUserId } from "@/app/helpers/api";
import ProjectsClient from "@/app/projects/ProjectsClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { User } from "../types/user";

interface ProjectsPageProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProjectsPage({
    searchParams,
}: ProjectsPageProps) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as User;
        const page = parseInt((searchParams?.page as string) || "1", 10);
        const pageSize = 12;
        const { projects, total } = await getProjectsByUserId(
            user?.id,
            page,
            pageSize
        );

        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white-900 mb-2">
                        My Projects
                    </h1>
                    <p className="text-gray-600">
                        Manage and view all your projects
                    </p>
                </div>

                <ProjectsClient
                    initialProjects={projects}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                />
            </div>
        );
    } catch (error) {
        console.error("Error fetching projects:", error);
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        My Projects
                    </h1>
                    <p className="text-gray-600">
                        Manage and view all your projects
                    </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-800 mb-2">
                        Error Loading Projects
                    </h2>
                    <p className="text-red-600">
                        There was an error loading your projects. Please try
                        refreshing the page.
                    </p>
                </div>
            </div>
        );
    }
}
