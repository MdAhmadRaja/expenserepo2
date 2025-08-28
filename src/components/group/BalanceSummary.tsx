'use client';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { Expense, User, Balance } from '@/lib/types';
import { Scale } from 'lucide-react';

type BalanceSummaryProps = {
  expenses: Expense[];
  members: User[];
};

export default function BalanceSummary({ expenses, members }: BalanceSummaryProps) {
  const balances = useMemo(() => {
    const memberBalances: Record<string, number> = {};
    members.forEach((member) => (memberBalances[member.id] = 0));

    if (members.length > 0) {
      expenses.forEach((expense) => {
        const membersInvolved = expense.splitWith || members.map(m => m.id);
        const splitCount = membersInvolved.length;

        if (splitCount > 0) {
          const share = expense.amount / splitCount;
          // The payer gets credited the full amount
          memberBalances[expense.paidById] += expense.amount;
          // Only debit the members involved in the split
          membersInvolved.forEach((memberId) => {
            memberBalances[memberId] -= share;
          });
        }
      });
    }

    return members
      .map((member) => ({
        userId: member.id,
        amount: memberBalances[member.id],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, members]);

  const totalSpent = useMemo(() => expenses.reduce((acc, exp) => acc + exp.amount, 0), [expenses]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center gap-4 space-y-0">
          <Scale className="w-6 h-6 text-muted-foreground" />
          <CardTitle className="font-headline text-2xl">Balance Summary</CardTitle>
        </div>
        <CardDescription>
          Based on all fully approved expenses. Total spent: <span className='font-bold text-foreground'>${totalSpent.toFixed(2)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {balances.map((balance, index) => {
            const member = members.find((m) => m.id === balance.userId);
            if (!member) return null;

            const isOwed = balance.amount > 0;
            const isSettled = Math.abs(balance.amount) < 0.01;

            return (
              <div key={member.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{member.name}</span>
                  </div>
                  <div
                    className={`font-semibold text-right ${
                      isSettled ? 'text-muted-foreground' : isOwed ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isSettled ? 'Settled up' : `${isOwed ? 'Is owed' : 'Owes'} $${Math.abs(balance.amount).toFixed(2)}`}
                  </div>
                </div>
                {index < balances.length - 1 && <Separator className="mt-4" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
