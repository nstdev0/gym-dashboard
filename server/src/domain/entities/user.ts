export const Role = {
  OWNER: "owner",
  ADMIN: "admin",
  STAFF: "staff",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export type User = {
  id: string;

  role: Role;

  firstName: string;
  lastName: string;
  username: string | null;
  email: string;
  password: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
};
