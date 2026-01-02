import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs px-4 py-2 text-muted-foreground/70"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={item.url} className="flex items-center">
              {i > 0 && (
                <span aria-hidden className="mx-1">
                  ›
                </span>
              )}

              {isLast ? (
                <span
                  aria-current="page"
                  className="text-foreground font-medium"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
