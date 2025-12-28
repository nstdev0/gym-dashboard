import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type buttonProps = {
  to: string;
  text: string;
};

export default function PageHeader({
  title,
  description,
  buttonProps,
}: {
  title: string;
  description?: string;
  buttonProps: buttonProps[];
}) {
  return (
    <div className="mb-6 border-b border-border pb-4 flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
      </div>
      <div className="flex gap-2">
        {buttonProps.map((prop, index) => (
          <Link key={index} to={prop.to}>
            <Button>{prop.text}</Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
