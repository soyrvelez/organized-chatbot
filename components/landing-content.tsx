'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge';

export function LandingContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Organized Chatbot
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        An amazing and beautiful application.
      </p>
      <Badge variant={'default'}>Powered by Next.js' App Router</Badge>
    </div>
  );
}
