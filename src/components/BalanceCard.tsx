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
      <div className="bg-foreground rounded p-4 w-1/3 flex justify-around  items-center space-x-4">
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
            <div className="text-sm text-muted">
              <span
                className={`${
                  text === "Spending This Month"
                    ? changepercentage == 0
                      ? "text-neutral-500"
                      : changepercentage > 0
                      ? "!text-red-500"
                      : "!text-green-500"
                    :changepercentage == 0
                      ? "text-neutral-500"
                      : changepercentage > 0
                    ? "!text-green-500"
                    : "!text-red-500"
                } `}
              >
                {changepercentage}%{" "}
              </span>{" "}
              Compared to last month
            </div>
          )}
        </div>
      </div>
    </>
  );
}