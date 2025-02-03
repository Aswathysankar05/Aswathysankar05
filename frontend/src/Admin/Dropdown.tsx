import React, { useState } from 'react';

interface DropdownProps {
  options: string[];
  onSelect: (option: string) => void;
  selectedLabel?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, selectedLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={toggleDropdown} className='profile-button'>
        {selectedOption || selectedLabel || 'Profile'}
      </button>
      {isOpen && (
        <ul className='dropdown-menu-data'>
          {options.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
