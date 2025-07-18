
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Zap, 
  Shield, 
  Clock,
  Users,
  Brain,
  Settings,
  Download
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  actionText: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "overview",
    title: "AI Permit Processing System",
    description: "Your complete permit management solution powered by advanced AI",
    icon: <Brain className="h-8 w-8 text-blue-600" />,
    features: [
      "97% first-time approval rate",
      "10x faster than traditional processing",
      "24/7 automated document analysis",
      "Complete regulatory compliance checking"
    ],
    actionText: "Start Application Process"
  },
  {
    id: "application",
    title: "Submit Your Application",
    description: "Complete the intelligent application form that adapts to your project type",
    icon: <FileText className="h-8 w-8 text-green-600" />,
    features: [
      "Dynamic form fields based on permit type",
      "Real-time validation and suggestions",
      "Automatic requirement detection",
      "Project cost estimation"
    ],
    actionText: "Fill Out Application"
  },
  {
    id: "documents",
    title: "AI Document Analysis",
    description: "Upload documents for instant AI-powered compliance checking",
    icon: <Zap className="h-8 w-8 text-yellow-600" />,
    features: [
      "Automated document type detection",
      "Code compliance verification",
      "Missing information identification",
      "Quality and completeness scoring"
    ],
    actionText: "Upload Documents"
  },
  {
    id: "processing",
    title: "Intelligent Processing",
    description: "Our AI system processes your application through multiple verification stages",
    icon: <Settings className="h-8 w-8 text-purple-600" />,
    features: [
      "Multi-stage verification pipeline",
      "Automated code compliance checking",
      "Cross-reference with city databases",
      "Intelligent routing and prioritization"
    ],
    actionText: "Track Progress"
  },
  {
    id: "approval",
    title: "Final Review & Approval",
    description: "Human experts review AI-processed applications for final approval",
    icon: <Shield className="h-8 w-8 text-red-600" />,
    features: [
      "Expert human review when needed",
      "Expedited approval pathway",
      "Digital permit issuance",
      "Automatic notification system"
    ],
    actionText: "Get Your Permit"
  }
];

interface PermitOnboardingProps {
  onStart: () => void;
}

export default function PermitOnboarding({ onStart }: PermitOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showOverview, setShowOverview] = useState(true);

  if (showOverview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to the Future of Permit Processing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered system revolutionizes how permits are processed, making it faster, 
              more accurate, and completely transparent. Replace traditional permit departments 
              with intelligent automation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Process permits in hours instead of weeks. Our AI never sleeps.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Brain className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced machine learning ensures accuracy and compliance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Human Oversight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Expert review when needed, with full transparency throughout.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => setShowOverview(false)} 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Take the Interactive Tour
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const step = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Step {currentStep + 1} of {onboardingSteps.length}
            </h2>
            <Badge variant="secondary">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {step.icon}
            </div>
            <CardTitle className="text-3xl">{step.title}</CardTitle>
            <CardDescription className="text-lg">
              {step.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Key Features:</h4>
                <ul className="space-y-2">
                  {step.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">What Happens Here:</h4>
                {currentStep === 0 && (
                  <p className="text-gray-700">
                    Our AI system analyzes your project requirements and determines the 
                    optimal permit processing strategy. The system has been trained on 
                    thousands of successful permit applications.
                  </p>
                )}
                {currentStep === 1 && (
                  <p className="text-gray-700">
                    The intelligent form adapts based on your project type, showing only 
                    relevant fields. AI validation ensures all required information is 
                    captured correctly the first time.
                  </p>
                )}
                {currentStep === 2 && (
                  <p className="text-gray-700">
                    Upload architectural drawings, site plans, and other documents. Our AI 
                    instantly analyzes them for compliance, quality, and completeness, 
                    providing immediate feedback.
                  </p>
                )}
                {currentStep === 3 && (
                  <p className="text-gray-700">
                    The AI system processes your application through multiple verification 
                    stages, checking against building codes, zoning requirements, and 
                    regulatory compliance automatically.
                  </p>
                )}
                {currentStep === 4 && (
                  <p className="text-gray-700">
                    For complex applications, human experts review the AI analysis. Most 
                    applications are approved automatically, with digital permits issued 
                    immediately.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowOverview(true)}
            >
              Back to Overview
            </Button>
            {currentStep < onboardingSteps.length - 1 ? (
              <Button 
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={onStart}
                className="bg-green-600 hover:bg-green-700"
              >
                Start Your Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
