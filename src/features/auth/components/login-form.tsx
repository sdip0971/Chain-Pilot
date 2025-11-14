"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { CardAction,CardContent,Card,CardDescription,CardFooter,CardHeader,CardTitle } from "@/components/ui/card";
import { Form,FormControl,FormDescription,FormLabel,FormItem,FormMessage,FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});
type LoginFormValues = z.infer<typeof loginSchema>;
export function LoginForm () {
const router = useRouter();
const form = useForm({
    resolver : zodResolver(loginSchema),
    defaultValues : {
        email : "",
        password : ""
    }
})
const onSubmit = async(values:LoginFormValues)=>{
    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: "/",
      });
      router.push("/");
    } catch (err: any) {
      toast.error(err?.error?.message || err?.message || "Something went wrong");
    }
}
const isPending = form.formState.isSubmitting;
return (
  <div className="flex flex-col gap-6">
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">Welcome Back!</CardTitle>
        <CardDescription>Login to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  disabled={isPending}
                >
                  Continue with GitHub
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  disabled={isPending}
                >
                  Continue with Google
                </Button>
              </div>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>Login</Button>
              </div>
              <div className="text-center text-sm">Dont have an account?{" "}<Link href="/signup" className="underline underline-offset-4">Sign Up</Link></div>
            </div> 
          </form>
        </Form>
      </CardContent>
    </Card>
  </div>
);
}