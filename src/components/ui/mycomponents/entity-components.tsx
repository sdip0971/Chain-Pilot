import React from 'react'
import { Button } from '../button'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
type EntityHeadProps= {
    title:string,
    description?:string,
    newButtonLabel?:string
    disabled? : boolean
    isCreating?: boolean
} & (
   | { onNew : ()=> void; newButtonHref?: never}
   | {newButtonHref : string; onNew?:never}
   | {onNew?:never; newButtonHref?:never}
)
type EntityContainerProps = {
  children: React.ReactNode,
  header?: React.ReactNode,
  search?: React.ReactNode,
  pagination?: React.ReactNode,
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
    <div className="flex flex-row items-center justify-between gap-x-4 ">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}{" "}
          </p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button disabled={isCreating} onClick={onNew}>
          <PlusIcon className="size-4" />
          {newButtonLabel}
        </Button>
      )}
      {!onNew && newButtonHref && (
        <Button size="sm" asChild>
          <Link href={newButtonHref} prefetch />
          <PlusIcon className="size-4" />
          {newButtonLabel}
        </Button>
      )}
    </div>
  );
}
export const EntityContainer = ({header,search,pagination,children}:EntityContainerProps)=>{
return <div className='p4 md:px-10 md:py-6 h-full'>
<div className= 'mx-auto max-w-screen-xm w-full flex flex-col gap-y-8 h-full'>
  {header}
  <div className="flex flex-col gap-y-4 h-full">
    {search}  
    {children}
  </div>
  {pagination}
</div>
</div>

}

export default EntityHeader
