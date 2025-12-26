import React from "react";
import { Button } from "../button";
import {
  AlertTriangleIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { Input } from "../input";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "../empty";
import { Card, CardContent, CardDescription, CardTitle } from "../card";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/trpc/server";

type EntityHeadProps = {
  title: string;
  description?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

type EntityContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

type EntityPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

function EntityHeader({
  title,
  description,
  onNew,
  newButtonHref,
  newButtonLabel,
  disabled,
  isCreating,
}: EntityHeadProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-4 mb-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onNew && !newButtonHref && (
          <Button
            disabled={isCreating || disabled}
            onClick={onNew}
            size="sm"
            className="h-9"
          >
            <PlusIcon className="mr-2 size-4" />
            {newButtonLabel}
          </Button>
        )}

        {!onNew && newButtonHref && (
          <Button size="sm" asChild disabled={disabled} className="h-9">
            <Link
              href={newButtonHref}
              prefetch
              className="flex items-center gap-2"
            >
              <PlusIcon className="size-4" />
              {newButtonLabel}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export const EntityContainer = ({
  header,
  search,
  pagination,
  children,
}: EntityContainerProps) => {
  return (
    <div className="p-6 md:px-8 max-w-6xl mx-auto w-full h-full flex flex-col">
      {header}
      <div className="flex flex-col gap-4 flex-1">
        {search && <div className="flex justify-end">{search}</div>}
        {children}
      </div>
      <div className="mt-6 pt-4 border-t">{pagination}</div>
    </div>
  );
};

export default EntityHeader;

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search",
}: EntitySearchProps) => {
  return (
    <div className="relative w-full md:w-64">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        className="pl-9 h-9 bg-background"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="text-xs text-muted-foreground font-medium">
        Page {page} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <Button
          disabled={page === 1 || disabled}
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>

        <Button
          disabled={page === totalPages || disabled}
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

interface StateViewProps {
  message?: String;
}

interface LoadingViewProp extends StateViewProps {
  entity?: string;
}

export const LoadingView = ({ entity = "items", message }: LoadingViewProp) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
      <Loader2Icon className="size-6 animate-spin text-primary" />
      <p className="text-sm">{message || `Loading ${entity}...`}</p>
    </div>
  );
};

export const ErrorView = ({ message }: StateViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-destructive">
      <AlertTriangleIcon className="size-6" />
      <p className="text-sm font-medium">{message || "Something went wrong"}</p>
    </div>
  );
};

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
}

export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
  return (
    <Empty className="py-12 border-dashed bg-muted/5 rounded-xl border-border/60">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="text-muted-foreground/50">
          <PackageOpenIcon className="size-10" />
        </EmptyMedia>
      </EmptyHeader>

      <EmptyTitle className="text-base font-semibold mt-2">
        No items found
      </EmptyTitle>

      {!!message && (
        <EmptyDescription className="max-w-xs mx-auto text-sm">
          {message}
        </EmptyDescription>
      )}

      {!!onNew && (
        <EmptyContent className="mt-4">
          <Button onClick={onNew} variant="outline" size="sm">
            Add item
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

export function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: EntityListProps<T>) {
  if (items.length === 0 && emptyView) {
    return (
      <div className="flex-1 flex justify-center items-center py-12">
        <div className="w-full max-w-lg">{emptyView}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

interface EntityItemProp {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
}

export const EntityItem = ({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}: EntityItemProp) => {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRemoving) {
      return;
    }
    if (onRemove) {
      await onRemove();
    }
  };
  return (
    <Link href={href} prefetch className={cn("group block", className)}>
      <Card className="transition-all duration-200 border-border/60 hover:shadow-sm hover:border-border/80 rounded-xl bg-card">
        <CardContent className="flex flex-row items-center justify-between p-1 pl-3 gap-2">
          <div className="flex items-center gap-4 min-w-0">
            {image && (
              <div className="shrink-0 size-10 flex items-center justify-center rounded-lg bg-secondary/50 border border-border/50 text-muted-foreground">
                {image}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {title}
              </CardTitle>

              {!!subtitle && (
                <CardDescription className="text-xs text-muted-foreground mt-1 truncate">
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>
          {(actions || onRemove) && (
            <div className="flex items-center gap-2 shrink-0">
              {actions}
              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={handleRemove}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <TrashIcon className="mr-2 size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
