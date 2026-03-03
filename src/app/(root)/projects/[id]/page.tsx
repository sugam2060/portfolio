import { getProjectById } from "@/actions/ProjectActions";
import { notFound } from "next/navigation";
import ProjectDetailContent from "@/components/root/projectDetailPage/ProjectDetailContent";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
    const { id } = await params;

    // Server-side data fetching
    const project = await getProjectById(parseInt(id, 10));

    if (!project) {
        notFound();
    }

    return <ProjectDetailContent project={project} />;
}
