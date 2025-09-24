import React from 'react';

export const Card = ({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`${className}`}>{children}</div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...rest
}) => (
  <div className={`${className}`} {...rest}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...rest
}) => (
  <div className={`${className}`} {...rest}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...rest
}) => (
  <div className={`text-lg font-semibold ${className}`} {...rest}>
    {children}
  </div>
);
