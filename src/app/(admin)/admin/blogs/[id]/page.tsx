import { getBlogById } from "@/actions/BlogActions";
import EditBlogForm from "@/components/admin/BlogPage/EditBlogForm";
import { notFound } from "next/navigation";

interface EditBlogPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
    const { id } = await params;
    const blogId = parseInt(id);

    if (isNaN(blogId)) {
        notFound();
    }

    const blog = await getBlogById(blogId);

    if (!blog) {
        notFound();
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black uppercase tracking-tighter">
                    Edit <span className="text-primary">Article</span>
                </h1>
                <p className="text-muted-foreground font-medium">
                    Modify your technical article and update its content.
                </p>
            </header>

            <EditBlogForm blog={blog} />
        </div>
    );
}
