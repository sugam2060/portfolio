import ExperienceList from "@/components/admin/ExperiencePage/ExperienceList";

export default function AdminExperiencePage() {
    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground dark:text-white">
                    Experience <span className="text-primary">Console</span>
                </h1>
                <p className="text-muted-foreground font-medium">
                    Manage your professional work history and career milestones.
                </p>
            </header>

            <ExperienceList />
        </div>
    );
}
