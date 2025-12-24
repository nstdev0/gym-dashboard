import { config } from "@/config/config";
import type { Member } from "@/entities/member";

export const useGetMembers = ({ request }): Promise<Member[]> => {
  const url = new URL("/members", config.BASE_API_URL);
};
