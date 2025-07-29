import { getProjectsByUserId } from "@/app/helpers/api";
import ProjectsClient from "@/app/projects/ProjectsClient";

// This is an SSR component that fetches data on the server
export default async function ProjectsPage() {
  try {
    // For now, we'll fetch projects for user ID 1
    // In a real app, you'd get the user ID from the session
    const projects = await getProjectsByUserId(1);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">Manage and view all your projects</p>
        </div>
        
        <ProjectsClient initialProjects={projects} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">Manage and view all your projects</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Projects</h2>
          <p className="text-red-600">
            There was an error loading your projects. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }
} 