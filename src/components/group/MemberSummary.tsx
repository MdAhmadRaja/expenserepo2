'use client';

import { useMemo } from 'react';
import type { Expense, User } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type MemberSummaryProps = {
  expenses: Expense[];
  members: User[];
};

type MemberStats = {
  totalPaid: number;
  totalShare: number;
  balance: number;
};

export default function MemberSummary({ expenses, members }: MemberSummaryProps) {
  const memberStats = useMemo(() => {
    const stats: Record<string, MemberStats> = {};

    members.forEach((member) => {
      stats[member.id] = { totalPaid: 0, totalShare: 0, balance: 0 };
    });

    expenses.forEach((expense) => {
      // Add to total paid for the payer
      if (stats[expense.paidById]) {
        stats[expense.paidById].totalPaid += expense.amount;
      }

      // Add to total share for each member involved
      const membersInvolved = expense.splitWith || members.map(m => m.id);
      const share = expense.amount / membersInvolved.length;
      membersInvolved.forEach((memberId) => {
        if (stats[memberId]) {
          stats[memberId].totalShare += share;
        }
      });
    });

    // Calculate final balance
    members.forEach((member) => {
      if (stats[member.id]) {
        stats[member.id].balance = stats[member.id].totalPaid - stats[member.id].totalShare;
      }
    });

    return stats;
  }, [expenses, members]);
  
  if (members.length === 0) return null;

  return (
    <Card className="p-4 md:p-6">
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {members.map((member, index) => {
          const stats = memberStats[member.id] || { totalPaid: 0, totalShare: 0, balance: 0 };
          const isOwed = stats.balance > 0;
          const isSettled = Math.abs(stats.balance) < 0.01;
          
          return (
            <div key={member.id} className="relative flex flex-col items-center text-center">
              <Avatar className="h-16 w-16 border-2">
                <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="mt-2 text-md font-bold text-foreground">{member.name}</h3>
              <div
                className={`mt-1 font-semibold text-xl ${
                  isSettled ? 'text-muted-foreground' : isOwed ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isSettled ? '$0.00' : `${isOwed ? '+' : '-'}$${Math.abs(stats.balance).toFixed(2)}`}
              </div>
              <p className={`text-xs font-medium ${isOwed ? 'text-green-600' : 'text-red-600'}`}>
                {isSettled ? 'Settled' : isOwed ? 'Is Owed' : 'Owes'}
              </p>
              
              <TooltipProvider>
                <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='flex items-center gap-1 cursor-default'>
                                <ArrowUpCircle className="h-4 w-4 text-green-500" />
                                <span>${stats.totalPaid.toFixed(2)}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent><p>Total Paid</p></TooltipContent>
                    </Tooltip>
                     <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='flex items-center gap-1 cursor-default'>
                                <ArrowDownCircle className="h-4 w-4 text-red-500" />
                                <span>${stats.totalShare.toFixed(2)}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent><p>Total Share</p></TooltipContent>
                    </Tooltip>
                </div>
              </TooltipProvider>

              {index < members.length - 1 && (
                <Separator orientation="vertical" className="absolute right-0 top-0 h-full hidden sm:block" />
              )}
               {index < members.length - 1 && (
                <Separator orientation="horizontal" className="absolute bottom-[-0.5rem] left-0 w-full mt-2 sm:hidden" />
              )}
            </div>
          );
        })}
       </div>
    </Card>
  );
}
