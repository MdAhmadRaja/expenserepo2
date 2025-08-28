'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MOCK_GROUP_KEY } from '@/lib/mock-data';
import { KeyRound, Users } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [joinKey, setJoinKey] = useState('');
  const [groupName, setGroupName] = useState('');

  const handleJoinGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinKey === MOCK_GROUP_KEY) {
      router.push(`/group/${joinKey}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Key',
        description: 'The group key you entered does not exist.',
      });
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim()) {
      // In a real app, this would generate a new key and group.
      const newKey = `NEW-${Date.now()}`;
      // For this prototype, we'll forward to the mock group to show the UI.
      toast({
        title: 'Group Created!',
        description: `Your new group "${groupName}" is ready.`,
      });
      router.push(`/group/${newKey}?name=${encodeURIComponent(groupName)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8">
      <header className="text-center mb-10">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
          ExpenseKey
        </h1>
        <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          The simplest way to share expenses with your group. No accounts, no hassle. Just share a key and start splitting.
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-md">
                   <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Create a New Group</CardTitle>
              </div>
              <CardDescription>
                Start a new group and get a unique key to share with your friends.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    placeholder="e.g., Weekend Trip"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full font-bold">
                  Create Group
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/20 rounded-md">
                   <KeyRound className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="font-headline text-2xl">Join an Existing Group</CardTitle>
              </div>
              <CardDescription>
                Already have a group key? Enter it here to join and see your expenses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinGroup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="group-key">Group Key</Label>
                  <Input
                    id="group-key"
                    placeholder="Enter your unique group key"
                    value={joinKey}
                    onChange={(e) => setJoinKey(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="secondary" className="w-full font-bold">
                  Join Group
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="text-center mt-12 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ExpenseKey. All rights reserved.</p>
      </footer>
    </div>
  );
}
