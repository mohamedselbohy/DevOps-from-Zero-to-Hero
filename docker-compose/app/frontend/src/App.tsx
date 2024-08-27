import AuthDialog from "@/components/auth-dialog";
import axios from "@/lib/axios";
import { useState } from "react";

function App() {
  const user = localStorage.getItem("user");
  const userObj = user ? JSON.parse(user) : null;
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // fetch users
  const getUsers = () => axios.get("/users").then((res) => {
    setUsers(res.data);
  }
  ).catch((err) => {
    setError(err.message);
    setUsers([]);
  });

  return (
    <div className="flex flex-col justify-center min-h-screen">
      <AuthDialog />
      <div className="grid">
        <h1 className="text-4xl font-bold text-center">Welcome to the App</h1>
        <h2 className="text-2xl font-semibold text-center">
          User: {userObj?.fullName}
        </h2>
        <h2 className="text-2xl font-semibold text-center">
          email: {userObj?.email}
        </h2>
      </div>

      <button
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded w-fit hover:bg-blue-700"
        onClick={getUsers}
      >
        Get Users
      </button>

      {/* display list of users in table*/}
      {error && <div className="text-red-500">{error}</div>}
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Full Name</th>
            <th className="px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-4 py-2 border">{user.fullName}</td>
              <td className="px-4 py-2 border">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
