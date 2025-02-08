import React from "react";
import { Card } from "@/components/ui/card";
import { Users, MessageSquare, Calendar, Activity } from "lucide-react";

const Analytics = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users,
    },
    {
      title: "Active Posts",
      value: "856",
      change: "+23%",
      icon: MessageSquare,
    },
    {
      title: "Events",
      value: "45",
      change: "+8%",
      icon: Calendar,
    },
    {
      title: "Daily Active Users",
      value: "456",
      change: "+15%",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className="rounded-full p-2 bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-sm text-green-500 mt-2">
                {stat.change} from last month
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          {/* Add chart component here */}
          <div className="h-[300px] flex items-center justify-center border rounded">
            User Growth Chart Placeholder
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
          {/* Add chart component here */}
          <div className="h-[300px] flex items-center justify-center border rounded">
            Engagement Chart Placeholder
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
