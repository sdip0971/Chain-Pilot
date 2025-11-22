"use client"

import EntityHeader, { EntityContainer } from '@/components/ui/mycomponents/entity-components'
import EntityComponents from '@/components/ui/mycomponents/entity-components'
import useSuspenseWorkFlows, { useCreateWorkflows } from '@/hooks/use-workflows'
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
  const createWorkflow = useCreateWorkflows()
  const handleCreate = async () =>{
    const mutation = await createWorkflow
    mutation.mutate(undefined, {
      onError : (error)=>{
        console.log(error)
      }
    })
  }

  return (
    <>
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