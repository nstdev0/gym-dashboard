import { useAuth } from "@/hooks/auth";

export default function DashboardPage() {
  const user = useAuth();

  console.log(user);

  return (
    <div>
      {!user ? (
        <div>Not authorized</div>
      ) : (
        <div>Dashboard Page - Authorized</div>
      )}
    </div>
  );
}
