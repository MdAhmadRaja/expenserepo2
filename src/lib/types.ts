export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  status?: 'pending' | 'active';
  approvals?: string[]; // user IDs who approved this member
};

export type ExpenseStatus = 'pending' | 'approved' | 'deletion-requested';

export type Expense = {
  id: string;
  description: string;
  amount: number;
  paidById: string;
  timestamp: string;
  status: ExpenseStatus;
  approvals: string[]; // array of user IDs who approved
  deletionApprovals: string[]; // array of user IDs who approved deletion
  splitWith: string[]; // array of user IDs to split with
};

export type Activity = {
  id: string;
  text: string;
  timestamp: string;
  user: User;
};

export type Group = {
  id: string; // the unique key
  name: string;
  members: User[];
  expenses: Expense[];
  activityLog: Activity[];
};

export type Balance = {
  userId: string;
  amount: number;
};

export type LocalStorageGroups = {
  [key: string]: Group;
}
