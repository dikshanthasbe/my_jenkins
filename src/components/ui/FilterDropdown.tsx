import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
  className?: string;
}

export function FilterDropdown({ 
  label, 
  options, 
  selected, 
  onChange, 
  multiple = true,
  className 
}: FilterDropdownProps) {
  const displayValue = () => {
    if (selected.length === 0) return `All ${label}`;
    if (selected.length === 1) {
      const option = options.find(opt => opt.value === selected[0]);
      return option?.label || selected[0];
    }
    return `${selected.length} selected`;
  };

  const handleChange = (value: string) => {
    if (multiple) {
      if (selected.includes(value)) {
        onChange(selected.filter(item => item !== value));
      } else {
        onChange([...selected, value]);
      }
    } else {
      onChange([value]);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Listbox value={selected} onChange={onChange} multiple={multiple}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <span className="block truncate text-sm">{displayValue()}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    cn(
                      'relative cursor-pointer select-none py-2 pl-10 pr-4',
                      active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                    )
                  }
                  onClick={() => handleChange(option.value)}
                >
                  {({ selected: isSelected }) => (
                    <>
                      <span className={cn('block truncate', isSelected ? 'font-medium' : 'font-normal')}>
                        {option.label}
                        {option.count !== undefined && (
                          <span className="ml-2 text-gray-500">({option.count})</span>
                        )}
                      </span>
                      {(multiple ? selected.includes(option.value) : isSelected) && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}