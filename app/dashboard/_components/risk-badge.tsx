interface RiskBadgeProps {
    risk: string
    className?: string
  }
  
  export default function RiskBadge({ risk, className = "" }: RiskBadgeProps) {
    let bgColor = "bg-yellow-500/20"
    let textColor = "text-yellow-400"
  
    if (risk === "Safe") {
      bgColor = "bg-green-500/20"
      textColor = "text-green-400"
    } else if (risk === "Risky") {
      bgColor = "bg-red-500/20"
      textColor = "text-red-400"
    }
  
    return <span className={`text-xs ${bgColor} ${textColor} px-2 py-0.5 rounded-full ${className}`}>{risk}</span>
  }
  
  