import React from "react";
import { cn } from "../../utils/cn";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        "w-full min-h-[40px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-primary font-poppinsregular font-normal",
        "placeholder:text-muted-foreground placeholder:font-normal",
        "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "transition-colors shadow-xs resize-none", // remove resize if undesired
        className
      )}
      {...props}
    />
  );
};

export default Textarea;
