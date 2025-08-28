'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { User, Expense } from '@/lib/types';
import { CURRENT_USER_ID } from '@/lib/mock-data';

const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  paidById: z.string().min(1, 'You must select who paid'),
});

type AddExpenseForm = z.infer<typeof expenseSchema>;

type AddExpenseDialogProps = {
  members: User[];
  onAddExpense: (newExpense: Omit<Expense, 'id' | 'timestamp' | 'status' | 'approvals' | 'deletionApprovals'>) => void;
  children: React.ReactNode;
};

export default function AddExpenseDialog({ members, onAddExpense, children }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddExpenseForm>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: undefined,
      paidById: CURRENT_USER_ID,
    },
  });

  const onSubmit = (data: AddExpenseForm) => {
    onAddExpense(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='font-headline'>Add a New Expense</DialogTitle>
          <DialogDescription>
            Enter the details of the expense. It will be sent to the group for approval.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <div className="col-span-3">
                <Input id="description" {...register('description')} placeholder="e.g., Pizza night" />
                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount ($)
              </Label>
              <div className="col-span-3">
                <Input id="amount" type="number" step="0.01" {...register('amount')} placeholder="0.00" />
                {errors.amount && <p className="text-destructive text-sm mt-1">{errors.amount.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paidById" className="text-right">
                Paid by
              </Label>
              <div className="col-span-3">
                <Controller
                  name="paidById"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select who paid" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} {member.id === CURRENT_USER_ID && '(You)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paidById && <p className="text-destructive text-sm mt-1">{errors.paidById.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add for Approval</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
