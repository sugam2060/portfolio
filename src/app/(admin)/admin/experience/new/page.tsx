import ExperienceForm from "@/components/admin/ExperiencePage/ExperienceForm";

export default function NewExperiencePage() {
    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground dark:text-white">
                    Add <span className="text-primary">Experience</span>
                </h1>
                <p className="text-muted-foreground font-medium">
                    Add a new role to your professional timeline.
                </p>
            </header>

            <ExperienceForm />
        </div>
    );
}
