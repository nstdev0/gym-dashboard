import ProfileForm from "./components/profile-form";
import { useAuth } from "@/context/AuthContext";
import { ProfileFormSkeleton } from "./components/profile-form-skeleton";
import PageHeader from "@/components/ui/PageHeader";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <ProfileFormSkeleton />;
  return (
    <div className="flex flex-col h-full space-y-4 ">
      <PageHeader title="Mi Perfil" description="Información personal" />
      <ProfileForm user={user!} />
    </div>
  );
}
