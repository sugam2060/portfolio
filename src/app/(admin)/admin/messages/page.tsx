import MessageList from "@/components/admin/MessagesPage/MessageList";
import { LuMessagesSquare } from "react-icons/lu";

export default function AdminMessagePage() {
    return (
        <div className="p-6 md:p-10 lg:px-40 space-y-10 pb-20">
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <LuMessagesSquare className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground dark:text-white">
                        Message <span className="text-primary">Center</span>
                    </h1>
                </div>
                <p className="text-muted-foreground font-medium">
                    Review and manage inquiries from your portfolio visitors.
                </p>
            </header>

            <MessageList />
        </div>
    );
}
