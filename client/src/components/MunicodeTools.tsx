import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Book, FileText, ArrowRight, ExternalLink } from "lucide-react";

export default function MunicodeTools() {
  return (
    <section id="municode-tools" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Houston Building Code Access
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            We leverage professional tools like Municode.com to stay current with all local building codes
            and regulations, ensuring your permits are always compliant.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-neutral-800">How We Use Municode</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-2 rounded-full text-primary">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-800">Instant Code Lookup</h4>
                    <p className="text-neutral-600">Our experts quickly reference the latest Houston building codes to streamline your permit process.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-2 rounded-full text-primary">
                    <Book className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-800">Comprehensive Resources</h4>
                    <p className="text-neutral-600">Access to all municipal codes, ordinances, and zoning requirements in Houston and surrounding areas.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-2 rounded-full text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-800">Regulation Compliance</h4>
                    <p className="text-neutral-600">We ensure all permits comply with current regulations, avoiding costly revisions and delays.</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-6">
                <a 
                  href="https://library.municode.com/tx/houston" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary font-medium flex items-center hover:underline"
                >
                  View Houston Municipal Code <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <Card className="bg-neutral-50 border-neutral-200">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-neutral-800">
                    Free Code Compliance Check
                  </h3>
                  <p className="text-neutral-600">
                    Not sure if your project meets Houston's current building codes? 
                    Let our experts review your plans and provide guidance before you submit your permit application.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-6">
                  <h4 className="font-medium text-amber-800 mb-1">Did you know?</h4>
                  <p className="text-sm text-amber-700">
                    Houston's building codes are updated periodically. Projects following outdated codes 
                    can face rejection, causing expensive delays and revisions.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                    className="flex-1"
                  >
                    Get Free Code Check <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                    className="flex-1"
                  >
                    Our Permit Services
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}