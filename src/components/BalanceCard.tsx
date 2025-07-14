import { ArrowDown, ArrowUp } from "lucide-react";

export default function BalanceCard({
  balance,
  icon,
  currencySymbol,
  text,
  changepercentage,
}: {
  balance: number;
  icon: React.ReactNode;
  currencySymbol: string;
  text?: string;
  changepercentage?: number;
}) {
  return (
    <>
      {" "}
      <div className="shadow-custom bg-foreground rounded p-4 w-1/3 flex justify-around  items-center space-x-4">
        {" "}
        <div className="flex flex-col justify-center items-center gap-1">
          <div className="p-2 bg-muted/50 w-fit rounded-full">{icon}</div>
          <small className={`text-center `}>{text}</small>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className={`text-3xl font-bold`}>
            {currencySymbol}
            {balance}
          </div>
          {changepercentage != undefined && (
            <div className="relative text-sm text-muted text-center flex items-center gap-1 justify-center group cursor-help">
              {changepercentage != 0 && changepercentage > 0 ? (
                <ArrowUp className="size-4" />
              ) : (
                <ArrowDown className="size-4" />
              )}
              <span
                className={
                  changepercentage === 0
                    ? "text-neutral-500"
                    : text === "Spending This Month"
                    ? changepercentage > 0
                      ? "!text-red-500"
                      : "!text-green-500"
                    : changepercentage > 0
                    ? "!text-green-500"
                    : "!text-red-500"
                }
              >
                {changepercentage}%
              </span>
              <span className="absolute left-1/2 -translate-x-1/2 top-full w-35 text-text  bg-foreground border-border border transition-all  p-1  rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                {changepercentage === 0
                    ? "Same as last month"
                    : changepercentage > 0
                    ? text === "Spending This Month"? "You're spending more money than the last month"
                    : "You're earning more money than the last month"
                    : text === "Spending This Month"? "You're spending less money than the last month"
                    : "You're earning less money than the last month"}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}