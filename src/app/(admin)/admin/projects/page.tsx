import AddNewProject from "@/components/admin/Projects/AddnewProject";
import ProjectList from "@/components/admin/Projects/ProjectList";

export default function AdminProjectsPage() {
    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-foreground dark:text-white tracking-widest uppercase">
                    Project Management <span className="text-primary italic">Lab</span>
                </h1>
                <p className="text-muted-foreground dark:text-[#9ca6ba] text-sm font-medium tracking-tight">
                    Engineer your portfolio Showcase. Add, edit, or feature your architectural masterpieces.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <AddNewProject />
                <ProjectList />
            </div>
        </div>
    );
}
