// UserSelect.js

import React from "react";
import Select from "react-select";

const UserSelect = ({ options, selectedOptions, handleSelectChange, placeholder, isMulti }) => {
  return (
    <Select
      className="add-member-input"
      options={options}
      isMulti={isMulti}
      placeholder={placeholder}
      value={selectedOptions}
      onChange={handleSelectChange}
      closeMenuOnSelect={false}
      isSearchable
      required
    />
  );
};

export default UserSelect;
