import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';
import { Fragment } from 'react';

type Option = { label: string; value: string };

type SelectDropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  icon?: string;
  placeholder?: string;
};

export default function SelectDropdown({
  options,
  value,
  onChange,
  icon,
  placeholder,
}: SelectDropdownProps) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative w-full">
        <Listbox.Button className="relative w-full cursor-default rounded-md border border-[#D1D5DB] bg-white py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm">
          <span className="block truncate text-[14px] text-primary font-poppinsmedium">
            {options.find((opt) => opt.value === value)?.label || placeholder || 'Select an option'}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            {icon ? <img src={icon} alt="" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-9 ${
                    active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate text-[14px] ${selected ? 'font-poppinsmedium' : 'font-normal'}`}
                    >
                      {option.label}
                    </span>
                    {selected && (
                      <Check className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 h-4 w-4" />
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
