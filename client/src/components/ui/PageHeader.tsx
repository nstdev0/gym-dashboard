import { Link } from "react-router-dom";

export default function PageHeader({
  title,
  description,
  buttonProps
}: {
  title: string;
  description?: string;
  buttonProps: {
    to: string;
    text: string;
  };
}) {
  return (
    <div className="mb-4 border-b pb-2 flex justify-between px-5 items-center">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Link to={buttonProps.to} className="border border-primary px-5 py-2 rounded-md">{buttonProps.text}</Link>
    </div>
  );
}
