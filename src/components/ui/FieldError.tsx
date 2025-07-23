import { type FieldErrors, type FieldValues } from "react-hook-form";

interface FieldErrorProps<T extends FieldValues> {
  name: keyof T;
  errors: FieldErrors<T>;
}

const FieldError = <T extends FieldValues>({
  name,
  errors,
}: FieldErrorProps<T>) => {
  const fieldError = errors?.[name];
  const message =
    fieldError && "message" in fieldError ? fieldError.message : null;

  return message ? (
    <span className="text-red-500 text-sm font-poppinsregular mt-1 block">
      {message as string}
    </span>
  ) : null;
};

export default FieldError;
