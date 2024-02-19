'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button, Container, Section } from '@shadcn/ui'

export function LandingContent() {
  return (
    <div>
      {/* Hero Section */}
      <Section className="bg-gray-50 py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Organized Chatbot
            </h1>
            <p className="mt-4 text-lg leading-7">
              Streamline your conversations with our AI-powered solution.
            </p>
          </div>
        </Container>
      </Section>

      {/* Features Overview */}
      <Section className="py-20">
        <Container>
          <h2 className="text-center text-3xl font-extrabold">
            Why Choose Organized Chatbot?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Feature 1 */}
            <div className="text-center">
              <h3 className="text-xl font-semibold">Efficient Communication</h3>
              <p className="mt-4">
                Automate responses and improve your customer service efficiency.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="text-center">
              <h3 className="text-xl font-semibold">24/7 Availability</h3>
              <p className="mt-4">
                Our chatbot is always on, providing round-the-clock support.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="text-center">
              <h3 className="text-xl font-semibold">Easy Integration</h3>
              <p className="mt-4">
                Seamlessly integrates with your existing platforms and services.
              </p>
            </div>
          </div>
        </Container>
      </Section>

    </div>
  );
}
