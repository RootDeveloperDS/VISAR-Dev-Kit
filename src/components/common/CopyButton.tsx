'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  textToCopy: string;
}

export function CopyButton({ textToCopy, className, ...props }: CopyButtonProps) {
  const { toast } = useToast();
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setHasCopied(true);
      toast({
        title: 'Copied to clipboard!',
        description: 'The content has been copied successfully.',
      });
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    }).catch(err => {
      toast({
        variant: 'destructive',
        title: 'Failed to copy',
        description: 'Could not copy text to clipboard.',
      });
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn('h-7 w-7', className)}
      onClick={copyToClipboard}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
