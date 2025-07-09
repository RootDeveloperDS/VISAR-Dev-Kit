'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { extractDependencies, type DependencyExtractorResult } from '@/ai/flows/dependency-extractor';
import { FeatureCard } from '@/components/common/FeatureCard';
import { OutputCard } from '@/components/common/OutputCard';
import { Separator } from '@/components/ui/separator';

interface DependencyExtractorProps {
  apiKey: string;
}

export default function DependencyExtractor({ apiKey }: DependencyExtractorProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [result, setResult] = useState<DependencyExtractorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!code) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter some code.' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await extractDependencies({ code, programmingLanguage: language, apiKey });
      setResult(response);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      const err = error as Error;
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: err.message || 'Failed to extract dependencies. Check your API key and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FeatureCard
      title="Dependency Extractor"
      description="Analyze a block of code and extract only the required import statements."
    >
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="grid gap-2">
          <Label htmlFor="code-input">Code Snippet</Label>
          <Textarea
            id="code-input"
            placeholder="Paste your code with or without imports..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-code h-48"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="language-input">Programming Language</Label>
          <Input
            id="language-input"
            placeholder="e.g., typescript, python"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="font-code"
          />
        </div>

        <Button onClick={handleSubmit} disabled={isLoading} className="w-full button-glow-shadow">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Extract Imports
        </Button>
      </div>

      {result && 'dependencies' in result && (
        <>
          <Separator className="my-6" />
          <div className="max-w-2xl mx-auto">
            <OutputCard title="Required Dependencies" code={result.dependencies || ''} />
          </div>
        </>
      )}
    </FeatureCard>
  );
}
