import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import ProjectDetailsClient, {
    ProjectDetailsClientProps,
} from "@/app/projects/[id]/ProjectDetailsClient";
import { getProjectById } from "@/app/helpers/api";

interface ProjectDetailsPageProps {
    params: { id: string };
}

export default async function ProjectDetailsPage({
    params,
}: ProjectDetailsPageProps) {
    try {
        // Pass cookies for authentication
        const data = await getProjectById(
            Number(params.id),
            cookies().toString()
        );

        // Handle API errors
        if (data?.error === "Unauthorized") {
            redirect("/signin");
        }
        if (data?.error === "Forbidden") {
            redirect("/projects");
        }
        if (data?.error === "Project not found") {
            notFound();
        }
        if (!data?.project) {
            throw new Error("Failed to fetch project");
        }

        const transformedProject: ProjectDetailsClientProps = {
            project: data.project,
        };

        return (
            <div className="container mx-auto px-4 py-8">
                <ProjectDetailsClient {...transformedProject} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching project details:", error);
        redirect("/projects");
    }
}
