'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { codeComparator, type CodeComparatorResult } from '@/ai/flows/code-comparator';
import { FeatureCard } from '@/components/common/FeatureCard';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CodeComparatorProps {
  apiKey: string;
}

export default function CodeComparator({ apiKey }: CodeComparatorProps) {
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [result, setResult] = useState<CodeComparatorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!code1 || !code2) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter code in both fields.' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await codeComparator({ codeSnippet1: code1, codeSnippet2: code2, apiKey });
      setResult(response);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      const err = error as Error;
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: err.message || 'Failed to compare code. Check your API key and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FeatureCard
      title="Code Comparator"
      description="Compares two code snippets and provides a summary of the key differences in functionality and logic."
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="code1-input">Code Snippet 1</Label>
            <Textarea
              id="code1-input"
              placeholder="Paste the first code snippet here..."
              value={code1}
              onChange={(e) => setCode1(e.target.value)}
              className="font-code h-48"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="code2-input">Code Snippet 2</Label>
            <Textarea
              id="code2-input"
              placeholder="Paste the second code snippet here..."
              value={code2}
              onChange={(e) => setCode2(e.target.value)}
              className="font-code h-48"
            />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={isLoading} className="w-full button-glow-shadow">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Compare Code
        </Button>
      </div>

      {result && 'summary' in result && (
        <>
          <Separator className="my-6" />
          <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline">Comparison Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{result.summary}</p>
                </CardContent>
            </Card>
          </div>
        </>
      )}
    </FeatureCard>
  );
}
