import React from 'react';

const FilterSortProjectButtons = ({ handleSortProject }) => {
  return (
    <div>
      <button onClick={() => handleSortProject('startDate')}>Sort by Start Date</button>
      <button onClick={() => handleSortProject('endDate')}>Sort by End Date</button>
      <button onClick={() => handleSortProject('budget')}>Sort by Budget</button>
    </div>
  );
};

export default FilterSortProjectButtons;
