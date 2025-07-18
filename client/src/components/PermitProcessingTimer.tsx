
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle, Zap, CheckCircle, X } from "lucide-react";

interface PermitProcessingTimerProps {
  isOpen: boolean;
  onClose: () => void;
  onStartApplication: () => void;
}

export default function PermitProcessingTimer({ 
  isOpen, 
  onClose, 
  onStartApplication 
}: PermitProcessingTimerProps) {
  const [timeLeft, setTimeLeft] = useState(47 * 60 + 23); // 47 minutes 23 seconds
  const [currentlyProcessing, setCurrentlyProcessing] = useState(12);
  const [queuePosition, setQueuePosition] = useState(3);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });

      // Simulate queue movement
      if (Math.random() < 0.1) {
        setCurrentlyProcessing(prev => prev + Math.floor(Math.random() * 3) - 1);
        setQueuePosition(prev => Math.max(1, prev - Math.floor(Math.random() * 2)));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((47 * 60 + 23 - timeLeft) / (47 * 60 + 23)) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full bg-white shadow-2xl border-0">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Clock className="h-6 w-6 text-orange-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Processing Window Closing Soon!
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600">
            Secure your spot in today's fast-track processing queue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-100">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {formatTime(timeLeft)}
            </div>
            <p className="text-sm text-gray-600">until next available processing slot</p>
            <Progress value={progress} className="mt-2 h-2" />
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">{currentlyProcessing}</div>
              <div className="text-xs text-blue-700">Currently Processing</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
              <div className="text-2xl font-bold text-green-600">#{queuePosition}</div>
              <div className="text-xs text-green-700">Your Queue Position</div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-700">2-4 hour processing (vs 2-3 weeks traditional)</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">97% first-time approval rate</span>
            </div>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-gray-700">Real-time AI document analysis</span>
            </div>
          </div>

          {/* Urgency Message */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Limited Daily Capacity</p>
                <p className="text-xs text-red-600 mt-1">
                  Only {Math.floor(Math.random() * 8) + 5} spots remaining in today's priority queue. 
                  Next available slot: Tomorrow at 9:00 AM
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={onStartApplication}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-base"
            >
              Reserve My Spot Now - Start Application
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800"
            >
              I'll wait until tomorrow
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              🔒 Secure Processing • ⚡ AI-Powered • 🏆 Houston #1 Rated
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
