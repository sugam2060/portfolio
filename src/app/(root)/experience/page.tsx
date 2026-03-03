import EmptyState from "@/components/root/ExperiencePage/EmptyState";
// import NonEmptyState from "@/components/root/ExperiencePage/NonEmptyState"; // Uncomment when adding real experiences

export default function ExperiencePage() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Header Section */}
            <div className="flex flex-col gap-2 pt-4 pb-2">
                <h1 className="text-foreground dark:text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em] font-display">
                    Work Experience
                </h1>
                <p className="text-muted-foreground dark:text-[#9ca6ba] text-base font-normal leading-normal max-w-2xl">
                    My professional journey and career milestones.
                </p>
            </div>

            {/* Experience Content Layout */}
            {/* By default, we reveal the animated empty state map matching the Stitch UI.  */}
            {/* Swap this with <NonEmptyState /> or map through data when jobs are available. */}
            <EmptyState />

        </main>
    );
}
