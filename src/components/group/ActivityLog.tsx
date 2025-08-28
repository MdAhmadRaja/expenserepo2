import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Activity, User } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History } from 'lucide-react';

type ActivityLogProps = {
  activities: Activity[];
  members: User[];
};

export default function ActivityLog({ activities, members }: ActivityLogProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <History className="w-6 h-6 text-muted-foreground" />
        <CardTitle className="font-headline text-2xl">Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {activities.map((activity) => {
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={activity.user.avatarUrl} alt={activity.user.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{activity.user.name}</span> {activity.text}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
