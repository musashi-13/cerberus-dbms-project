"use client";
import { useState } from "react";
import ky from "ky";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [serviceCenter, setServiceCenter] = useState(null);
  const [employees, setEmployees] = useState<any[]>([]);

  const login = () => {
    if (password === "hardcoded_admin_password") {
      setAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  const fetchData = async () => {
    try {
      const scResponse: { serviceCenter: any } = await ky.get("/api/admin/service-center").json();
      const empResponse: { employees: any[] } = await ky.get("/api/admin/employees").json();
      setServiceCenter(scResponse.serviceCenter);
      setEmployees(empResponse.employees);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateServiceCenter = async (data) => {
    try {
      await ky.put("/api/admin/update-center", { json: data });
      alert("Service Center updated!");
    } catch (error) {
      console.error("Error updating Service Center:", error);
    }
  };

  const handleEmployeeAction = async (action, data) => {
    const endpoint =
      action === "add"
        ? "/api/admin/add-employee"
        : action === "update"
        ? "/api/admin/update-employee"
        : "/api/admin/delete-employee";
    try {
      await ky.post(endpoint, { json: data });
      alert(`Employee ${action}d successfully!`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error(`Error ${action}ing employee:`, error);
    }
  };

  return authenticated ? (
    <div>
      <h1>Admin Panel</h1>
      <button onClick={fetchData}>Fetch Data</button>

      <h2>Service Center</h2>
      <div>
        <input
          value={serviceCenter?.name || ""}
          onChange={(e) => setServiceCenter({ ...serviceCenter, name: e.target.value })}
        />
        <button onClick={() => updateServiceCenter(serviceCenter)}>Update</button>
      </div>

      <h2>Employees</h2>
      <ul>
        {employees.map((emp) => (
          <li key={emp.employee_id}>
            {emp.name} - {emp.role}
            <button onClick={() => handleEmployeeAction("delete", { id: emp.employee_id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => handleEmployeeAction("add", { /* new employee data */ })}>
        Add Employee
      </button>
    </div>
  ) : (
    <div>
      <h1>Admin Login</h1>
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
}
