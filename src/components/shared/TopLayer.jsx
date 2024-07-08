import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomDropdown from './CustomDropDown';
import defaultAddIcon from '../../assets/add-icon.svg'; // Import the default add button icon

const TopLayer = ({
    showDropdown = false,
    options = [],
    selectedOption = '',
    setSelectedOption,
    showButton = false,
    buttonTitle = '',
    routeForButton = '',
    icon = '',
    isAddButton = false,
    addButtonRoute = '',
    addButtonText = '',
    addButtonIcon = defaultAddIcon,
    arrangeIconRight = false,
    isSearch = false,
    onSearch,
    onAddButtonClick,
    dropdownAlignLeft = true // New prop for dropdown alignment
}) => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchValue(value);
        if (onSearch) {
            onSearch(value); // Call the onSearch function with the search value
        }
    };

    const handleButtonClick = () => {
        if (routeForButton) {
            navigate(routeForButton);
        } else {
            if (onAddButtonClick) {
                onAddButtonClick();
                console.log('onAddButtonClick')
            }
        }
    };

    const handleAddButtonClick = () => {
        if (addButtonRoute) {
            navigate(addButtonRoute);
        } else {
            if (onAddButtonClick)
                onAddButtonClick();
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center px-4 min-h-[80px] bg-white relative">
            <div className="flex flex-wrap justify-center md:justify-start items-center w-full md:w-auto">
                {isSearch && (
                    <div className='max-w-xs mx-auto mb-4 md:mb-0 md:mr-10'>
                        <div className="relative flex items-center w-full h-10 rounded-lg focus-within:shadow-lg overflow-hidden">
                            <input
                                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 pl-5 bg-gray-100"
                                type="text"
                                id="search"
                                placeholder="Search something.."
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                            <div className="grid place-items-center h-full w-12 text-gray-900 bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
                {showButton && (
                    <button
                        className="text-white bg-sky-400 rounded-xl px-4 py-2 shadow-lg shadow-slate-900/20 shadow-2 shadow-r-[3px] -shadow-spread-2 mr-8"
                        aria-current="page"
                        onClick={handleButtonClick}
                    >
                        {buttonTitle}
                    </button>
                )}
                {showDropdown && (
                    <div className={`relative self-start`}>
                        <CustomDropdown options={options} selectedOption={selectedOption} onSelect={setSelectedOption} icon={icon} />
                    </div>
                )}
                {isAddButton && (
                    <button
                        className="flex absolute right-5 cursor-pointer"
                        onClick={handleAddButtonClick}
                    >
                        {arrangeIconRight ? (
                            <span className="ml-5 flex font-semibold" style={{ fontSize: "17px" }}>
                                {addButtonText}
                                <img src={addButtonIcon} alt="Add Icon" className="w-7 h-7 ml-2" />
                            </span>
                        ) : (
                            <span className="ml-5 flex font-semibold mt-2" style={{ fontSize: "17px" }}>
                                <img src={addButtonIcon} alt="Add Icon" className="w-5 h-5 mr-2 mt-1" />
                                {addButtonText}
                            </span>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default TopLayer;
