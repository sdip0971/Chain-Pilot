Authentication Layout
This layout wraps the login and signup pages with a branded container. It centers content vertically and horizontally and displays the logo at the top.

import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted flex min-h-screen flex-col justify-center items-center p-6">
      <div className="max-w-sm w-full space-y-6">
        <Link href="/" className="flex items-center gap-2 justify-center">
          <Image src="/logo.svg" alt="NoeBase" width={30} height={30} />
          <span className="font-medium">NodeBase</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
Centers forms on screen
Displays a link with logo to home
Applies consistent padding and spacing
Login Page (src/app/(auth)/login/page.tsx)
This page protects against authenticated users and displays the login form.

import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnAuth();
  return <LoginForm />;
};

export default Page;
Calls requireUnAuth to redirect logged-in users
Renders the client-side LoginForm component
Signup Page (src/app/(auth)/signup/page.tsx)
This page prevents authenticated users from accessing signup and renders the registration form.

import { RegisterForm } from "@/features/auth/components/register";
import { requireUnAuth } from "@/lib/auth-utils";
import React from "react";

async function Register() {
  await requireUnAuth();
  return <RegisterForm />;
}

export default Register;
Invokes requireUnAuth for access control
Wraps RegisterForm in a fragment
Dashboard Layouts
Main Dashboard Layout (src/app/(dashboard)/layout.tsx)
This client component sets up the sidebar and content inset.

"use client";
import AppSidebar from "@/components/ui/mycomponents/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
Provides sidebar context
Renders AppSidebar and places page content
Nested Dashboard Layout (src/app/(dashboard)/(others)/layout.tsx)
This layout adds a fixed header above dashboard “others” pages.

import { AppHeader } from "@/components/ui/mycomponents/app-header";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <AppHeader />
    <main className="flex-1">{children}</main>
  </>
);

export default Layout;
Displays top header via AppHeader
Wraps children in a flex container
Dashboard Pages
Editor Workflow Page
Path: src/app/(dashboard)/(editor)/workflows/[workflowID]/page.tsx
This page fetches a single workflow and hydrates the client-side editor.

import { Editor, EditorError, EditorHeader, EditorLoading } from "@/features/editor/components/editor";
import { prefetchOneWorkflow } from "@/features/workflows/servers/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function WorkFlowPage({ params }: { params: Promise<{ workflowID: string }> }) {
  await requireAuth();
  const { workflowID } = await params;
  if (!workflowID) throw new Error("Workflow ID is required");
  await prefetchOneWorkflow(workflowID);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <EditorHeader workflowId={workflowID} />
          <main className="flex-1">
            <Editor workflowId={workflowID} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
Enforces auth with requireAuth
Prefetches workflow data server-side
Wraps editor in React ErrorBoundary and Suspense
Workflows List Page
Path: src/app/(dashboard)/(others)/workflows/page.tsx
This page lists all workflows with pagination and search.

import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflows } from "@/features/workflows/servers/prefetch";
import WorkflowList, { WorkFLowContainer, WorkFLowError, WorkFLowLoading } from "@/features/workflows/components/workflows";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { workflowParamsLoader } from "@/features/workflows/servers/params-loader";

export default async function WorkflowsPage({ searchParams }: { searchParams: Promise<any> }) {
  await requireAuth();
  const params = await workflowParamsLoader(searchParams);
  prefetchWorkflows(params);

  return (
    <WorkFLowContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkFLowError />}>
          <Suspense fallback={<WorkFLowLoading />}>
            <WorkflowList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkFLowContainer>
  );
}
Loads list via TRPC
Uses workflowParamsLoader to read query params
Shows loading and error states
Credentials Section
Credentials List
Path: src/app/(dashboard)/(others)/credentials/page.tsx
Displays a paginated and searchable list of credentials.

import CredentialsList, { CredentialContainer, CredentialError, CredentialsLoading } from "@/features/credentials/components/credentials";
import { credentialParamLoader } from "@/features/credentials/server/params-loader";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Page({ searchParams }: { searchParams: Promise<any> }) {
  await requireAuth();
  const params = await credentialParamLoader(searchParams);
  prefetchCredentials(params);

  return (
    <CredentialContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<CredentialError />}>
          <Suspense fallback={<CredentialsLoading />}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialContainer>
  );
}
Applies server-side data fetching
Wraps list in error and loading handlers
View Credential
Path: src/app/(dashboard)/(others)/credentials/[credentialID]/page.tsx
Shows details for a single credential.

import { CredentialView } from "@/features/credentials/components/credential";
import { prefetchOneCredential } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Page({ params }: { params: Promise<{ credentialId: string }> }) {
  await requireAuth();
  const { credentialId } = await params;
  prefetchOneCredential(credentialId);

  return (
    <div className="p-4 h-full">
      <HydrateClient>
        <ErrorBoundary fallback={<div>Error loading credential</div>}>
          <Suspense>
            <CredentialView credentialId={credentialId} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
Redirects unauthenticated users
Prefetches the targeted credential
New Credential Form
Path: src/app/(dashboard)/(others)/credentials/new/page.tsx
Renders the form to create a new credential.

import { CredentialForm } from "@/features/credentials/components/credential";
import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();
  return (
    <div className="p-4 h-full">
      <CredentialForm />
    </div>
  );
};

export default Page;
Guards route with requireAuth
Presents CredentialForm for input
Executions Section
Executions List
Path: src/app/(dashboard)/(others)/executions/page.tsx
Lists all workflow executions with real-time status.

import ExecutionsList, { ExecutionContainer, ExecutionsError, ExecutionsLoading } from "@/features/executions/components/execution-history/executions";
import { prefetchExecution } from "@/features/executions/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ExecutionParamLoader } from "@/features/executions/server/params-loader";

export default async function Page({ searchParams }: { searchParams: Promise<any> }) {
  await requireAuth();
  const params = await ExecutionParamLoader(searchParams);
  prefetchExecution(params);

  return (
    <ExecutionContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<ExecutionsError />}>
          <Suspense fallback={<ExecutionsLoading />}>
            <ExecutionsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ExecutionContainer>
  );
}
Fetches paginated executions
Shows live updates via real-time tokens
Execution Detail
Path: src/app/(dashboard)/(others)/executions/[executionID]/page.tsx
Displays the outcome and logs for a specific execution.

import { ExecutionView } from "@/features/executions/components/execution-history/execution";
import { prefetchOneExecution } from "@/features/executions/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Page({ params }: { params: Promise<{ executionId: string }> }) {
  await requireAuth();
  const { executionId } = await params;
  prefetchOneExecution(executionId);

  return (
    <div className="p-4 h-full">
      <HydrateClient>
        <ErrorBoundary fallback={<div>Error loading execution</div>}>
          <Suspense>
            <ExecutionView executionId={executionId} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
Protects the route with requireAuth
Prefetches single execution
API Routes ⚡
Auth API Handler
Path: src/app/api/auth/[...all]/route.ts
Bridges the Better-Auth handler into Next.js API.

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
Inngest Function Endpoint
Path: src/app/api/inngest/route.ts

import { inngest } from "@/inngest/client";
import { executeWorkflow, workflowCancellationHandler } from "@/inngest/function";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [executeWorkflow, workflowCancellationHandler],
});
Sentry Example API
Path: src/app/api/sentry-example-api/route.ts
A failing endpoint to test server-side Sentry monitoring.

import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

class SentryExampleAPIError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "SentryExampleAPIError";
  }
}

export function GET() {
  throw new SentryExampleAPIError("Backend error example");
}
tRPC Endpoint
Path: src/app/api/trpc/[trpc]/route.ts
Handles tRPC requests over Fetch API.

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
Stripe Webhook
Path: src/app/api/webhooks/Stripe/route.ts
Receives Stripe events and triggers workflow execution.

import { inngest } from "@/inngest/client";
import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const workflowId = url.searchParams.get("workflowId");
  if (!workflowId) throw new Error("Missing workflowId");
  const body = await req.json();
  const formData = {
    evnetId: body.id,
    eventType: body.type,
    timestamp: body.created,
    livemode: body.livemode,
    raw: body.data?.object,
  };
  await sendWorkflowExecution({ workflowId, initialData: { stripe: formData } });
  return NextResponse.json({ success: true });
}
Google Form Webhook
Path: src/app/api/webhooks/google-form/route.ts
Transforms Google Form submissions into workflow triggers.

import { inngest } from "@/inngest/client";
import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const workflowId = url.searchParams.get("workflowId");
  if (!workflowId) throw new Error("Missing workflowId");
  const body = await req.json();
  const formData = {
    formId: body.formId,
    responseId: body.responseId,
    timestamp: body.timestamp,
    respondentEmail: body.respondentEmail,
    response: body.responses,
    raw: body,
  };
  await sendWorkflowExecution({ workflowId, initialData: { googleForm: formData } });
  return NextResponse.json({ success: true });
}
Error & Root Layout
Global Error Page (src/app/global-error.tsx)
Captures client-side errors and reports them to Sentry.

"use client";
import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return <NextError statusCode={0} />;
}
Uses React useEffect to report errors
Renders Next.js default error component
Root Layout (src/app/layout.tsx)
Defines fonts, global CSS, and providers for Jotai, TRPC, and Toaster.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "jotai";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "NodeBase",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TRPCReactProvider>
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
Imports global fonts and styles
Wraps app in state and TRPC providers
Renders toast notifications
Sentry Example Frontend Page 🎯
Path: src/app/sentry-example-page/page.tsx
Demonstrates Sentry error capturing on the client.

"use client";
import Head from "next/head";
import * as Sentry from "@sentry/nextjs";
import { useState, useEffect } from "react";

class SentryExampleFrontendError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "SentryExampleFrontendError";
  }
}

export default function Page() {
  const [hasSentError, setHasSentError] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    async function checkConnectivity() {
      const result = await Sentry.diagnoseSdkConnectivity();
      setIsConnected(result !== "sentry-unreachable");
    }
    checkConnectivity();
  }, []);

  return (
    <div>
      <Head>
        <title>sentry-example-page</title>
      </Head>
      <main>
        <button
          onClick={async () => {
            await Sentry.startSpan({ name: "Example Span", op: "test" }, async () => {
              await fetch("/api/sentry-example-api");
            });
            throw new SentryExampleFrontendError("Frontend error example");
          }}
          disabled={!isConnected}
        >
          Throw Sample Error
        </button>
        {hasSentError && <p>Error sent to Sentry.</p>}
        {!isConnected && <p>Network blocked Sentry requests.</p>}
      </main>
    </div>
  );
}
Checks Sentry SDK connectivity
Triggers both backend and frontend errors
Demonstrates span instrumentation
This documentation covers each selected file’s purpose, structure, and key functionality. It clarifies relationships between pages, layouts, and API routes, ensuring you understand how the app initializes, protects routes, and integrates external services.
