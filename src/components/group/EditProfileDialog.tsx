
'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  avatarUrl: z.string().url('Please enter a valid URL for the avatar').or(z.literal('')),
});

type ProfileForm = z.infer<typeof profileSchema>;

type EditProfileDialogProps = {
  user: User;
  onSave: (updatedUser: User) => void;
  onOpenChange: (open: boolean) => void;
};

export default function EditProfileDialog({ user, onSave, onOpenChange }: EditProfileDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
  });

  const avatarUrl = watch('avatarUrl');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (data: ProfileForm) => {
    onSave({ ...user, ...data });
    onOpenChange(false);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Edit Your Profile</DialogTitle>
          <DialogDescription>
            Update your name and avatar. This will be visible to everyone in the group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border-2">
                <AvatarImage src={avatarUrl} alt={watch('name')} data-ai-hint="person portrait" />
                <AvatarFallback>{watch('name')?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                Upload Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input id="avatarUrl" {...register('avatarUrl')} placeholder="https://example.com/image.png" />
              {errors.avatarUrl && <p className="text-destructive text-sm mt-1">{errors.avatarUrl.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
