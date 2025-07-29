import { Fragment } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

type Option = {
  label: string;
  value: string | number;
};

interface MultiSelectProps {
  options: Option[];
  className?: string;
  placeholder?: string;
  /** from RHF via {...field} */
  value: Array<string | number>;
  onChange: (selected: Array<string | number>) => void;
  onBlur?: () => void;
  name?: string;
}

export function MultiSelect({
  options,
  className,
  placeholder = 'Select options',
  value,
  onChange,
  onBlur,
  name,
}: MultiSelectProps) {
  // is this option currently selected?
  const isSelected = (opt: Option) => value.includes(opt.value);

  // toggle it in the raw value array
  const handleToggle = (opt: Option) => {
    if (isSelected(opt)) {
      onChange(value.filter((v) => v !== opt.value));
    } else {
      onChange([...value, opt.value]);
    }
  };

  // derive the Option[] for rendering tags
  const selectedOptions = options.filter((o) => isSelected(o));

  return (
    <div className={cn('relative w-full', className)}>
      <Menu as="div" className="relative w-full" onBlur={onBlur}>
        {() => (
          <>
            <MenuButton
              name={name}
              className={cn(
                'relative w-full h-[40px] rounded-md border border-gray-300 bg-white',
                'py-1.5 pl-3 pr-10 text-left text-sm font-normal flex items-center gap-2',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
            >
              <div className="flex flex-wrap gap-2 overflow-x-auto">
                {selectedOptions.length > 0 ? (
                  selectedOptions.map((o) => (
                    <span
                      key={o.value}
                      className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-xs font-poppinsregular text-gray-800 bg-white"
                    >
                      {o.label}
                    </span>
                  ))
                ) : (
                  <span className="text-muted font-normal">{placeholder}</span>
                )}
              </div>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="7"
                  viewBox="0 0 14 7"
                  fill="currentColor"
                >
                  <path d="M0 0L7 7L14 0H0Z" />
                </svg>
              </span>
            </MenuButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute z-10 mt-1 w-full bg-white shadow-lg ring-1 ring-black ring-opacity-5 rounded-md py-1 text-sm focus:outline-none">
                {options.map((opt) => (
                  <MenuItem key={opt.value} as={Fragment}>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => handleToggle(opt)}
                        className={cn(
                          'group flex w-full items-start justify-between px-3 py-2',
                          active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                        )}
                      >
                        <span className="font-poppinsregular">{opt.label}</span>
                        {isSelected(opt) && <Check className="h-4 w-4 text-blue-600" />}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
