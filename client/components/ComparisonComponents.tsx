import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { 
  PricingStrategy, 
  STRATEGY_LABELS,
  FlatRateStrategy,
  UsageBasedStrategy,
  TieredStrategy,
  PerUserStrategy
} from "@shared/pricing";

export function ComparisonTable({ strategies }: { strategies: PricingStrategy[] }) {
  const getStrategyMetrics = (strategy: PricingStrategy) => {
    switch (strategy.type) {
      case 'flat-rate':
        const flatStrategy = strategy as FlatRateStrategy;
        return {
          startingPrice: flatStrategy.price,
          scalability: 'Low',
          complexity: 'Very Low',
          customerType: 'SMB',
          revenueModel: 'Predictable'
        };
      case 'usage-based':
        const usageStrategy = strategy as UsageBasedStrategy;
        return {
          startingPrice: usageStrategy.basePrice,
          scalability: 'Very High',
          complexity: 'High',
          customerType: 'Enterprise',
          revenueModel: 'Variable'
        };
      case 'tiered':
        const tieredStrategy = strategy as TieredStrategy;
        return {
          startingPrice: Math.min(...tieredStrategy.tiers.map(t => t.price)),
          scalability: 'High',
          complexity: 'Medium',
          customerType: 'All Segments',
          revenueModel: 'Predictable'
        };
      case 'per-user':
        const userStrategy = strategy as PerUserStrategy;
        return {
          startingPrice: userStrategy.pricePerUser * userStrategy.minimumUsers,
          scalability: 'High',
          complexity: 'Low',
          customerType: 'Teams',
          revenueModel: 'Linear Growth'
        };
      default:
        return {
          startingPrice: 0,
          scalability: 'Unknown',
          complexity: 'Unknown',
          customerType: 'Unknown',
          revenueModel: 'Unknown'
        };
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Strategy</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Starting Price</TableHead>
              <TableHead>Scalability</TableHead>
              <TableHead>Complexity</TableHead>
              <TableHead>Best For</TableHead>
              <TableHead>Revenue Model</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {strategies.map((strategy) => {
              const metrics = getStrategyMetrics(strategy);
              return (
                <TableRow key={strategy.id}>
                  <TableCell className="font-medium">{strategy.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{STRATEGY_LABELS[strategy.type]}</Badge>
                  </TableCell>
                  <TableCell>${metrics.startingPrice}</TableCell>
                  <TableCell>
                    <Badge variant={metrics.scalability === 'Very High' ? 'default' : metrics.scalability === 'High' ? 'secondary' : 'outline'}>
                      {metrics.scalability}
                    </Badge>
                  </TableCell>
                  <TableCell>{metrics.complexity}</TableCell>
                  <TableCell>{metrics.customerType}</TableCell>
                  <TableCell>{metrics.revenueModel}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function CostChart({ strategies }: { strategies: PricingStrategy[] }) {
  const usagePoints = [100, 500, 1000, 2500, 5000, 10000];
  
  const chartData = usagePoints.map(usage => {
    const dataPoint: any = { usage };
    
    strategies.forEach(strategy => {
      let cost = 0;
      
      switch (strategy.type) {
        case 'flat-rate':
          cost = (strategy as FlatRateStrategy).price;
          break;
        case 'usage-based':
          const usageStrategy = strategy as UsageBasedStrategy;
          const overage = Math.max(0, usage - usageStrategy.includedUsage);
          cost = usageStrategy.basePrice + (overage * usageStrategy.usagePrice);
          break;
        case 'per-user':
          // Assume 5 users for comparison
          const userStrategy = strategy as PerUserStrategy;
          cost = Math.max(5, userStrategy.minimumUsers) * userStrategy.pricePerUser;
          break;
        case 'tiered':
          // Use middle tier for comparison
          const tieredStrategy = strategy as TieredStrategy;
          const middleTier = tieredStrategy.tiers[Math.floor(tieredStrategy.tiers.length / 2)];
          cost = middleTier.price;
          break;
      }
      
      dataPoint[strategy.name] = cost;
    });
    
    return dataPoint;
  });

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Cost vs Usage Analysis
        </CardTitle>
        <CardDescription>
          Compare how costs scale across different usage levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="usage"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value: any) => [`$${value}`, 'Cost']}
              labelFormatter={(value) => `Usage: ${value}`}
            />
            {strategies.map((strategy, index) => (
              <Line
                key={strategy.id}
                type="monotone"
                dataKey={strategy.name}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ strokeWidth: 2, r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
