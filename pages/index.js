import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FilterSortEmployeeButtons from '../components/FilterSortEmployeeButtons'; 
import FilterSortProjectButtons from '../components/FilterSortProjectButtons'; 

export default function EntityTable() {
  const [employeeData, setEmployeeData] = useState(null);
  const [departmentData, setDepartmentData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadAttempts, setReloadAttempts] = useState(0);

  useEffect(() => {
    fetchData('employee');
    fetchData('department');
    fetchData('project');
  }, []);

  // Add useEffect to handle changes in data and sorting/filtering options
  useEffect(() => {
    if (employeeData && departmentData && projectData) {
      setLoading(false);
    }
  }, [employeeData, departmentData, projectData]);

  const fetchData = async (entityType, filterQuery) => {
    try {
      let endpoint;
      switch (entityType) {
        case 'employee':
          endpoint = '/api/employee';
          break;
        case 'department':
          endpoint = '/api/department';
          break;
        case 'project':
          endpoint = '/api/project';
          break;
        default:
          throw new Error('Invalid entity type');
      }
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      if (entityType === 'employee') {
        setEmployeeData(result);
      } else if (entityType === 'department') {
        setDepartmentData(result);
      } else if (entityType === 'project') {
        setProjectData(result);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSortEmployee = async (sortBy) => {
  try {
    const response = await fetch(`/api/employee?sortBy=${sortBy}`);
    if (!response.ok) {
      throw new Error('Failed to fetch sorted data');
    }
    const sortedData = await response.json();
    setEmployeeData(sortedData);
  } catch (error) {
    setError(error.message);
  }
};

const handleSortProject = async (sortBy) => {
  try {
    const response = await fetch(`/api/project?sortBy=${sortBy}`);
    if (!response.ok) {
      throw new Error('Failed to fetch sorted data');
    }
    const sortedData = await response.json();
    setProjectData(sortedData);
  } catch (error) {
    setError(error.message);
  }
};



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    if (reloadAttempts < 5) {
      setTimeout(() => {
        window.location.reload();
        setReloadAttempts(reloadAttempts + 1);
      }, 1000);
      return <div>Error: Reloading page... Retry attempt {reloadAttempts + 1}</div>;
    } else {
      return <div>Error: Unable to load data after multiple attempts.</div>;
    }
  }

  const departmentIndex = {};
  departmentData.forEach(department => {
    departmentIndex[department.id] = department;
  });

  const projectIndex = {};
  projectData.forEach(project => {
    projectIndex[project.sponsor] = project;
  });

  const employeeIndex = {};
  employeeData.forEach(employee => {
    employeeIndex[employee.id] = employee;
  });

  return (
    <div>
      <Layout />
      <h1>Report</h1>
      <FilterSortEmployeeButtons handleSortEmployee={handleSortEmployee}/> {}
      <FilterSortProjectButtons handleSortProject={handleSortProject}  /> {}
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Employee Title</th>
            <th>Employee's Home Department ID</th>
            <th>Department Name</th>
            <th>Department Manager ID</th>
            <th>Department Manager Name</th>
            <th>Project ID Where Employee's Department Is The Sponsor</th>
            <th>Project Name</th>
            <th>Project Start Date</th>
            <th>Project End Date</th>
            <th>Project Budget</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.title}</td>
              <td>{employee.home_dept}</td>
              {/* Find department details for the employee */}
              {departmentIndex[employee.home_dept] && (
                <>
                  <td>{departmentIndex[employee.home_dept].name}</td>
                  <td>{departmentIndex[employee.home_dept].manager}</td>
                  {/* Find manager's name */}
                  <td>{employeeIndex[departmentIndex[employee.home_dept].manager].name}</td>
                  {/* Find project details for the department */}
                  {projectIndex[employee.home_dept] && (
                    <>
                      <td>{projectIndex[employee.home_dept].id}</td>
                      <td>{projectIndex[employee.home_dept].name}</td>
                      <td>{projectIndex[employee.home_dept].startDate}</td>
                      <td>{projectIndex[employee.home_dept].endDate}</td>
                      <td>{projectIndex[employee.home_dept].budget}</td>
                    </>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
