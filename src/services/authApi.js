const API_URL = "http://localhost:4000/users";

// REGISTER USER
export const registerUser = async (user) => {
  // GET EXISTING USERS
  const res = await fetch(
    `${API_URL}?email=${user.email}`
  );

  const existingUsers = await res.json();

  // CHECK EMAIL EXISTS
  if (existingUsers.length > 0) {
    throw new Error("User already exists");
  }

  // SAVE NEW USER
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
    ...user,
    isBlocked: false,
   }),
  });

  return await response.json();
};

// LOGIN USER
export const loginUser = async (
  email,
  password
) => {
  const res = await fetch(
    "http://localhost:4000/users"
  );

  const users = await res.json();

  // FIND MATCHING USER
  const user = users.find(
    (u) =>
      u.email.trim().toLowerCase() ===
        email.trim().toLowerCase() &&
      u.password.trim() ===
        password.trim()
  );

  // INVALID LOGIN
  if (!user) {
    throw new Error("Invalid credentials");
  }
 
  if (user.isBlocked) {
  throw new Error(
    "Your account has been blocked by admin"
  );
   }
  // SAVE CURRENT USER
  localStorage.setItem(
    "current_user",
    JSON.stringify(user)
  );

  return user;
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("current_user");
};

// GET CURRENT USER
export const getCurrentUser = () => {
  return JSON.parse(
    localStorage.getItem("current_user")
  );
};

// CHECK AUTH
export const isAuthenticated = () => {
  return !!getCurrentUser();
};