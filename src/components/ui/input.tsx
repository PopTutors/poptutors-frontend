import * as React from 'react';
import { cn } from '../../utils/cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full h-[40px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-primary font-poppinsregular font-normal', // clean white bg + primary text + normal weight
        'placeholder:text-muted-foreground placeholder:font-normal', // placeholder not bold
        'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500', // focus ring
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'transition-colors shadow-xs', // smooth transition
        className
      )}
      {...props}
    />
  );
}

export { Input };
