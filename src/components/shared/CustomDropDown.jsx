import React, { useEffect, useRef, useState } from 'react';
import filterIcon from "../../assets/filter-icon.svg";
import { MdOutlineSort } from "react-icons/md";

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
          <span className="rounded-md">
            {icon && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <img src={icon} alt="" className="w-5 h-5" />
              </div>
            )}
            <button
              type="button"
              className="inline-flex items-center justify-between px-2 py-1 text-lg font-medium text-gray-700 bg-transparent rounded-md focus:outline-none"
              onClick={toggleDropdown}
              aria-haspopup="listbox"
              aria-expanded="false"
            >
              <span>
                {selectedOption?.label || 'Sort by'}
              </span>
              <MdOutlineSort className='ml-2 mt-0.5 text-lg'/>
            </button>
          </span>
        </div>

        {isOpen && (
          <div className="fixed z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5">
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
                  className="relative px-4 py-2 text-sm text-gray-700 cursor-pointer select-none hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};


export default CustomDropdown;
