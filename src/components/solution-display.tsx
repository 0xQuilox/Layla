import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, Lightbulb, ListChecks, CheckSquare, ExternalLink } from 'lucide-react';
import type { DiagnoseTechIssueOutput } from '@/ai/flows/diagnose-tech-issue';
import { Button } from '@/components/ui/button';

interface SolutionDisplayProps {
  diagnosis: DiagnoseTechIssueOutput | null;
}

// Simple function to detect URLs and make them clickable
const linkify = (text: string) => {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.split(urlRegex).map((part, i) => {
    if (urlRegex.test(part)) {
      return <Button key={i} variant="link" asChild className="p-0 h-auto text-accent hover:text-accent/80">
        <a href={part} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
          {part} <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </Button>;
    }
    return part;
  });
};


export function SolutionDisplay({ diagnosis }: SolutionDisplayProps) {
  if (!diagnosis || (!diagnosis.possibleCauses?.length && !diagnosis.suggestedSolutions?.length)) {
    return null;
  }

  return (
    <Card className="w-full mt-10 mb-10 shadow-2xl bg-card border-border">
      <CardHeader className="text-center border-b border-border pb-6">
        <Lightbulb className="inline-block mr-2 h-10 w-10 text-primary mx-auto mb-2" />
        <CardTitle className="text-2xl sm:text-3xl font-headline text-primary">
          AI Diagnosis Results
        </CardTitle>
        <CardDescription className="text-muted-foreground px-2">
          Here's what Layla found based on your report. Review these suggestions carefully.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-6 sm:p-8">
        {diagnosis.possibleCauses && diagnosis.possibleCauses.length > 0 && (
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center text-foreground">
              <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 mr-3 text-destructive" />
              Possible Causes
            </h3>
            <ul className="space-y-2 ml-2">
              {diagnosis.possibleCauses.map((cause, index) => (
                <li key={index} className="flex items-start p-3 bg-input/50 rounded-md border border-border shadow-sm">
                  <AlertTriangle className="h-5 w-5 mr-3 mt-1 text-destructive/80 shrink-0" />
                  <span className="text-foreground/90">{linkify(cause)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {diagnosis.suggestedSolutions && diagnosis.suggestedSolutions.length > 0 && (
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center text-foreground">
              <ListChecks className="h-6 w-6 sm:h-7 sm:w-7 mr-3 text-green-400" />
              Suggested Solutions & Guides
            </h3>
            <Accordion type="multiple" className="w-full space-y-3">
              {diagnosis.suggestedSolutions.map((solution, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border-border bg-input/50 rounded-lg shadow-sm overflow-hidden">
                  <AccordionTrigger className="px-4 py-4 text-left hover:bg-accent/10 text-foreground font-medium data-[state=open]:bg-accent/5 data-[state=open]:text-primary transition-colors">
                    <div className="flex items-center w-full">
                       <CheckSquare className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-accent shrink-0" />
                       <span className="flex-grow text-base sm:text-lg">Solution #{index + 1}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-4 text-foreground/90 bg-card border-t border-border">
                    <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed">{linkify(solution)}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
         {(!diagnosis.possibleCauses || diagnosis.possibleCauses.length === 0) &&
          (!diagnosis.suggestedSolutions || diagnosis.suggestedSolutions.length === 0) && (
            <p className="text-center text-muted-foreground py-4">No specific causes or solutions could be identified from the provided information. Please try describing your issue with more details or rephrasing your problem.</p>
          )}
      </CardContent>
    </Card>
  );
}
