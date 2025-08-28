'use client';

import { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { MOCK_GROUP, MOCK_GROUP_KEY, CURRENT_USER_ID } from '@/lib/mock-data';
import type { Expense, Group } from '@/lib/types';
import GroupHeader from '@/components/group/GroupHeader';
import BalanceSummary from '@/components/group/BalanceSummary';
import ExpenseList from '@/components/group/ExpenseList';
import ActivityLog from '@/components/group/ActivityLog';
import AddExpenseDialog from '@/components/group/AddExpenseDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function GroupPage({ params }: { params: { key: string } }) {
  const { toast } = useToast();
  
  // In a real app, you would fetch group data based on params.key
  if (params.key !== MOCK_GROUP_KEY) {
    notFound();
  }

  const [group, setGroup] = useState<Group>(MOCK_GROUP);

  const approvedExpenses = useMemo(() => 
    group.expenses.filter((e) => e.status === 'approved'), 
    [group.expenses]
  );
  
  const handleAddExpense = (newExpense: Omit<Expense, 'id' | 'timestamp' | 'status' | 'approvals' | 'deletionApprovals'>) => {
    const expense: Expense = {
      ...newExpense,
      id: `exp${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      approvals: [newExpense.paidById],
      deletionApprovals: [],
    };
  
    const payer = group.members.find(m => m.id === newExpense.paidById);
    
    setGroup(prevGroup => ({
      ...prevGroup,
      expenses: [expense, ...prevGroup.expenses],
      activityLog: [
        {
          id: `act${Date.now()}`,
          text: `added expense "${expense.description}" for $${expense.amount.toFixed(2)}`,
          timestamp: new Date().toISOString(),
          user: payer!,
        },
        ...prevGroup.activityLog
      ]
    }));

    toast({ title: 'Expense Added', description: 'Your expense is now pending approval from group members.' });
  };
  
  const handleApproval = (expenseId: string, type: 'expense' | 'deletion') => {
    setGroup(prevGroup => {
      const newExpenses = [...prevGroup.expenses];
      const expenseIndex = newExpenses.findIndex(e => e.id === expenseId);
      if (expenseIndex === -1) return prevGroup;
      
      const expense = { ...newExpenses[expenseIndex] };
      const approver = prevGroup.members.find(m => m.id === CURRENT_USER_ID)!;
      let newActivityLog = [...prevGroup.activityLog];

      if (type === 'expense') {
        expense.approvals = [...expense.approvals, CURRENT_USER_ID];
        if (expense.approvals.length === prevGroup.members.length) {
          expense.status = 'approved';
          newActivityLog = [
            { id: `act${Date.now()}`, text: `fully approved expense "${expense.description}"`, timestamp: new Date().toISOString(), user: approver },
            ...newActivityLog
          ];
          toast({ title: 'Expense Approved!', description: `"${expense.description}" is now included in balances.`, className: 'bg-accent text-accent-foreground' });
        } else {
           newActivityLog = [
            { id: `act${Date.now()}`, text: `approved expense "${expense.description}"`, timestamp: new Date().toISOString(), user: approver },
            ...newActivityLog
          ];
        }
      } else { // type === 'deletion'
        expense.deletionApprovals = [...expense.deletionApprovals, CURRENT_USER_ID];
        if (expense.deletionApprovals.length === prevGroup.members.length) {
          newExpenses.splice(expenseIndex, 1);
          newActivityLog = [
            { id: `act${Date.now()}`, text: `deleted expense "${expense.description}"`, timestamp: new Date().toISOString(), user: approver },
            ...newActivityLog
          ];
          toast({ title: 'Expense Deleted!', description: `"${expense.description}" has been removed.`, className: 'bg-destructive text-destructive-foreground'});
        } else {
          expense.status = 'deletion-requested';
           newActivityLog = [
            { id: `act${Date.now()}`, text: `approved deletion for "${expense.description}"`, timestamp: new Date().toISOString(), user: approver },
            ...newActivityLog
          ];
        }
      }

      if (type !== 'deletion' || expense.deletionApprovals.length < prevGroup.members.length) {
        newExpenses[expenseIndex] = expense;
      }
      
      return { ...prevGroup, expenses: newExpenses, activityLog: newActivityLog };
    });
  };

  const handleDeleteRequest = (expenseId: string) => {
    setGroup(prevGroup => {
      const newExpenses = prevGroup.expenses.map(e => {
        if (e.id === expenseId) {
          return {
            ...e,
            status: 'deletion-requested' as const,
            deletionApprovals: [CURRENT_USER_ID]
          }
        }
        return e;
      });
      const expense = newExpenses.find(e => e.id === expenseId)!;
      const requester = prevGroup.members.find(m => m.id === CURRENT_USER_ID)!;

      return {
        ...prevGroup,
        expenses: newExpenses,
        activityLog: [
          {
            id: `act${Date.now()}`,
            text: `requested to delete "${expense.description}"`,
            timestamp: new Date().toISOString(),
            user: requester,
          },
          ...prevGroup.activityLog
        ]
      }
    });
    toast({ title: 'Deletion Requested', description: 'Other members must approve the deletion.' });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <GroupHeader group={group} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          <main className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline text-3xl font-bold tracking-tight">Expenses</h2>
              <AddExpenseDialog members={group.members} onAddExpense={handleAddExpense}>
                <Button>
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Add Expense
                </Button>
              </AddExpenseDialog>
            </div>
            <ExpenseList 
              expenses={group.expenses} 
              members={group.members} 
              currentUserId={CURRENT_USER_ID}
              onApproval={handleApproval}
              onDeleteRequest={handleDeleteRequest}
            />
          </main>

          <aside className="mt-8 lg:mt-0 lg:col-span-1 space-y-8">
            <BalanceSummary expenses={approvedExpenses} members={group.members} />
            <ActivityLog activities={group.activityLog} members={group.members} />
          </aside>
        </div>
      </div>
    </div>
  );
}
