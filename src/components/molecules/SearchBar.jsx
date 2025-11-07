import React, { useEffect, useRef, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  suggestions = [], 
  onSuggestionClick,
  value,
  onChange,
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(value || "");
  const searchRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) {
      setSearchValue(value);
    }
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    setIsOpen(newValue.length > 0 && suggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion.name || suggestion);
    setIsOpen(false);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          onFocus={() => setIsOpen(searchValue.length > 0 && suggestions.length > 0)}
          className="pr-12"
        />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
        >
          <ApperIcon name="Search" className="w-4 h-4" />
        </Button>
      </form>

{isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex items-center justify-between p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {suggestion?.name_c || suggestion?.Name || suggestion?.name || suggestion}
                </p>
                {(suggestion?.city_c || suggestion?.city) && (
                  <p className="text-sm text-gray-500">
                    {suggestion?.city_c || suggestion?.city} - {suggestion?.code_c || suggestion?.code}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;