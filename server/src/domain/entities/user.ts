export const Role = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
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
