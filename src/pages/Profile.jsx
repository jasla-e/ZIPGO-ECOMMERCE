import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
  });

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    house: "",
    city: "",
    state: "",
    pincode: "",
  });

  // FETCH USER//
  useEffect(() => {
    fetchUser();
  }, []);
   const fetchUser = async () => {
      console.log("FETCH USER CALLED");
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      return;
    }

    const res = await axios.get(
      "https://localhost:7150/api/User/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("PROFILE RESPONSE:", res.data);

    const userData = {
      ...res.data,
      addresses: res.data.addresses || [],
    };

    setUser(userData);

    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      gender: userData.gender || "",
      dob: userData.dob || "",
    });
  } catch (error) {
    console.log("PROFILE ERROR:", error);
  }
};
 
  // UPDATE PROFILE//
  const handleSaveProfile = async () => {
    try {
      const token=localStorage.getItem("token");

      if(!token){
        console.log("No token Found");
        return;
      }

        const updatedUser = {
      ...user,
      ...formData,
      addresses: user.addresses || [],
    };


      await axios.put(
        `https://localhost:7150/api/User/profile`,
        updatedUser,
        {
          headers:{
            Authorization:`Bearer ${token}`,
          },
        }
      );

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setEditing(false);

      alert("Profile Updated Successfully");

    } catch (error) {
      console.log(error);
    }
  };

  // ADD ADDRESS
  const handleAddAddress = async () => {
    if (
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.house ||
      !newAddress.city ||
      !newAddress.pincode
    ) {
      alert("Please fill required fields");
      return;
    }

    try {
      const updatedUser = {
        ...user,
        addresses: [
          ...(user.addresses || []),
          {
            id: Date.now(),
            ...newAddress,
          },
        ],
      };

      await axios.put(
        `http://localhost:4000/users/${user.id}`,
        updatedUser
      );

      setUser(updatedUser);

      setNewAddress({
        fullName: "",
        phone: "",
        house: "",
        city: "",
        state: "",
        pincode: "",
      });

      alert("Address Added Successfully");

    } catch (error) {
      console.log(error);
    }
  };

  // DELETE ADDRESS
  const handleDeleteAddress = async (id) => {
    try {
      const updatedAddresses = user.addresses.filter(
        (item) => item.id !== id
      );

      const updatedUser = {
        ...user,
        addresses: updatedAddresses,
      };

      await axios.put(
        `http://localhost:4000/users/${user.id}`,
        updatedUser
      );

      setUser(updatedUser);

    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <h1 className="text-2xl font-bold">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4 md:px-8 lg:px-12 pb-10">

      {/* HERO SECTION */}
      <div className="bg-white border border-gray-200 rounded-[30px] p-6 md:p-10 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center gap-8">

          {/* AVATAR */}
          <div className="w-28 h-28 rounded-full bg-black text-white flex items-center justify-center text-5xl font-black shadow-md">
            {user?.name?.[0] || "U"}
          </div>

          {/* USER INFO */}
          <div className="flex-1">

            <h1 className="text-3xl md:text-5xl font-black uppercase text-black">
              {user.name}
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              {user.email}
            </p>

            <div className="flex flex-wrap gap-3 mt-5">

              <div className="bg-gray-100 px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-500 uppercase">
                  Phone
                </p>

                <h3 className="font-semibold text-black">
                  {user.phone || "Not Added"}
                </h3>
              </div>

              <div className="bg-gray-100 px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-500 uppercase">
                  Gender
                </p>

                <h3 className="font-semibold text-black">
                  {user.gender || "Not Added"}
                </h3>
              </div>

              <div className="bg-gray-100 px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-500 uppercase">
                  DOB
                </p>

                <h3 className="font-semibold text-black">
                  {user.dob || "Not Added"}
                </h3>
              </div>

            </div>
          </div>

          {/* EDIT BUTTON */}
          <button
            onClick={() => setEditing(!editing)}
            className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-xl font-semibold transition"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">

        {/* LEFT SIDE */}
        <div className="bg-white border border-gray-200 rounded-[30px] p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-black mb-6">
            Personal Information
          </h2>

          <div className="space-y-5">

            {/* NAME */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Full Name
              </p>

              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none"
                />
              ) : (
                <h3 className="font-semibold text-lg text-black">
                  {user.name}
                </h3>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Email
              </p>

              {editing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none"
                />
              ) : (
                <h3 className="font-semibold text-lg text-black break-all">
                  {user.email}
                </h3>
              )}
            </div>

            {/* PHONE */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Phone
              </p>

              {editing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none"
                />
              ) : (
                <h3 className="font-semibold text-lg text-black">
                  {user.phone || "Not Added"}
                </h3>
              )}
            </div>

            {/* GENDER */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Gender
              </p>

              {editing ? (
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none"
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              ) : (
                <h3 className="font-semibold text-lg text-black">
                  {user.gender || "Not Added"}
                </h3>
              )}
            </div>

            {/* DOB */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Date of Birth
              </p>

              {editing ? (
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dob: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none"
                />
              ) : (
                <h3 className="font-semibold text-lg text-black">
                  {user.dob || "Not Added"}
                </h3>
              )}
            </div>

            {/* SAVE BUTTON */}
            {editing && (
              <button
                onClick={handleSaveProfile}
                className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-xl font-semibold transition mt-4"
              >
                Save Changes
              </button>
            )}

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-[30px] p-6 shadow-sm">

          <div className="flex items-center justify-between mb-8">

            <h2 className="text-3xl font-bold text-black">
              Saved Addresses
            </h2>

          </div>

          {/* ADDRESS LIST */}
          <div className="grid md:grid-cols-2 gap-5 mb-8">

            {user.addresses?.length > 0 ? (
              user.addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-5"
                >

                  <h3 className="font-bold text-lg text-black">
                    {address.fullName}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    {address.house}
                  </p>

                  <p className="text-gray-500">
                    {address.city}, {address.state}
                  </p>

                  <p className="text-gray-500">
                    {address.pincode}
                  </p>

                  <p className="text-gray-500 mt-1">
                    {address.phone}
                  </p>

                  <button
                    onClick={() =>
                      handleDeleteAddress(address.id)
                    }
                    className="mt-5 bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-xl text-sm transition"
                  >
                    Delete
                  </button>

                </div>
              ))
            ) : (
              <div className="text-gray-500">
                No addresses added yet.
              </div>
            )}

          </div>

          {/* ADD ADDRESS */}
          <div className="border-t border-gray-200 pt-8">

            <h3 className="text-2xl font-bold text-black mb-5">
              Add New Address
            </h3>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Full Name"
                value={newAddress.fullName}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    fullName: e.target.value,
                  })
                }
                className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />

              <input
                type="text"
                placeholder="Phone"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    phone: e.target.value,
                  })
                }
                className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />

              <input
                type="text"
                placeholder="House / Area"
                value={newAddress.house}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    house: e.target.value,
                  })
                }
                className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />

              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    city: e.target.value,
                  })
                }
                className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />

              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    state: e.target.value,
                  })
                }
                className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />

              <input
                type="text"
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    pincode: e.target.value,
                  })
                }
                className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />

            </div>

            <button
              onClick={handleAddAddress}
              className="mt-6 bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-xl font-semibold transition"
            >
              Add Address
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;