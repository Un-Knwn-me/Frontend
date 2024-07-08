import React, { useEffect, useRef, useState } from 'react';
import filterIcon from "../../assets/filter-icon.svg";

const CustomDropdown = ({ options, selectedOption, onSelect, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    onSelect && onSelect(option);
    setIsOpen(false);
  };

  const handleClearAll = () => {
    onSelect && onSelect(options[0]);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <div>
          <span className="rounded-md shadow-sm">
            {icon && (
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <img src={icon} alt="" className="w-5 h-5" />
              </div>
            )}
            <button
              type="button"
              className="inline-flex justify-between px-5 w-36 py-1 font-medium text-gray-700 bg-gray-200 rounded-md shadow-md text-lg"
              onClick={toggleDropdown}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <span>
              {selectedOption || 'Filter'}
              </span>
              <img src={filterIcon} alt='' className='ml-1 mt-0.5' />
            </button>
          </span>
        </div>

        {isOpen && (
          <div className="origin-top-right z-10 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 fixed">
            <ul
              tabIndex={-1}
              role="listbox"
              aria-labelledby="options-menu"
              aria-activedescendant="active-option"
              className="py-1"
            >
              {options.map((option, index) => (
                <li
                  key={index}
                  className="relative px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer select-none"
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </li>
              ))}
              <button
                className="relative px-4 py-1.5 text-sm text-gray-700 border bg-gray-100 w-full hover:bg-gray-300 hover:text-gray-900 cursor-pointer select-none rounded-lg"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
