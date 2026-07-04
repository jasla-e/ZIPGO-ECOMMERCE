const USER_KEY = "auth_user";

export const setUser = (user) => {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
};

export const getUser = () => {
  return JSON.parse(
    localStorage.getItem(USER_KEY)
  );
};

export const logoutUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const isLoggedIn = () => {
  return !!localStorage.getItem(USER_KEY);
};