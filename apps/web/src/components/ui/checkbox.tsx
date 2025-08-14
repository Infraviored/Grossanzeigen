import { cn } from '@/lib/cn';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  const inputId = id || `cb-${Math.random().toString(36).slice(2)}`;
  return (
    <label htmlFor={inputId} className="inline-flex items-center gap-2 select-none">
      <input
        id={inputId}
        type="checkbox"
        className={cn(
          'h-4 w-4 rounded border-gray-300 text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black',
          className,
        )}
        {...props}
      />
      {label ? <span className="text-sm text-gray-800">{label}</span> : null}
    </label>
  );
}

