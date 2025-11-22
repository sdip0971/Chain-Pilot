"use client"

import EntityHeader, { EntityContainer } from '@/components/ui/mycomponents/entity-components'
import EntityComponents from '@/components/ui/mycomponents/entity-components'
import { useUpgradeModal } from '@/hooks/use-upgrade-modals'
import useSuspenseWorkFlows, { useCreateWorkflows } from '@/hooks/use-workflows'
import { useRouter } from 'next/navigation'
import React, { Children } from 'react'

function WorkflowList() {
    const workflows = useSuspenseWorkFlows()
  return (
    <div>
      <p>
        {JSON.stringify(workflows.data,null,2)}
      </p>
    </div>
  )
}

export default WorkflowList;
export const WorkflowHeader = ({disabled} : {disabled?:boolean})=>{
  const {modal,handleError} = useUpgradeModal()
  const createWorkflow = useCreateWorkflows()
  const router = useRouter()
  const handleCreate = () =>{
    const mutation = createWorkflow
    mutation.mutate(undefined, {
      onSuccess : (data)=>{
      router.push(`/workflows/${data.id}`)
      },
      onError : (error)=>{
        console.log(error)
        handleError(error)
      }
    })
  }

  return (
    <>
    {modal}
      <EntityHeader
        title="Workflows"
        description='Create and manage Workflows'
        onNew={handleCreate}
        newButtonLabel='New WorkFlow'
        disabled={disabled}
        isCreating={false} />
    </>
  )
}
export const WorkFlowContainer = ({children}:{children:React.ReactNode})=>{
  return (
    <EntityContainer header={<WorkflowHeader/>}
    search ={<></>}
    pagination={<></>}>
      {children}
    </EntityContainer>
  )
}