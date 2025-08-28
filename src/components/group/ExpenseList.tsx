import type { Expense, User } from '@/lib/types';
import ExpenseItem from './ExpenseItem';

type ExpenseListProps = {
  expenses: Expense[];
  members: User[];
  currentUserId: string;
  onApproval: (expenseId: string, type: 'expense' | 'deletion') => void;
  onDeleteRequest: (expenseId: string) => void;
};

export default function ExpenseList({ expenses, members, currentUserId, onApproval, onDeleteRequest }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-muted-foreground">No expenses yet</h3>
        <p className="text-sm text-muted-foreground">Add the first expense to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <ExpenseItem 
            key={expense.id} 
            expense={expense} 
            members={members} 
            currentUserId={currentUserId}
            onApproval={onApproval}
            onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}
