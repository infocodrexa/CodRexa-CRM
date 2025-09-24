import React, { useContext, useEffect, useState } from "react";
import API from "../utils/api.js";
import { AuthContext } from "../context/AuthContext";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;
    API.get(`/auth/${user._id}/tree`)
      .then((res) => {
        // if res is an object with tree - adapt as backend returns
        setUsers(res.data || []);
      })
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div>
      <h3>Users / Team</h3>
      <table className="table table-striped mt-3">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <div className="text-muted mt-2">No users found</div>}
    </div>
  );
}
