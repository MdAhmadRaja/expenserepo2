'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import type { Group } from '@/lib/types';
import { Check, Copy, Users, Home } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type GroupHeaderProps = {
  group: Group;
};

export default function GroupHeader({ group }: GroupHeaderProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const joinUrl = `${window.location.origin}/group/${group.id}?join=true`;
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    toast({ title: 'Copied!', description: 'Group join link copied to clipboard.' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-foreground">{group.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">Manage your shared expenses below.</p>
        </div>
        <Link href="/" passHref>
            <Button variant="outline" size="icon" aria-label="Go to home page">
                <Home className="h-5 w-5" />
            </Button>
        </Link>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Shareable Group Link
            </label>
            <div className="flex items-center gap-2">
                <Input type="text" value={`${group.id}`} readOnly className="font-mono" />
                <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy group link">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Group Members ({group.members.length})
            </label>
            <div className="flex items-center pt-2">
                <TooltipProvider>
                    <div className="flex -space-x-3 overflow-hidden">
                        {group.members.map((member) => (
                            <Tooltip key={member.id}>
                                <TooltipTrigger asChild>
                                    <Avatar className="h-10 w-10 border-2 border-background hover:z-10 transition-transform hover:scale-110">
                                        <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{member.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
            </div>
        </div>
      </div>
      <hr />
    </header>
  );
}
