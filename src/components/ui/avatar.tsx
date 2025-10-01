import * as React from "react"
import { cn } from "../../utils/cn" // optional utility for className merge

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string
    alt?: string
    size?: "sm" | "md" | "lg"
    fallback?: string // fallback initials or text
}

export const Avatar = React.forwardRef < HTMLDivElement, AvatarProps> (
    ({ src, alt, size = "md", fallback, className, ...props }, ref) => {
        const sizeClasses = {
            sm: "h-6 w-6 text-xs",
            md: "h-8 w-8 text-sm",
            lg: "h-12 w-12 text-base",
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "flex items-center justify-center rounded-full bg-gray-200 font-medium text-gray-700 overflow-hidden",
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {src ? (
                    <img src={src} alt={alt} className="h-full w-full object-cover" />
                ) : (
                    fallback?.slice(0, 2).toUpperCase()
                )}
            </div>
        )
    }
)

Avatar.displayName = "Avatar"
