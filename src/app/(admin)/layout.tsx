import AdminHeader from "@/components/admin/Header";
import AdminFooter from "@/components/admin/Footer";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-[#050505] text-foreground">
            <AdminHeader />
            <main className="flex-1 w-full">
                {children}
            </main>
            <AdminFooter />
        </div>
    );
}
