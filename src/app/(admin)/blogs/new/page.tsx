import CreateBlogForm from "@/components/admin/BlogPage/CreateBlogForm";
import { Button } from "@/components/ui/button";
import { LuChevronLeft } from "react-icons/lu";
import Link from "next/link";

export default function NewBlogPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/blogs">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <LuChevronLeft className="size-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight">Compose Article</h1>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Drafting a new insight</p>
                </div>
            </div>

            <CreateBlogForm />
        </div>
    );
}
