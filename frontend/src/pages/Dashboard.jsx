import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2>Welcome {user?.username}</h2>
      <p>Your role: {user?.role}</p>
    </div>
  );
}
