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



export function EntityHeader({
  title,
  description,
  onNew,
  newButtonHref,
  newButtonLabel,
  disabled,
  isCreating,
}: EntityHeadProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 self-start sm:self-auto">
        {onNew && !newButtonHref && (
          <Button
            disabled={isCreating || disabled}
            onClick={onNew}
            size="sm"
            className="h-9 px-4 shadow-sm"
          >
            {isCreating ? (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            ) : (
              <PlusIcon className="mr-2 size-4" />
            )}
            {newButtonLabel}
          </Button>
        )}

        {!onNew && newButtonHref && (
          <Button size="sm" asChild disabled={disabled} className="h-9 px-4 shadow-sm">
            <Link href={newButtonHref} prefetch className="flex items-center gap-2">
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
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-6 md:p-10 animate-in fade-in duration-500">
      {header}
      
      <div className="flex flex-col flex-1 gap-6">
        {search && (
          <div className="flex justify-end w-full">
            {search}
          </div>
        )}
        
        <div className="flex-1 w-full min-h-[300px]">
          {children}
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-border/50">
        {pagination}
      </div>
    </div>
  );
};

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search...",
}: EntitySearchProps) => {
  return (
    <div className="relative w-full sm:w-72 transition-all duration-200 focus-within:w-full sm:focus-within:w-80">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        className="pl-9 h-10 bg-muted/40 border-transparent focus:bg-background focus:border-input shadow-none transition-all duration-200"
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
      <div className="text-sm text-muted-foreground font-medium">
        Page <span className="text-foreground">{page}</span> of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <Button
          disabled={page === 1 || disabled}
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs shadow-sm hover:bg-muted/50"
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>

        <Button
          disabled={page === totalPages || disabled}
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs shadow-sm hover:bg-muted/50"
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
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground animate-in fade-in zoom-in-95 duration-300">
      <div className="relative flex items-center justify-center">
        <div className="absolute size-8 rounded-full border-2 border-primary/20" />
        <Loader2Icon className="size-8 animate-spin text-primary" />
      </div>
      <p className="text-sm font-medium">{message || `Loading ${entity}...`}</p>
    </div>
  );
};

export const ErrorView = ({ message }: StateViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-destructive animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-3 bg-destructive/10 rounded-full">
        <AlertTriangleIcon className="size-6" />
      </div>
      <p className="text-sm font-medium text-center max-w-sm">
        {message || "Something went wrong. Please try again."}
      </p>
    </div>
  );
};

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
}

export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
  return (
    <Empty className="py-16 border-2 border-dashed bg-muted/5 rounded-xl border-muted-foreground/10 hover:border-muted-foreground/20 transition-colors duration-300">
      <EmptyHeader>
        <div className="mx-auto bg-background p-4 rounded-full shadow-sm mb-2 ring-1 ring-border/50">
          <PackageOpenIcon className="size-8 text-muted-foreground" />
        </div>
      </EmptyHeader>

      <EmptyTitle className="text-lg font-semibold mt-4 text-foreground">
        No items found
      </EmptyTitle>

      {!!message && (
        <EmptyDescription className="max-w-sm mx-auto text-sm text-muted-foreground mt-2 leading-relaxed">
          {message}
        </EmptyDescription>
      )}

      {!!onNew && (
        <EmptyContent className="mt-6">
          <Button onClick={onNew} variant="outline" className="shadow-sm">
            <PlusIcon className="mr-2 size-4" />
            Add First Item
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
      <div className="flex-1 flex justify-center items-center py-12 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-full max-w-lg">{emptyView}</div>
      </div>
    );
  }

  return (
   
    <div className={cn("flex flex-col gap-2.5", className)}>
      {items.map((item, index) => (
        <div
          key={getKey ? getKey(item, index) : index}
          className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards"
          style={{ animationDelay: `${index * 50}ms` }}
        >
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
    if (isRemoving) return;
    if (onRemove) await onRemove();
  };

  return (
    <Link
      href={href}
      prefetch
      className={cn("group block outline-none", className)}
    >
      <Card className="relative overflow-hidden transition-all duration-200 border border-border/40 bg-background/60 hover:bg-accent/5 hover:border-border/80 hover:shadow-sm active:scale-[0.99] rounded-lg group-focus-visible:ring-2 group-focus-visible:ring-primary/20">
   
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center" />

        <CardContent className="flex flex-row items-center justify-between p-3 pl-4 gap-4">
        
          <div className="flex items-center gap-3.5 min-w-0 flex-1">

            {image && (
              <div className="shrink-0 size-9 flex items-center justify-center rounded-md bg-muted/50 border border-border/40 text-muted-foreground/70 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                {/* We clone the element to enforce a smaller icon size if passed blindly */}
                {React.isValidElement(image)
                  ? React.cloneElement(image as React.ReactElement<any>, {
                      className: "size-4",
                    })
                  : image}
              </div>
            )}

            {/* Text Content */}
            <div className="min-w-0 flex-1 flex flex-col justify-center gap-0.5">
              <CardTitle className="text-sm font-medium leading-none text-foreground group-hover:text-primary transition-colors truncate">
                {title}
              </CardTitle>

              {!!subtitle && (
                <div className="text-xs text-muted-foreground/60 truncate flex items-center gap-2">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          {/* Actions Right */}
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 ease-out">
            {actions}

            {onRemove && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVerticalIcon className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem
                    onClick={handleRemove}
                    disabled={isRemoving}
                    className="text-destructive focus:text-destructive cursor-pointer text-xs font-medium"
                  >
                    {isRemoving ? (
                      <Loader2Icon className="mr-2 size-3 animate-spin" />
                    ) : (
                      <TrashIcon className="mr-2 size-3" />
                    )}
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
export default EntityHeader;