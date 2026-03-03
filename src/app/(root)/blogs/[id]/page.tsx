import { getBlogById } from "@/actions/BlogActions";
import BlogHeader from "@/components/root/BlogDetailPage/BlogHeader";
import BlogContent from "@/components/root/BlogDetailPage/BlogContent";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface BlogDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const blog = await getBlogById(parseInt(id));

    if (!blog) return { title: "Article Not Found" };

    return {
        title: `${blog.title} | Blog`,
        description: blog.description.substring(0, 160),
    };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
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
        <main className="min-h-screen bg-background">
            <BlogHeader
                title={blog.title}
                type={blog.type}
                readTime={blog.readTime}
                createdAt={blog.createdAt}
                imageUrl={blog.imageUrl}
            />

            <BlogContent content={blog.description} />

            {/* You could add a 'Related Post' or 'More from Blog' section here */}
        </main>
    );
}
