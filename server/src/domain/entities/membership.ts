export const MembershipStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  EXPIRED: "EXPIRED",
  PAUSED: "PAUSED",
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
