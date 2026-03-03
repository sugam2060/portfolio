import MessageDetail from "@/components/admin/MessagesPage/MessageDetail";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminMessageDetailPage({ params }: PageProps) {
    const { id } = await params;
    const messageId = parseInt(id);

    if (isNaN(messageId)) {
        notFound();
    }

    return (
        <div className="p-6 md:p-10 lg:px-40">
            <MessageDetail id={messageId} />
        </div>
    );
}
