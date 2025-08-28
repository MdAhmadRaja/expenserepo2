import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Expense, User } from '@/lib/types';
import { Check, CheckCircle, Hourglass, ShieldAlert, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type ExpenseItemProps = {
  expense: Expense;
  members: User[];
  currentUserId: string;
  onApproval: (expenseId: string, type: 'expense' | 'deletion') => void;
  onDeleteRequest: (expenseId: string) => void;
};

export default function ExpenseItem({ expense, members, currentUserId, onApproval, onDeleteRequest }: ExpenseItemProps) {
  const payer = members.find((m) => m.id === expense.paidById);
  const membersInvolvedInExpense = expense.splitWith || members.map(m => m.id);
  const totalMembers = membersInvolvedInExpense.length;
  const involvedMembers = members.filter(m => membersInvolvedInExpense.includes(m.id));

  const renderApprovalStatus = () => {
    switch (expense.status) {
      case 'approved':
        return (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Approved</span>
          </div>
        );
      case 'pending': {
        const hasApproved = expense.approvals.includes(currentUserId);
        const requiredApprovals = involvedMembers.length;
        return (
          <div className="w-full">
            <div className="flex items-center gap-2 text-sm text-amber-600 mb-2">
              <Hourglass className="h-4 w-4" />
              <span>Pending Approval ({expense.approvals.length}/{requiredApprovals})</span>
            </div>
            <Progress value={(expense.approvals.length / requiredApprovals) * 100} className="h-2" />
            {!hasApproved && membersInvolvedInExpense.includes(currentUserId) && (
              <Button size="sm" className="mt-3 w-full" variant="outline" onClick={() => onApproval(expense.id, 'expense')}>
                <Check className="mr-2 h-4 w-4"/> Approve
              </Button>
            )}
          </div>
        );
      }
      case 'deletion-requested': {
        const hasApprovedDeletion = expense.deletionApprovals.includes(currentUserId);
        const requiredApprovals = involvedMembers.length;
        return (
          <div className="w-full">
            <div className="flex items-center gap-2 text-sm text-red-600 mb-2">
              <ShieldAlert className="h-4 w-4" />
              <span>Deletion Requested ({expense.deletionApprovals.length}/{requiredApprovals})</span>
            </div>
            <Progress value={(expense.deletionApprovals.length / requiredApprovals) * 100} className="h-2 bg-destructive/50 [&>*]:bg-destructive" />
             {!hasApprovedDeletion && membersInvolvedInExpense.includes(currentUserId) && (
              <Button size="sm" variant="destructive" className="mt-3 w-full" onClick={() => onApproval(expense.id, 'deletion')}>
                 <Trash2 className="mr-2 h-4 w-4"/> Approve Deletion
              </Button>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <Card className={cn('transition-all hover:shadow-md', expense.status === 'approved' && 'bg-green-50 border-green-200')}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg font-semibold text-foreground">{expense.description}</p>
            <p className="text-sm text-muted-foreground">
              Paid by {payer?.name} on {format(new Date(expense.timestamp), 'MMM d')}
            </p>
          </div>
          <div className="text-xl font-bold text-foreground">${expense.amount.toFixed(2)}</div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <TooltipProvider>
            <div className="flex -space-x-2 overflow-hidden">
                {involvedMembers.map(member => {
                    const iconClass = "h-7 w-7 border-2 border-background";
                    const hasApproved = expense.approvals.includes(member.id);
                    const hasApprovedDeletion = expense.deletionApprovals.includes(member.id);

                    let statusIndicator;
                    if (expense.status === 'approved') statusIndicator = 'bg-green-500';
                    else if (expense.status === 'pending' && hasApproved) statusIndicator = 'bg-amber-500';
                    else if (expense.status === 'deletion-requested' && hasApprovedDeletion) statusIndicator = 'bg-red-500';
                    else statusIndicator = 'bg-gray-300';
                    
                    return (
                        <Tooltip key={member.id}>
                            <TooltipTrigger>
                                <Avatar className={iconClass}>
                                    <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ${statusIndicator} ring-2 ring-background`} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{member.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
        </TooltipProvider>
        <div className="text-sm text-muted-foreground flex-1">
          Each owes <span className="font-semibold text-foreground">${(expense.amount / totalMembers).toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 bg-muted/50 p-4">
        {renderApprovalStatus()}
        {expense.status !== 'deletion-requested' && expense.paidById === currentUserId && (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => onDeleteRequest(expense.id)}>
            <Trash2 className="mr-2 h-4 w-4" /> Request Deletion
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
