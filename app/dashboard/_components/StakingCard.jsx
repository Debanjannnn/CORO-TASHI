import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatTimeLeft } from '@/utils/helpers';
import { Award } from 'lucide-react';


const StakingCard = ({ 
  pool, 
  onClaimRewards, 
  isClaimingReward,
  onClickPool
}) => {
  const hasStake = parseFloat(pool.userStaked) > 0;
  const hasRewards = parseFloat(pool.userRewards) > 0;
  const percentage = hasStake ? (parseFloat(pool.userStaked) / parseFloat(pool.totalStaked || '1')) * 100 : 0;
  
  // Calculate lock status
  const lockEndTimestamp = new Date(pool.lockUntil).getTime();
  const timeLeft = formatTimeLeft(lockEndTimestamp);
  const isLocked = Date.now() < lockEndTimestamp;

  return (
    <Card 
      className="w-full transition-all duration-300 hover:shadow-hover overflow-hidden scale-in"
      style={{ animationDelay: `${100 * pool.id}ms` }}
    >
      <CardHeader className="pb-3 relative">
        <div className="absolute top-3 right-3 py-1 px-3 bg-primary/10 text-primary rounded-full text-xs font-semibold">
          {pool.APY}% APY
        </div>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          Pool #{pool.id}
        </CardTitle>
        <CardDescription>
          Lock period: {pool.lockDays} days
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        {hasStake ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Your stake</span>
                <span className="font-medium">{formatCurrency(pool.userStaked)}</span>
              </div>
              <Progress value={Math.min(percentage, 100)} className="h-1.5" />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rewards</span>
                <span className="text-sm font-medium">{formatCurrency(pool.userRewards)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lock status</span>
                <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${isLocked ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                  {isLocked ? timeLeft : 'Unlocked'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-3 text-center text-muted-foreground text-sm">
            You have no stakes in this pool yet.
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2">
        <Button 
          className="w-full rounded-lg"
          variant="outline"
          onClick={() => onClickPool(pool.id)}
        >
          {hasStake ? 'Manage' : 'Stake Now'}
        </Button>
        
        {hasStake && (
          <Button 
            onClick={() => onClaimRewards(pool.id)}
            disabled={!hasRewards || isClaimingReward}
            className={`rounded-lg ${!hasRewards ? 'cursor-not-allowed opacity-50' : ''}`}
            size="icon"
          >
            <Award size={18} />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StakingCard;