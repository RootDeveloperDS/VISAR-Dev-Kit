'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateUnitTests, type UnitTest, type UnitTestGeneratorResult } from '@/ai/flows/unit-test-generator';
import { FeatureCard } from '@/components/common/FeatureCard';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface UnitTestGeneratorProps {
  apiKey: string;
}

export default function UnitTestGenerator({ apiKey }: UnitTestGeneratorProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState<UnitTestGeneratorResult | null>(null);
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
      const response = await generateUnitTests({ code, programmingLanguage: language, apiKey });
      setResult(response);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      const err = error as Error;
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: err.message || 'Failed to generate unit tests. Check your API key and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FeatureCard
      title="Unit Test Generator"
      description="Generate a 10-question multiple-choice quiz from your code to test understanding."
    >
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="grid gap-2">
          <Label htmlFor="code-input">Code</Label>
          <Textarea
            id="code-input"
            placeholder="Paste code to generate tests for..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-code h-48"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="language-input">Programming Language</Label>
          <Input
            id="language-input"
            placeholder="e.g., javascript"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="font-code"
          />
        </div>

        <Button onClick={handleSubmit} disabled={isLoading} className="w-full button-glow-shadow">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Tests
        </Button>
      </div>

      {result && 'tests' in result && (
        <>
          <Separator className="my-6" />
          <div className="max-w-2xl mx-auto space-y-4">
             <h3 className="text-xl font-semibold font-headline text-center">Generated Quiz</h3>
            <Accordion type="single" collapsible className="w-full">
              {result.tests?.map((test: UnitTest, index: number) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="font-headline text-left">{index + 1}. {test.question}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 p-2">
                      {test.options.map((option, i) => <li key={i} className="font-code text-sm">{option}</li>)}
                    </ul>
                    <p className="mt-4 font-bold">Correct Answer: <span className="font-code font-normal text-primary">{test.correctAnswer}</span></p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </>
      )}
    </FeatureCard>
  );
}
