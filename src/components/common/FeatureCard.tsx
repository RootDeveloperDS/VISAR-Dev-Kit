import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function FeatureCard({ title, description, children }: FeatureCardProps) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline text-glow">{title}</CardTitle>
        <CardDescription className="font-body max-w-2xl mx-auto">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
