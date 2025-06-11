
'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleDiagnoseIssue, type DiagnoseFormState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle2, Loader2, Smartphone, Laptop, Tablet as TabletIcon, HardDrive, Tv2, Wifi, Printer as PrinterIcon, Gamepad2, HelpCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: DiagnoseFormState = {
  message: null,
  success: false,
};

const deviceTypes = [
  { value: 'smartphone', label: 'Smartphone' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'desktop', label: 'Desktop PC' },
  { value: 'smartwatch', label: 'Smartwatch' },
  { value: 'tv', label: 'Smart TV' },
  { value: 'router', label: 'Router/Modem' },
  { value: 'printer', label: 'Printer' },
  { value: 'console', label: 'Gaming Console' },
  { value: 'other', label: 'Other Device' },
];

const deviceTypeIcons: Record<string, React.ElementType> = {
  smartphone: Smartphone,
  laptop: Laptop,
  tablet: TabletIcon,
  desktop: HardDrive,
  smartwatch: Clock,
  tv: Tv2,
  router: Wifi,
  printer: PrinterIcon,
  console: Gamepad2,
  other: HelpCircle,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground active:scale-[0.98] transition-transform text-lg py-6 rounded-lg shadow-md">
      {pending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
      Diagnose My Issue
    </Button>
  );
}

interface IssueReportFormProps {
  onDiagnosisResult: (result: DiagnoseFormState) => void;
  setIsLoading: (loading: boolean) => void; // Prop to update loading state in parent
}

export function IssueReportForm({ onDiagnosisResult, setIsLoading }: IssueReportFormProps) {
  const [state, formAction] = useActionState(handleDiagnoseIssue, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus(); // Get pending state for the form

  // State to hold current input values
  const [currentDeviceType, setCurrentDeviceType] = useState('');
  const [currentIssueDescription, setCurrentIssueDescription] = useState('');

  useEffect(() => {
    setIsLoading(pending); // Update parent's loading state
  }, [pending, setIsLoading]);

  useEffect(() => {
    if (state.message) {
      onDiagnosisResult(state);
      if (state.success && state.diagnosis) {
        toast({
          title: "Diagnosis Complete!",
          description: "View the possible causes and solutions below.",
          variant: "default",
          action: <CheckCircle2 className="text-green-500" />,
        });
        // Values are retained due to controlled components
      } else if (!state.success) {
         toast({
          title: "Diagnosis Information",
          description: state.message,
          variant: state.fields ? "destructive" : "default",
          action: <AlertCircle className={state.fields ? "text-red-500" : "text-yellow-500"} />,
        });
      }
    }
  }, [state, toast, onDiagnosisResult]);

  return (
    <Card className="w-full max-w-xl mx-auto shadow-2xl bg-card border-border">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-headline text-center text-primary">Describe Your Issue to Medira</CardTitle>
        <CardDescription className="text-center text-muted-foreground px-2">
          Describe the problem you're facing, and Medira will try to diagnose it. The more details, the better!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="deviceType" className="text-foreground/90 font-medium">Device Type</Label>
            <Select
              name="deviceType"
              required
              value={currentDeviceType}
              onValueChange={setCurrentDeviceType}
            >
              <SelectTrigger id="deviceType" className="w-full bg-input border-border focus:ring-primary text-base py-3 h-auto">
                <SelectValue placeholder="Select device type..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {deviceTypes.map((device) => {
                  const IconComponent = deviceTypeIcons[device.value] || HelpCircle;
                  return (
                    <SelectItem key={device.value} value={device.value} className="data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground text-base py-3">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <span>{device.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {state.fields?.deviceType && <p className="text-sm text-destructive mt-1">{state.fields.deviceType[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDescription" className="text-foreground/90 font-medium">Issue Description</Label>
            <Textarea
              id="issueDescription"
              name="issueDescription"
              placeholder="E.g., My laptop screen is flickering and sometimes goes black. This started happening after the last Windows update. It's a Dell XPS 15..."
              rows={6}
              required
              className="bg-input border-border focus:ring-primary placeholder:text-muted-foreground/70 text-base"
              value={currentIssueDescription}
              onChange={(e) => setCurrentIssueDescription(e.target.value)}
            />
            {state.fields?.issueDescription && <p className="text-sm text-destructive mt-1">{state.fields.issueDescription[0]}</p>}
          </div>

          <SubmitButton />

          {state.message && !state.success && !state.fields && (
             <Alert variant="default" className="mt-4 bg-card border-primary/50">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">Heads up!</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
