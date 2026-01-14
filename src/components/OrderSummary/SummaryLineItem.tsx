type SummaryLineItemProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

export const SummaryLineItem = ({
  label,
  value,
  valueClassName = "",
}: SummaryLineItemProps) => {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
};
