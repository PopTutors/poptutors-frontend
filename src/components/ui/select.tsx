import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";
import { Fragment } from "react";

type Option = {
  label: string;
  value: string | number;
};

interface BaseProps {
  options: Option[];
  className?: string;
  placeholder?: string;
}

export function Select({
  options,
  className,
  placeholder = "Select an option",
  ...props
}: BaseProps & Omit<React.ComponentProps<typeof Listbox>, "children">) {
  const { value } = props;

  return (
    <Listbox {...props}>
      {() => (
        <div className="relative w-full">
          <ListboxButton
            className={cn(
              "relative w-full h-[40px] cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm",
              props["aria-invalid"] &&
                "border-destructive ring-destructive/20 dark:ring-destructive/40",
              className
            )}
          >
            <span
              className={`block truncate text-${
                (value as Option)?.label ? "primary" : "muted"
              } font-poppinsregular`}
            >
              {(value as Option)?.label ?? placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="7"
                viewBox="0 0 14 7"
                fill="none"
              >
                <path d="M0 0L7 7L14 0H0Z" fill="black" />
              </svg>
            </span>
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option}
                  className={({ active }) =>
                    cn(
                      "relative cursor-default select-none py-2 pl-3 pr-9",
                      active ? "bg-blue-50 text-blue-900" : "text-gray-900"
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={cn(
                          "block truncate font-poppinsregular text-muted_dark",
                          selected ? "font-medium" : "font-normal"
                        )}
                      >
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
