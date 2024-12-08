import React, { useRef, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { Dictionary } from "@/types/dictionary";

type Option = {
  id: string;
  name: string;
  icon?: React.ReactNode;
};

type Props = {
  options: Option[];
  selectedOptions: string[];
  setSelectedOptions: (ids: string[]) => void;
  translation: Dictionary;
};

const MultiSelect: React.FC<Props> = ({
  options,
  selectedOptions,
  setSelectedOptions,
  translation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOption = (id: string) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter((optionId) => optionId !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(options.map((option) => option.id));
    }
  };

  useOnClickOutside(containerRef, () => setIsOpen(false));

  return (
    <div className="relative w-full" ref={containerRef}>
      <Listbox value={selectedOptions} onChange={setSelectedOptions} multiple>
        <Listbox.Button
          className="flex justify-between items-center w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex gap-2 flex-wrap">
            {selectedOptions.length > 0
              ? options
                  .filter((option) => selectedOptions.includes(option.id))
                  .map((option) => (
                    <span
                      key={option.id}
                      className="flex items-center gap-1 bg-gray-200 text-gray-800 rounded px-2 py-1 text-xs dark:bg-gray-700 dark:text-gray-300"
                    >
                      {option.icon} {option.name}
                    </span>
                  ))
              : translation.global.multiSelect.selectCategories}
          </div>
          <ChevronDown className="h-4 w-4 dark:text-gray-400" />
        </Listbox.Button>

        <Transition
          show={isOpen}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Listbox.Options
            static
            className="absolute mt-2 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 dark:bg-gray-800 dark:ring-gray-600"
          >
            <div className="border-b px-3 py-2 flex justify-between items-center dark:border-gray-700">
              <button
                className="text-sm text-blue-500 hover:underline dark:text-blue-400"
                onClick={toggleSelectAll}
              >
                {selectedOptions.length === options.length
                  ? translation.global.multiSelect.deselectAll
                  : translation.global.multiSelect.selectAll}
              </button>
            </div>

            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option.id}
                as="div"
                className={({ active }) =>
                  `cursor-pointer select-none px-3 py-2 ${
                    active
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "bg-white dark:bg-gray-800"
                  }`
                }
              >
                <div
                  className="flex items-center justify-between"
                  onClick={() => toggleOption(option.id)}
                >
                  <div className="flex items-center gap-2">
                    {option.icon && option.icon}
                    <span className="dark:text-gray-200">{option.name}</span>
                  </div>
                  {selectedOptions.includes(option.id) && (
                    <Check className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                  )}
                </div>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};

export default MultiSelect;
