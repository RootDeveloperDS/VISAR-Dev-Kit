import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyButton } from "@/components/common/CopyButton"

interface OutputCardProps {
    title: string;
    code: string;
}

export function OutputCard({ title, code }: OutputCardProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold font-headline">{title}</h3>
                <CopyButton textToCopy={code} />
            </div>
            <Card className="bg-secondary/50">
                <CardContent className="p-0">
                    <pre className="p-4 w-full overflow-x-auto rounded-md">
                        <code className="font-code text-sm text-secondary-foreground">{code}</code>
                    </pre>
                </CardContent>
            </Card>
        </div>
    )
}
