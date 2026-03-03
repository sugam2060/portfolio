import BlogList from "@/components/admin/BlogPage/BlogList";

export default function AdminBlogsPage() {
    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black uppercase tracking-tighter">
                    Blog <span className="text-primary">Management</span>
                </h1>
                <p className="text-muted-foreground font-medium">
                    Publish, edit and curate your technical articles and insights.
                </p>
            </header>

            <BlogList />
        </div>
    );
}
