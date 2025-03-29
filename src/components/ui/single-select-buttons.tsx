import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SingleSelectButtonsProps {
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SingleSelectButtons({
  options,
  value,
  onChange,
  className,
}: SingleSelectButtonsProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "default" : "outline"}
          onClick={() => onChange(option.value)}
          className="flex-1"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
} 