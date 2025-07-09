'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { enhanceCodeComments, type EnhanceCodeCommentsResult } from '@/ai/flows/enhance-code-comments';
import { FeatureCard } from '@/components/common/FeatureCard';
import { OutputCard } from '@/components/common/OutputCard';
import { Separator } from '@/components/ui/separator';

interface CommentEnhancerProps {
  apiKey: string;
}

export default function CommentEnhancer({ apiKey }: CommentEnhancerProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [result, setResult] = useState<EnhanceCodeCommentsResult | null>(null);
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
      const response = await enhanceCodeComments({ code, programmingLanguage: language, apiKey });
      setResult(response);
       if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      const err = error as Error;
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: err.message || 'Failed to enhance comments. Check your API key and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FeatureCard
      title="Comment Enhancer"
      description="Adds smart inline comments to your code to improve readability and maintainability."
    >
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="grid gap-2">
          <Label htmlFor="code-input">Code</Label>
          <Textarea
            id="code-input"
            placeholder="Paste your uncommented code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-code h-48"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="language-input">Programming Language</Label>
          <Input
            id="language-input"
            placeholder="e.g., typescript, python, java"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="font-code"
          />
        </div>

        <Button onClick={handleSubmit} disabled={isLoading} className="w-full button-glow-shadow">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Enhance Comments
        </Button>
      </div>

      {result && 'enhancedCode' in result && (
        <>
          <Separator className="my-6" />
          <div className="max-w-2xl mx-auto">
             <OutputCard title="Enhanced Code" code={result.enhancedCode || ''} />
          </div>
        </>
      )}
    </FeatureCard>
  );
}
