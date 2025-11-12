import { Mail, Phone, MapPin, Edit, MessageSquare, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Task {
  title: string;
  dueDate: string;
  color: string;
}

const tasks: Task[] = [
  { title: "Sign the upcoming contract", dueDate: "Tue, Feb 13, 2023", color: "bg-purple-500" },
  { title: "Confirm the personnel payments", dueDate: "Thu, Feb 15, 2023", color: "bg-red-500" },
  { title: "Check the cargo's arrival", dueDate: "Tue, Feb 13, 2023", color: "bg-blue-500" },
];

export function UserDetail() {
  return (
    <div className="w-96 bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col h-screen">
      <div className="p-6 flex items-center justify-between border-b border-white/50">
        <h2 className="text-lg font-semibold text-foreground">User Detail</h2>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-6 flex flex-col items-center">
        <div className="relative mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" />
            <AvatarFallback>EL</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-white" />
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h3 className="text-xl font-semibold text-foreground">Emily Lynch</h3>
            <Badge className="bg-primary text-primary-foreground">✓</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Production Line Expert</p>
        </div>

        <div className="flex gap-2 mb-6 w-full">
          <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10">
            <MessageSquare className="w-4 h-4 mr-2" />
            Assign Task
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary/90">
            <Mail className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Contact information</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">E-mail</div>
                <div className="text-sm text-foreground">e.lynch@gmail.com</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Phone</div>
                <div className="text-sm text-foreground">(616) 396-8484</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Address</div>
                <div className="text-sm text-foreground">84 E 8th St - Town Holland - Michigan - 49423 - United States</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Emily's upcoming tasks</h4>
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <div key={index} className="bg-white/80 rounded-lg p-3 border-l-4" style={{ borderLeftColor: task.color.replace('bg-', '') }}>
                <div className="text-sm font-medium text-foreground mb-1">{task.title}</div>
                <div className="text-xs text-muted-foreground">Due date: {task.dueDate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
