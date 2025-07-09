'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { suggestName, type SuggestNameResult } from '@/ai/flows/rename-suggestion';
import { FeatureCard } from '@/components/common/FeatureCard';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '../common/CopyButton';

interface RenameSuggestionProps {
  apiKey: string;
}

export default function RenameSuggestion({ apiKey }: RenameSuggestionProps) {
  const [code, setCode] = useState('');
  const [nameToRename, setNameToRename] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [result, setResult] = useState<SuggestNameResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!code || !nameToRename) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please provide both code and a name to rename.' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await suggestName({ codeSnippet: code, nameToRename, language, apiKey });
      setResult(response);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      const err = error as Error;
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: err.message || 'Failed to get suggestion. Check your API key and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FeatureCard
      title="Rename Suggestion"
      description="Get descriptive, meaningful name suggestions for your variables and functions."
    >
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="grid gap-2">
          <Label htmlFor="code-input">Code Snippet</Label>
          <Textarea
            id="code-input"
            placeholder="function x(a, b) { return a + b; }"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-code h-36"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="name-input">Name to Rename</Label>
                <Input
                    id="name-input"
                    placeholder="e.g., x"
                    value={nameToRename}
                    onChange={(e) => setNameToRename(e.target.value)}
                    className="font-code"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="language-input">Programming Language</Label>
                <Input
                    id="language-input"
                    placeholder="e.g., typescript"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="font-code"
                />
            </div>
        </div>

        <Button onClick={handleSubmit} disabled={isLoading} className="w-full button-glow-shadow">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Get Suggestion
        </Button>
      </div>

      {result && 'suggestedName' in result && (
        <>
          <Separator className="my-6" />
          <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl font-headline">Suggested Name</CardTitle>
                            <CardDescription>A more descriptive name and rationale.</CardDescription>
                        </div>
                        <CopyButton textToCopy={result.suggestedName || ''} />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="font-code text-lg text-primary">{result.suggestedName}</p>
                    <p className="text-muted-foreground mt-2">{result.explanation}</p>
                </CardContent>
            </Card>
          </div>
        </>
      )}
    </FeatureCard>
  );
}
