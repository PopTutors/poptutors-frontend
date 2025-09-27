// components/ProfileHeader.tsx
import { Button } from "../../../components/ui/button";

export function ProfileHeader() {
    return (
        <div className="bg-card text-card-foreground border border-border rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-4 md:gap-6">
                <img
                    src="/images/profile-avatar.png"
                    alt="Profile avatar"
                    className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover ring-2 ring-border"
                />
                <div className="flex-1 grid gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl md:text-2xl font-semibold">Jake Gyll</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">Product Designer at Twitter</p>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-muted-foreground">Manchester, UK</span>
                        <div className="h-1 w-1 rounded-full bg-muted" aria-hidden />
                        <div className="flex items-center gap-2">
                            <button
                                aria-label="Edit"
                                className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border hover:bg-muted transition"
                            >
                                ✎
                            </button>
                            <button
                                aria-label="Settings"
                                className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border hover:bg-muted transition"
                            >
                                ⚙
                            </button>
                        </div>
                        <div className="flex-1" />
                        <Button
                            variant="secondary"
                            className="h-8 rounded-full px-3 text-xs font-medium"
                            aria-label="Open for opportunities"
                            title="Open for opportunities"
                        >
                            OPEN FOR OPPORTUNITIES
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
