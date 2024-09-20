import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomDropdown from './CustomDropDown';
import defaultAddIcon from '../../assets/add-icon.svg'; 

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
    dropdownAlignLeft = true
}) => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchValue(value);
        if (onSearch) {
            onSearch(value); 
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
        <div className="relative flex flex-col items-center justify-between px-4 py-3 bg-white md:flex-row">
            <div className="flex flex-wrap items-center justify-center w-full md:justify-start md:w-auto">
                {isSearch && (
                    <div className='max-w-xs mx-auto mb-4 md:mb-0 md:mr-10'>
                        <div className="relative flex items-center w-full h-10 overflow-hidden rounded-lg focus-within:shadow-lg">
                            <input
                                className="w-full h-full pl-5 pr-2 text-sm text-gray-700 bg-gray-100 outline-none peer"
                                type="text"
                                id="search"
                                placeholder="Search something.."
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                            <div className="grid w-12 h-full text-gray-900 bg-gray-100 place-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                {/* {showDropdown && (
                    <div className={`relative self-start`}>
                        <CustomDropdown options={options} selectedOption={selectedOption} onSelect={setSelectedOption} icon={icon} />
                    </div>
                )} */}
                {isAddButton && (
                    <button
                        className="absolute flex cursor-pointer right-5"
                        onClick={handleAddButtonClick}
                    >
                        {arrangeIconRight ? (
                            <span className="flex ml-5 font-semibold" style={{ fontSize: "17px" }}>
                                {addButtonText}
                                <img src={addButtonIcon} alt="Add Icon" className="ml-2 w-7 h-7" />
                            </span>
                        ) : (
                            <span className="flex mt-2 ml-5 font-semibold" style={{ fontSize: "17px" }}>
                                <img src={addButtonIcon} alt="Add Icon" className="w-5 h-5 mt-1 mr-2" />
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
