export const MembershipStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  EXPIRED: "expired",
  PAUSED: "paused",
} as const;
export type MembershipStatus =
  (typeof MembershipStatus)[keyof typeof MembershipStatus];

export type Membership = {
  id: string;

  memberId: string;
  planId: string;

  startDate: Date;
  endDate: Date;

  status: MembershipStatus;

  createdAt: Date;
  updatedAt: Date;
};
