import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div>
      <div>
        <h1>Unauthorized</h1>
        <p>
          You do not have permission to view this page, please login or sign up.
        </p>
      </div>
      <div>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}
