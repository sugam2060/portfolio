import ContactHeroSection from "@/components/root/ContactPage/ContactHeroSection";
import ContactForm from "@/components/root/ContactPage/ContactForm";

export default function ContactPage() {
    return (
        <main className="flex-grow flex flex-col items-center py-16 px-6 sm:px-10">
            <div className="max-w-4xl w-full text-foreground dark:text-white">

                {/* Header Section */}
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter font-display">
                        Get in <span className="text-primary">Touch</span>
                    </h1>
                    <p className="text-muted-foreground dark:text-slate-400 text-lg max-w-xl">
                        Have a project in mind, a question, or just want to say hi? I'm always open to discussing new opportunities and tech challenges.
                    </p>
                </div>

                {/* Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <ContactHeroSection />
                    <ContactForm />
                </div>

            </div>
        </main>
    );
}
