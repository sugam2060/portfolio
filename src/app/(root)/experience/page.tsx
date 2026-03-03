import EmptyState from "@/components/root/ExperiencePage/EmptyState";
import NonEmptyState from "@/components/root/ExperiencePage/NonEmptyState";
import { getExperiences } from "@/actions/ExperienceActions";

export default async function ExperiencePage() {
    const experiences = await getExperiences();

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Header Section */}
            <div className="flex flex-col gap-2 pt-4 pb-2">
                <h1 className="text-foreground dark:text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em]">
                    Career <span className="text-primary tracking-tighter uppercase italic">Timeline</span>
                </h1>
                <p className="text-muted-foreground dark:text-[#9ca6ba] text-base font-normal leading-normal max-w-2xl">
                    Evolution of my professional journey, focusing on AI systems, scalable infrastructure, and high-impact engineering roles.
                </p>
            </div>

            {/* Experience Content Layout */}
            {experiences && experiences.length > 0 ? (
                <div className="space-y-8 mt-12">
                    {experiences.map((exp: any) => (
                        <NonEmptyState key={exp.id} data={exp} />
                    ))}
                </div>
            ) : (
                <EmptyState />
            )}

        </main>
    );
}
