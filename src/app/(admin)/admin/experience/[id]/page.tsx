import { getExperienceById } from "@/actions/ExperienceActions";
import ExperienceForm from "@/components/admin/ExperiencePage/ExperienceForm";
import { notFound } from "next/navigation";

interface EditExperiencePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({ params }: EditExperiencePageProps) {
    const { id } = await params;
    const expId = parseInt(id);

    if (isNaN(expId)) {
        notFound();
    }

    const experience = await getExperienceById(expId);

    if (!experience) {
        notFound();
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground dark:text-white">
                    Edit <span className="text-primary">Experience</span>
                </h1>
                <p className="text-muted-foreground font-medium">
                    Modify the details for {experience.companyName}.
                </p>
            </header>

            <ExperienceForm initialData={experience} isEdit />
        </div>
    );
}
