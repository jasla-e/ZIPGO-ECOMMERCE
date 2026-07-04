import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchUsersAsync,
  toggleUserBlockAsync,
} from "../../redux/slices/usersSlice";

function AUsers() {
  const dispatch = useDispatch();

  const { users, loading } = useSelector((state) => state.users);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, [dispatch]);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        User Management
      </h1>

      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full md:w-80"
        />
      </div>

     
      {loading ? (
        <h2 className="text-lg font-medium">
          Loading Users...
        </h2>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-400">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">Gender</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-center px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t"
                >
                  <td className="px-4 py-3">
                    {user.name}
                  </td>

                  <td className="px-4 py-3">
                    {user.email}
                  </td>

                  <td className="px-4 py-3">
                    {user.phone || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {user.gender || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {user.isBlocked ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                        Blocked
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {user.role === "admin" ? (
                      <span className="text-gray-500 font-medium">
                        Admin
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          dispatch(toggleUserBlockAsync(user))
                        }
                        className={`px-4 py-2 rounded text-white text-sm ${
                          user.isBlocked
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {user.isBlocked
                          ? "Unblock"
                          : "Block"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AUsers;