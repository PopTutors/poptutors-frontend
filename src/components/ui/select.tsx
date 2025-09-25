import * as React from "react";
import { Listbox } from "@headlessui/react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "../../utils/cn";

/**
 * Headless UI based Select — compound API similar to the Radix version.
 *
 * Usage:
 * <Select value={value} onChange={setValue}>
 *   <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>
 *   <SelectContent>
 *     <SelectLabel>Group A</SelectLabel>
 *     <SelectItem value="one">Option One</SelectItem>
 *     <SelectItem value="two">Option Two</SelectItem>
 *     <SelectSeparator />
 *     <SelectLabel>Group B</SelectLabel>
 *     <SelectItem value="three">Option Three</SelectItem>
 *   </SelectContent>
 * </Select>
 */

/* -------------------------
   Context & Root (Select)
   ------------------------- */
type SelectProps<T> = {
  value: T | null | undefined;
  onChange: (v: T) => void;
  children?: React.ReactNode;
  as?: React.ElementType;
};

const SelectContext = React.createContext<{
  value: any;
  onChange: (v: any) => void;
} | null>(null);

function Select<T>({ value, onChange, children }: SelectProps<T>) {
  return (
    <Listbox value={value} onChange={onChange}>
      <SelectContext.Provider value={{ value, onChange }}>
        <div className="relative inline-block w-full">{children}</div>
      </SelectContext.Provider>
    </Listbox>
  );
}

/* -------------------------
   Trigger / Value
   ------------------------- */
const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
  ({ className, children, ...props }, ref) => {
    return (
      <Listbox.Button
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Listbox.Button>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

function SelectValue({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const ctx = React.useContext(SelectContext);
  const value = ctx?.value;
  // If value is string or number show it; for complex values user should pass a renderer in SelectItem children.
  return (
    <span className={cn("truncate", className)}>
      {value === null || value === undefined || value === "" ? (
        <span className="text-muted-foreground">{placeholder ?? ""}</span>
      ) : (
        // best-effort display; if value is object show JSON short string
        typeof value === "string" || typeof value === "number" ? (
          String(value)
        ) : (
          // fallback
          JSON.stringify(value)
        )
      )}
    </span>
  );
}
SelectValue.displayName = "SelectValue";

/* -------------------------
   Content / Options
   ------------------------- */
type SelectContentProps = {
  children?: React.ReactNode;
  className?: string;
  position?: "absolute" | "popper";
};

const SelectContent = React.forwardRef<HTMLUListElement, SelectContentProps>(
  ({ className, children, position = "popper", ...props }, ref) => {
    // headlessui uses static DOM for options; we'll position absolutely relative to wrapper
    return (
      <div
        ref={ref as any}
        className={cn(
          "absolute z-50 mt-1 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
          position === "popper" &&
            "left-0 right-0",
          className,
        )}
        {...props}
      >
        <ul className="p-1">{children}</ul>
      </div>
    );
  },
);
SelectContent.displayName = "SelectContent";

/* -------------------------
   Item / Option
   ------------------------- */
type SelectItemProps<T = string> = {
  value: T;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

function SelectItem<T>({ value, children, className, disabled }: SelectItemProps<T>) {
  return (
    <Listbox.Option
      value={value}
      disabled={disabled}
      as={React.Fragment}
    >
      {({ active, selected }) => (
        <li
          className={cn(
            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
            active && "bg-accent text-accent-foreground",
            disabled && "pointer-events-none opacity-50",
            className,
          )}
        >
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            {selected ? <Check className="h-4 w-4" /> : null}
          </span>
          <span className="truncate">{children}</span>
        </li>
      )}
    </Listbox.Option>
  );
}
SelectItem.displayName = "SelectItem";

/* -------------------------
   Label / Separator / Group
   ------------------------- */
const SelectLabel = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props}>
      {children}
    </div>
  ),
);
SelectLabel.displayName = "SelectLabel";

const SelectSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
  ),
);
SelectSeparator.displayName = "SelectSeparator";

const SelectGroup = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
SelectGroup.displayName = "SelectGroup";

/* -------------------------
   Scroll buttons (visual only)
   ------------------------- */
const SelectScrollUpButton = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
      <ChevronUp className="h-4 w-4" />
    </div>
  ),
);
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
      <ChevronDown className="h-4 w-4" />
    </div>
  ),
);
SelectScrollDownButton.displayName = "SelectScrollDownButton";

/* -------------------------
   Exports
   ------------------------- */
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
export type { SelectItemProps };
