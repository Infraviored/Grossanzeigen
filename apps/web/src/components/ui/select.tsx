import { cn } from '@/lib/cn';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options?: Array<{ value: string; label: string }>;
};

export function Select({ className, options, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black',
        className,
      )}
      {...props}
    >
      {options ? options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      )) : children}
    </select>
  );
}

