// import { User } from "../types/user";

export const fetchUsers = async () => {
  const response = await fetch("https://api.example.com/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};
