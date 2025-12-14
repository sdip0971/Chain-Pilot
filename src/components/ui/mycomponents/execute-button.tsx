import React from 'react'
import { Button } from '../button'
import { FlaskConicalIcon } from 'lucide-react'
import { useExecuteWorkflow } from '@/hooks/use-workflows'
function ExecuteButton({workflowId}:{workflowId:string}) {
  const executeWorkflow = useExecuteWorkflow();
  const handleClick = ()=>{
  executeWorkflow.mutate({id:workflowId})
  }
  return (
    <div>
      <Button onClick={handleClick} size='lg' disabled={executeWorkflow.isPending}>
        <FlaskConicalIcon className="size-4" />
        Execute WorkFlow
      </Button>
    </div>
  )
}

export default ExecuteButton
