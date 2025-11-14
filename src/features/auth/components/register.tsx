"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
const registerSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),

}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
})
type RegisterFormValues = z.infer<typeof registerSchema>;
export function RegisterForm () {
const router = useRouter()
const form = useForm({
    resolver : zodResolver(registerSchema),
    defaultValues : {
        email : "",
        password : "",
        confirmPassword:""
    }
})
const onSubmit = async(values:RegisterFormValues)=>{
    console.log(values)
    await authClient.signUp.email(
      {
        name : values.email,
        email : values.email,
        password: values.password,
        callbackURL:"/"
      },{
        onSuccess: () => {
          toast.success("Registration successful! Please check your email to verify your account.");
          router.push("/");
        },
        onError: (ctx) => {
        toast.error(`Registration failed: ${ctx.error.message}`); 
      }
    }
    )
}
const isPending = form.formState.isSubmitting;
return (
  <div className="flex flex-col gap-6">
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">Get Started</CardTitle>
        <CardDescription> Signup to Continue</CardDescription>
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
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
                <Button type="submit" className="w-full" disabled={isPending}>
                  Signup
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  </div>
);
}