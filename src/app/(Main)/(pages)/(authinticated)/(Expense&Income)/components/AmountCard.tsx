import { formatNumber } from "@/lib/formatNumber";
import React from "react";

interface SpendingCardProps {
  amount: number;
  label: string;
  currencySymbol: string | undefined;
}

const AmountCard: React.FC<SpendingCardProps> = ({
  amount,
  label,
  currencySymbol,
}) => {
  return (
    <div className="w-1/3 bg-foreground p-2 rounded-lg shadow-custom border-border/50 border">
      <p className="text-3xl font-bold m-1 mb-0 ">
        {currencySymbol}
        {formatNumber(amount)}
      </p>
      <p className="text-muted ml-1">{label}</p>
    </div>
  );
};

export default AmountCard;
