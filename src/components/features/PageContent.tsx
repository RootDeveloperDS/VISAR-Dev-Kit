'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Code, BotMessageSquare, TestTube2, PencilRuler, Shuffle, FileCode, GitCompare, Braces, Settings } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CommentEnhancer from '@/components/features/CommentEnhancer';
import CodeComparator from '@/components/features/CodeComparator';
import StyleConverter from '@/components/features/StyleConverter';
import PseudocodeGenerator from '@/components/features/PseudocodeGenerator';
import UnitTestGenerator from '@/components/features/UnitTestGenerator';
import RenameSuggestion from '@/components/features/RenameSuggestion';
import DependencyExtractor from '@/components/features/DependencyExtractor';

export default function PageContent() {
  const searchParams = useSearchParams();
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const keyFromUrl = searchParams.get('apikey');
    if (keyFromUrl) {
      setApiKey(keyFromUrl);
    }
  }, [searchParams]);

  const features = [
    { name: 'Enhancer', value: 'comment-enhancer', icon: BotMessageSquare, component: <CommentEnhancer apiKey={apiKey} /> },
    { name: 'Comparator', value: 'code-comparator', icon: GitCompare, component: <CodeComparator apiKey={apiKey} /> },
    { name: 'Converter', value: 'style-converter', icon: Shuffle, component: <StyleConverter apiKey={apiKey} /> },
    { name: 'Pseudocode', value: 'pseudocode-generator', icon: FileCode, component: <PseudocodeGenerator apiKey={apiKey} /> },
    { name: 'Unit Tests', value: 'unit-test-generator', icon: TestTube2, component: <UnitTestGenerator apiKey={apiKey} /> },
    { name: 'Rename', value: 'rename-suggestion', icon: PencilRuler, component: <RenameSuggestion apiKey={apiKey} /> },
    { name: 'Imports', value: 'dependency-extractor', icon: Braces, component: <DependencyExtractor apiKey={apiKey} /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto relative">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-4">
            <Code className="w-12 h-12 text-primary text-glow" />
            <h1 className="text-4xl sm:text-5xl font-headline font-bold text-glow">
              VisarDevKit
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 font-body">
            AI-powered tools to supercharge your development workflow.
          </p>
        </header>

        <div className="absolute top-0 right-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="button-glow-shadow">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>API Key Settings</DialogTitle>
                <DialogDescription>
                  Manage your Gemini API Key here. The key is stored only in your browser.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="api-key-modal" className="text-right">
                    API Key
                  </Label>
                  <Input
                    id="api-key-modal"
                    type="password"
                    placeholder="Using key from URL or environment"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="col-span-3 font-code"
                  />
                </div>
                 <p className="text-xs text-muted-foreground text-center col-span-4">Provide key in URL (`?apikey=...`) or paste here.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="glow-shadow bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <Tabs defaultValue="comment-enhancer" className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 h-auto">
                {features.map(feature => (
                  <TabsTrigger key={feature.value} value={feature.value} className="flex flex-col sm:flex-row gap-2 items-center p-2 sm:p-1.5 h-auto" title={feature.name}>
                    <feature.icon className="w-5 h-5" />
                    <span className="hidden md:inline text-xs">{feature.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {features.map(feature => (
                <TabsContent key={feature.value} value={feature.value} className="mt-6">
                  {feature.component}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <footer className="text-center mt-12 text-muted-foreground text-sm">
          <p>Powered by Gemini & Next.js.</p>
        </footer>
      </main>
    </div>
  );
}
