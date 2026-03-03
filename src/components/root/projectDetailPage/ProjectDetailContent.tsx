import { Badge } from "@/components/ui/badge";
import { LuGithub, LuExternalLink, LuLayers, LuSparkles, LuCircleCheck, LuArrowLeft, LuCalendar } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";

interface ProjectDetailProps {
    project: any;
}

export default function ProjectDetailContent({ project }: ProjectDetailProps) {
    const techStack = typeof project.techStack === 'string' ? JSON.parse(project.techStack) : project.techStack;

    return (
        <main className="min-h-screen bg-background text-foreground pb-20">
            {/* Project Hero */}
            <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden flex items-end">
                {/* Background Image / Gradient */}
                <div className="absolute inset-0 z-0">
                    {project.gallery?.[0]?.photoUrl ? (
                        <Image
                            src={project.gallery[0].photoUrl}
                            alt={project.title}
                            fill
                            className="object-cover opacity-30 blur-[2px] transition-transform duration-1000"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 via-background to-surface-dark" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                <div className="container relative z-10 px-4 md:px-10 lg:px-40 pb-12 w-full max-w-[1200px] mx-auto">
                    <Link
                        href="/projects"
                        className="group flex items-center gap-2 text-primary text-sm font-black uppercase tracking-widest mb-8 hover:opacity-70 transition-all w-fit"
                    >
                        <LuArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        Back to Archives
                    </Link>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary text-white border-0 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em]">
                                {project.type}
                            </Badge>
                            <span className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                                <LuCalendar className="size-3" />
                                Engineered {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
                            {project.title.split(' ').map((word: string, i: number) => (
                                <span key={i} className={i % 2 !== 0 ? "text-primary italic" : ""}>{word} </span>
                            ))}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container px-4 md:px-10 lg:px-40 py-12 w-full max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Overview & Features */}
                    <div className="lg:col-span-8 flex flex-col gap-16">
                        {/* Summary */}
                        <div className="flex flex-col gap-6">
                            <h2 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-primary">
                                <span className="h-px w-8 bg-primary/30" />
                                Project Overview
                            </h2>
                            <p className="text-xl md:text-2xl text-muted-foreground dark:text-[#9ca6ba] leading-relaxed font-medium">
                                {project.overview}
                            </p>
                        </div>

                        {/* Engineering Features */}
                        {project.keyFeatures && project.keyFeatures.length > 0 && (
                            <div className="flex flex-col gap-8">
                                <h2 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-primary">
                                    <span className="h-px w-8 bg-primary/30" />
                                    Technical Highlights
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {project.keyFeatures.map((feature: any) => (
                                        <div key={feature.id} className="p-6 rounded-2xl bg-surface-dark dark:bg-[#11141a] border border-border/50 dark:border-[#282e39] group hover:border-primary/50 transition-all">
                                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                                <LuSparkles className="size-5" />
                                            </div>
                                            <h4 className="text-lg font-black uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{feature.title}</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{feature.subject}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery Grid */}
                        {project.gallery && project.gallery.length > 0 && (
                            <div className="flex flex-col gap-8">
                                <h2 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-primary">
                                    <span className="h-px w-8 bg-primary/30" />
                                    Visual Lab
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    {project.gallery.map((image: any, idx: number) => (
                                        <div key={image.id} className="relative aspect-video rounded-3xl overflow-hidden border border-border/50 group">
                                            <Image
                                                src={image.photoUrl}
                                                alt={`${project.title} screenshot ${idx + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Blueprint Phase Analysis {idx + 1}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        {/* Links Card */}
                        <div className="p-8 rounded-3xl bg-surface-dark dark:bg-[#11141a] border border-border/50 dark:border-[#282e39] sticky top-24">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8">Access Points</h3>

                            <div className="flex flex-col gap-4">
                                {project.link && (
                                    <Link
                                        href={project.link}
                                        target="_blank"
                                        className="w-full flex items-center justify-between p-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[10px] group shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Launch Demo
                                        <LuExternalLink className="size-4" />
                                    </Link>
                                )}
                                {project.github && (
                                    <Link
                                        href={project.github}
                                        target="_blank"
                                        className="w-full flex items-center justify-between p-4 rounded-xl bg-transparent border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:text-primary hover:border-primary font-black uppercase tracking-widest text-[10px] transition-all"
                                    >
                                        Source Code
                                        <LuGithub className="size-4" />
                                    </Link>
                                )}
                            </div>

                            <div className="mt-12">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.map((tech: string) => (
                                        <span key={tech} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-dark border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition-all">
                                            <div className="size-1 bg-primary/50 rounded-full" />
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 pt-12 border-t border-border/10">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <LuCircleCheck className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Verified Prototype</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Production Ready Output</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
