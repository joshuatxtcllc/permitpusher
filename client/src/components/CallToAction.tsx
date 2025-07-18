
import { Button } from "@/components/ui/button";
import { Clock, Zap, TrendingUp } from "lucide-react";

export default function CallToAction() {
  const handleGetStarted = () => {
    const permitSection = document.getElementById('permit-application');
    if (permitSection) {
      permitSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Processing Window Closing Soon
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Don't Wait Weeks for Permit Approval
          </h2>
          <p className="text-xl text-neutral-100 mb-8 max-w-3xl mx-auto">
            Our AI system processes permits in hours, not weeks. Join the thousands of Houston builders who've switched to faster, smarter permit processing.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="font-bold text-lg">2-4 Hours</div>
              <div className="text-sm opacity-90">Average Processing</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="font-bold text-lg">97%</div>
              <div className="text-sm opacity-90">First-Time Approval</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="font-bold text-lg">24/7</div>
              <div className="text-sm opacity-90">AI Processing</div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-primary font-bold text-lg px-8 py-3"
              onClick={handleGetStarted}
            >
              Start Processing My Permit Now
            </Button>
            <p className="text-neutral-200 text-sm">
              ⚡ Instant quote • 🔒 Secure upload • 🏆 Houston's #1 rated permit service
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
