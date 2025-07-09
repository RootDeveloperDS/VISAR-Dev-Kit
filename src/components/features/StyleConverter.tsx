'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { convertStyle, type StyleConverterResult } from '@/ai/flows/style-converter';
import { FeatureCard } from '@/components/common/FeatureCard';
import { OutputCard } from '@/components/common/OutputCard';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StyleConverterProps {
  apiKey: string;
}

const styles = ['camelCase', 'PascalCase', 'snake_case', 'kebab-case', 'compact', 'readable'];

export default function StyleConverter({ apiKey }: StyleConverterProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [sourceStyle, setSourceStyle] = useState('snake_case');
  const [targetStyle, setTargetStyle] = useState('camelCase');
  const [result, setResult] = useState<StyleConverterResult | null>(null);
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
      const response = await convertStyle({ code, programmingLanguage: language, sourceStyle, targetStyle, apiKey });
      setResult(response);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      const err = error as Error;
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: err.message || 'Failed to convert style. Check your API key and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FeatureCard
      title="Style Converter"
      description="Automatically convert your code from one style to another, such as snake_case to camelCase."
    >
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="grid gap-2">
          <Label htmlFor="code-input">Code</Label>
          <Textarea
            id="code-input"
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-code h-48"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="source-style">From Style</Label>
                <Select value={sourceStyle} onValueChange={setSourceStyle}>
                    <SelectTrigger id="source-style"><SelectValue /></SelectTrigger>
                    <SelectContent>{styles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="target-style">To Style</Label>
                <Select value={targetStyle} onValueChange={setTargetStyle}>
                    <SelectTrigger id="target-style"><SelectValue /></SelectTrigger>
                    <SelectContent>{styles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
            </div>
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

        <Button onClick={handleSubmit} disabled={isLoading} className="w-full button-glow-shadow">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Convert Style
        </Button>
      </div>

      {result && 'convertedCode' in result && (
        <>
          <Separator className="my-6" />
          <div className="max-w-2xl mx-auto">
            <OutputCard title="Converted Code" code={result.convertedCode || ''} />
          </div>
        </>
      )}
    </FeatureCard>
  );
}
