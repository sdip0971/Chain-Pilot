"use client"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useReactFlow } from "@xyflow/react"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"

const formSchema = z.object({
  variableName:z.string().min(1,{message:"Variable name is required"}).regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/ , {
    message: "Varibale name must start with letter or underscore and contain only letters, numbers and underscores"
  }),
  endpoint: z.url({message:"Please enter valid url" }).min(1, "Endpoint is required"),
  method : z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional()
  //.refine()
})

interface Props {
    open:boolean,
    onOpenChangeAction:(open:boolean)=>void,
    onSubmit?:(values : z.infer<typeof formSchema>)=> void,
    defaultMethod : "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    defaultBody?:string
    defaultEndpoint?:string
    defaultVariableName?:string
    // nodeId:string
}
export type HttpRequestFormValues = z.infer<typeof formSchema>;

 export const HttpRequestDialog = ({ open,onSubmit, onOpenChangeAction, defaultMethod, defaultBody, defaultEndpoint,defaultVariableName }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      variableName: defaultVariableName ?? "",
      endpoint : defaultEndpoint,
      method: defaultMethod,
      body: defaultBody
    }
  })
    useEffect(()=>{
      if(open){
        form.reset({
          endpoint : defaultEndpoint,
          method : defaultMethod,
          body : defaultBody,
          variableName:defaultVariableName
        })
      }
     },[open, defaultEndpoint,defaultMethod,defaultBody,form])
  const {setNodes} = useReactFlow()
  const watchMethod = form.watch("method")
  const watchVariable = form.watch("variableName")
  const showBodyField = watchMethod !== "GET" && watchMethod !== "DELETE"

   const handleSubmit = (values: z.infer<typeof formSchema>) => {
     onSubmit?.(values)
     onOpenChangeAction(false);
   };
   return (
     <Dialog open={open} onOpenChange={onOpenChangeAction}>
       <DialogContent>
         <DialogHeader>
           <DialogTitle>Http Request</DialogTitle>
           <DialogDescription>
             Configure settings for the HTTP Request node.
           </DialogDescription>
         </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
          <FormField control={form.control}
            name="variableName"
            render={({field})=>(
              <FormItem>
                <FormLabel>Variable Name</FormLabel>
                <FormControl>
                  <Input placeholder="response" {...field} />
                </FormControl>
                <FormDescription>Use this name to reference result in other nodes: {" "}{"{{myApiCall.httpResponse.data}}"} </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} 
          name="method"
          render={({field})=>(
            <FormItem>
              <FormLabel>Method</FormLabel>
              <FormControl>
                <Select onValueChange = {field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The Http methods to use for this request</FormDescription>
                <FormMessage/>
              </FormControl>
            </FormItem>
          )}
          />
          <FormField control={form.control} 
          name="endpoint"
          render={({field})=>(
            <FormItem>
              <FormLabel>Endpoint</FormLabel>
              <FormControl>
                <Input placeholder="https://api.example.com/data" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          {showBodyField && (
            <FormField control={form.control} 
            name="body"
            render ={({field})=>(
              <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <Textarea placeholder='{"key":"value"}' {...field} />
                </FormControl>
                <FormMessage /> 
              </FormItem>
            )}
            />
          )}
          <DialogFooter><Button type='submit'>Save</Button></DialogFooter>
        </form>
      </Form>
       </DialogContent>
     </Dialog>
   );
 };
