import ProfileForm from "./components/profile-form";
import { useAuth } from "@/context/AuthContext";
import { ProfileFormSkeleton } from "./components/profile-form-skeleton";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
      </div>
      <div className="space-y-4">
        {isLoading || !user ? (
          <ProfileFormSkeleton />
        ) : (
          <ProfileForm user={user} />
        )}
      </div>
    </div>
  );
}
