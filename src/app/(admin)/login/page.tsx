import LoginForm from "@/components/admin/LoginPage/LoginForm";
import LoginHeroSection from "@/components/admin/LoginPage/LoginHeroSection";

export default function LoginPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 items-center px-6 py-12 lg:p-0 bg-background-dark overflow-hidden relative">
            {/* Decorative Blur Backgrounds */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-0 items-center h-full">
                <div className="flex justify-center lg:justify-start lg:pl-12">
                    <LoginHeroSection />
                </div>
                <div className="flex justify-center items-center">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
