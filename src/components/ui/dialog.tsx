import * as React from 'react';
import { Dialog as HeadlessDialog } from '@headlessui/react';
import { cn } from '../../utils/cn'; // optional: if you have a classnames helper

/* --------------------------- Dialog Context --------------------------- */
/* lightweight context so Trigger/Close can call onOpenChange */
const DialogContext = React.createContext < { setOpen?: (open: boolean) => void } | null > (null);

/* ----------------------------- Types -------------------------------- */
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string; // allow custom classes on the root dialog
  containerClassName?: string; // allow custom classes on the dialog container
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

/* ----------------------------- Helpers ------------------------------- */
function mergeHandlers<T extends (...args: any[]) => any>(a?: T, b?: T) {
  if (!a) return b;
  if (!b) return a;
  return ((...args: any[]) => {
    // call both, preserve return of second (dom onClick semantics don't rely on return)
    a(...args);
    b(...args);
  }) as T;
}

/* ----------------------------- Main Dialog -------------------------- */
export function Dialog({
  open,
  onOpenChange,
  children,
  className,
  containerClassName,
}: DialogProps) {
  // provide setter to children (Trigger/Close)
  const contextValue = React.useMemo(() => ({ setOpen: onOpenChange }), [onOpenChange]);

  return (
    <DialogContext.Provider value={contextValue}>
      <HeadlessDialog open={open} onClose={onOpenChange} className={cn('relative z-50', className)}>
        {/* Backdrop */}
        <div className={cn('fixed inset-0 bg-black/30')} aria-hidden="true" />

        {/* Dialog Container */}
        <div
          className={cn('fixed inset-0 flex items-center justify-center', containerClassName)}
        >
          {children}
        </div>
      </HeadlessDialog>
    </DialogContext.Provider>
  );
}

/* --------------------------- Panel / Content ------------------------- */
export function DialogContent({ className, children, ...rest }: DialogContentProps) {
  return (
    <HeadlessDialog.Panel
      className={cn('relative w-full max-w-lg bg-white shadow-lg transition-all', className)}
      {...rest}
    >
      {children}
    </HeadlessDialog.Panel>
  );
}

/* ---------------------------- Header / Title ------------------------ */
export function DialogHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <HeadlessDialog.Title className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </HeadlessDialog.Title>
  );
}

export function DialogDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <HeadlessDialog.Description className={cn('text-sm text-gray-600', className)}>
      {children}
    </HeadlessDialog.Description>
  );
}

/* --------------------------- Footer / Actions ----------------------- */
export function DialogFooter({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  // commonly used layout: actions aligned to right with small gap
  return (
    <div className={cn('mt-4 flex items-center justify-end gap-3', className)}>{children}</div>
  );
}

/* optional small helper if you prefer an actions container with spacing */
export function DialogActions({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('flex items-center gap-2', className)}>{children}</div>;
}

/* --------------------------- Trigger / Close ------------------------- */
/*
  DialogTrigger:
    - asChild?: when true, clones the child element and attaches the onClick
      (so you can pass a custom button/component).
    - otherwise renders a <button>.
*/
export function DialogTrigger({
  children,
  asChild = false,
  className,
  onClick,
}: {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const ctx = React.useContext(DialogContext);
  const handleOpen = React.useCallback(
    (e?: React.MouseEvent) => {
      onClick?.(e as React.MouseEvent);
      ctx?.setOpen?.(true);
    },
    [ctx, onClick]
  );

  // if asChild is used, clone child element and merge onClick
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    const merged = { onClick: mergeHandlers(child.props.onClick, handleOpen) };
    return React.cloneElement(child, merged);
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className={cn('inline-flex items-center', className)}
    >
      {children}
    </button>
  );
}

/*
  DialogClose:
    - asChild?: same behavior as Trigger but closes the dialog.
*/
export function DialogClose({
  children,
  asChild = false,
  className,
  onClick,
}: {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const ctx = React.useContext(DialogContext);
  const handleClose = React.useCallback(
    (e?: React.MouseEvent) => {
      onClick?.(e as React.MouseEvent);
      ctx?.setOpen?.(false);
    },
    [ctx, onClick]
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    const merged = { onClick: mergeHandlers(child.props.onClick, handleClose) };
    return React.cloneElement(child, merged);
  }

  return (
    <button
      type="button"
      onClick={handleClose}
      className={cn('inline-flex items-center', className)}
    >
      {children}
    </button>
  );
}

/* --------------------------- Named Exports --------------------------- */
export default {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogActions,
  DialogTrigger,
  DialogClose,
};
