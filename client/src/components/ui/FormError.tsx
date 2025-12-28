interface FormErrorProps {
  message?: string;
  className?: string;
}

export function ErrorMessage({ message, className }: FormErrorProps) {
  if (!message) return null;
  return (
    <span className={`text-destructive text-sm mt-1 block ${className}`}>
      {message}
    </span>
  );
}
