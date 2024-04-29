import React from 'react';

const FilterSortEmployeeButtons = ({ handleSortEmployee }) => {
  return (
    <div>
      <button onClick={() => handleSortEmployee('name')}>Sort by Name</button>
      <button onClick={() => handleSortEmployee('title')}>Sort by Title</button>
    </div>
  );
};

export default FilterSortEmployeeButtons;
