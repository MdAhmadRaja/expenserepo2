import type { Group, User } from './types';

export const MOCK_GROUP_KEY = 'TRIP-2024';

const ALL_USERS: User[] = [
  { id: 'user1', name: 'Alice', avatarUrl: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'user2', name: 'Bob', avatarUrl: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'user3', name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/user3/100/100' },
  { id: 'user4', name: 'Diana', avatarUrl: 'https://picsum.photos/seed/user4/100/100' },
];

export { ALL_USERS };

// For simulation purposes, we'll assume the current user is Alice
export const CURRENT_USER_ID = 'user1';

export const MOCK_GROUP: Group = {
  id: MOCK_GROUP_KEY,
  name: 'Mountain Cabin Trip',
  members: ALL_USERS,
  expenses: [
    {
      id: 'exp1',
      description: 'Cabin Rental',
      amount: 1200,
      paidById: 'user1',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'approved',
      approvals: ['user1', 'user2', 'user3', 'user4'],
      deletionApprovals: [],
    },
    {
      id: 'exp2',
      description: 'Groceries',
      amount: 250,
      paidById: 'user2',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'approved',
      approvals: ['user1', 'user2', 'user3', 'user4'],
      deletionApprovals: [],
    },
    {
      id: 'exp3',
      description: 'Firewood',
      amount: 60,
      paidById: 'user3',
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      approvals: ['user3', 'user1'],
      deletionApprovals: [],
    },
    {
        id: 'exp4',
        description: 'Ski Passes',
        amount: 480,
        paidById: 'user4',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        approvals: ['user4'],
        deletionApprovals: [],
    },
    {
        id: 'exp5',
        description: 'Dinner at the lodge',
        amount: 180,
        paidById: 'user1',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'deletion-requested',
        approvals: ['user1', 'user2', 'user3', 'user4'], // Was approved before deletion request
        deletionApprovals: ['user1', 'user2'],
    }
  ],
  activityLog: [
    {
      id: 'act5',
      text: 'requested to delete "Dinner at the lodge"',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      user: ALL_USERS.find(u => u.id === 'user1')!,
    },
    {
      id: 'act4',
      text: 'added expense "Dinner at the lodge" for $180.00',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      user: ALL_USERS.find(u => u.id === 'user1')!,
    },
    {
      id: 'act3',
      text: 'added expense "Firewood" for $60.00',
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      user: ALL_USERS.find(u => u.id === 'user3')!,
    },
    {
      id: 'act2',
      text: 'added expense "Groceries" for $250.00',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      user: ALL_USERS.find(u => u.id === 'user2')!,
    },
    {
      id: 'act1',
      text: 'created the group "Mountain Cabin Trip"',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      user: ALL_USERS.find(u => u.id === 'user1')!,
    },
  ],
};
