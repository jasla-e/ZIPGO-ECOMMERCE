
const API_URL = "https://localhost:7150/api/Auth";


// REGISTER USER
export const registerUser = async (user) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      password: user.password,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Registration failed");
  }

  return await response.text();
};

const decodeToken = (token) => {
  const payload = token.split(".")[1];

  const decodedPayload = atob(
    payload.replace(/-/g, "+").replace(/_/g, "/")
  );

  return JSON.parse(decodedPayload);
};

// LOGIN USER
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Invalid credentials");
  }

  const token = await response.text();

localStorage.setItem("token", token);

const user = decodeToken(token);

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