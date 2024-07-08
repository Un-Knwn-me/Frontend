import React from 'react';

interface CustomInputProps {
    type: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    name?: string;
    placeHolder?: string;
    icon?: string;
    required?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ type, value, onChange, name, placeHolder, icon, required = false }) => {
    return (
        <div className="relative z-0 w-full mb-5">
            <input
                type={type}
                name={name}
                placeholder={placeHolder}
                value={value}
                onChange={onChange}
                className="pt-3 pb-2 pl-14 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                required={required}
            />
            {icon && <img src={icon} alt="Icon" className="absolute left-3 bottom-3 h-6 w-6 text-gray-400" />}
        </div>
    );
}

export default CustomInput;
