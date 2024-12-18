// Autocomplete.js
import React, { useState } from 'react';

export const Autocomplete = ({ searchInput, setSearchInput, handleSearch, suggestions, setSuggestions, highlightAmphoe }) => {
    const [activeIndex, setActiveIndex] = useState(-1);

    const handleKeyDown = (e) => {
        if (suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => prev > 0 ? prev - 1 : prev);
                break;
            case 'Enter':
                if (activeIndex >= 0) {
                    const selectedFeature = suggestions[activeIndex];
                    setSearchInput(selectedFeature.properties.AMP_NAME_T);
                    setSuggestions([]);
                    highlightAmphoe(selectedFeature.properties.AMP_NAME_T);
                    setActiveIndex(-1);
                }
                break;
            case 'Escape':
                setSuggestions([]);
                setActiveIndex(-1);
                break;
            default:
                break;
        }
    };

    const clearSelection = () => {
        setSearchInput('');
        setSuggestions([]);
        setActiveIndex(-1);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                    setSearchInput(e.target.value);
                    handleSearch(e.target.value);
                    setActiveIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                className="w-full p-2 border rounded"
                placeholder="ค้นหาตามขอบเขต แขวง/อำเภอ..."
            />
            {searchInput && (
                <button
                    onClick={clearSelection}
                    className="absolute right-2 top-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    X
                </button>
            )}
            {suggestions.length > 0 && (
                <ul className="absolute w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((feature, index) => (
                        <li
                            key={feature.properties.AMP_NAME_T}
                            className={`p-2 hover:bg-gray-100 cursor-pointer ${
                                index === activeIndex ? 'bg-gray-200' : ''
                            }`}
                            onClick={() => {
                                highlightAmphoe(feature.properties.AMP_NAME_T);
                                setSearchInput(feature.properties.AMP_NAME_T);
                                setSuggestions([]);
                                setActiveIndex(-1);
                            }}
                        >
                            {feature.properties.AMP_NAME_T}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};