import { Navigate } from "react-router-dom";

export default function ExplorePage() {
  //check if user lis logged in
  if (localStorage.getItem("userIsLoggedIn") == "false") {
    return <Navigate to="/login" />;
  }

  return <div>ExplorePage</div>;
}
