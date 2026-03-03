import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4">
            <Spinner className="size-10 text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">Loading...</p>
        </div>
    );
}
