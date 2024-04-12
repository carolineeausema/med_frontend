import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

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

  const fetchData = async (entityType) => {
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
    } finally {
      setLoading(false);
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

  return (
    <div>
      <Layout />
      <h1>Report</h1>
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
          {employeeData && employeeData.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.title}</td>
              <td>{employee.home_dept}</td>
              {/* Find department details for the employee */}
              {departmentData && departmentData.find(department => department.id === employee.home_dept) && (
                <>
                  <td>{departmentData.find(department => department.id === employee.home_dept).name}</td>
                  <td>{departmentData.find(department => department.id === employee.home_dept).manager}</td>
                  {/* Find project details for the department */}
                  {projectData && projectData.find(project => project.sponsor === employee.home_dept) && (
                    <>
                      <td>{projectData.find(project => project.sponsor === employee.home_dept).id}</td>
                      <td>{projectData.find(project => project.sponsor === employee.home_dept).name}</td>
                      <td>{projectData.find(project => project.sponsor === employee.home_dept).start_date}</td>
                      <td>{projectData.find(project => project.sponsor === employee.home_dept).end_date}</td>
                      <td>{projectData.find(project => project.sponsor === employee.home_dept).budget}</td>
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
