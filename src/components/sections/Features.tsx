import { 
  Zap, 
  Calendar, 
  Copy, 
  CreditCard, 
  Sliders, 
  Lock,
  Check
} from "lucide-react";
import { Button } from "../ui/button";
import { FeatureProps } from "../../lib/types";

const Feature: React.FC<FeatureProps> = ({ 
  icon, 
  title, 
  description, 
  iconBgColor = "bg-primary-100", 
  iconColor = "text-primary"
}) => {
  return (
    <div className="feature-card bg-white rounded-xl p-6 shadow-md transition-all duration-300">
      <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mb-4`}>
        <div className={`w-6 h-6 ${iconColor}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          GuglyMail combines cutting-edge AI with intuitive design to transform your email workflow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <Feature 
            icon={<Zap />} 
            title="AI Text Generation" 
            description="Craft perfect emails with intelligent suggestions and complete drafts based on simple prompts."
          />
          
          <Feature 
            icon={<Calendar />} 
            title="Smart Scheduling"
            iconBgColor="bg-green-100"
            iconColor="text-green-500"
            description="Send emails at the optimal time with AI-powered timing recommendations for better engagement."
          />
          
          <Feature 
            icon={<Copy />} 
            title="Templates & Snippets"
            iconBgColor="bg-purple-100"
            iconColor="text-purple-500"
            description="Save time with reusable content blocks and AI-enhanced templates for consistent communication."
          />
          
          <Feature 
            icon={<CreditCard />} 
            title="Seamless Integrations"
            iconBgColor="bg-pink-100"
            iconColor="text-pink-500"
            description="Connect with your favorite tools and services for a streamlined workflow."
          />
          
          <Feature 
            icon={<Sliders />} 
            title="Smart Filtering"
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-500"
            description="Focus on what matters with intelligent priority inbox and automated organization."
          />
          
          <Feature 
            icon={<Lock />} 
            title="Enterprise Security"
            iconBgColor="bg-indigo-100"
            iconColor="text-indigo-500"
            description="Rest easy with advanced encryption, compliance features, and data protection."
          />
        </div>
        
        <div className="mt-20 pt-10 border-t border-gray-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">AI-Powered Text Generation</h3>
              <p className="text-gray-600 mb-6">
                Our advanced AI understands context and tone to help you craft the perfect email. From quick replies to detailed business proposals, GuglyMail helps you communicate effectively.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1 mr-2 text-green-500">
                    <Check size={20} />
                  </div>
                  <span>Generate complete emails from simple prompts</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1 mr-2 text-green-500">
                    <Check size={20} />
                  </div>
                  <span>Smart responses with appropriate tone detection</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1 mr-2 text-green-500">
                    <Check size={20} />
                  </div>
                  <span>Grammar and style improvements as you type</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 mt-1 mr-2 text-green-500">
                    <Check size={20} />
                  </div>
                  <span>Multilingual support for global communication</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="ml-4 text-sm text-gray-500">GuglyMail Compose</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">Your prompt:</div>
                    <p className="text-gray-800 font-medium">Write a follow-up email to the marketing team about our upcoming product launch.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">GuglyMail generated:</div>
                    <div>
                      <p className="text-gray-800 mb-2">Subject: Follow-up: Next Steps for Product Launch</p>
                      <p className="text-gray-800 mb-2">Hi Marketing Team,</p>
                      <p className="text-gray-800 mb-2">I wanted to follow up on our discussion about the upcoming product launch scheduled for next month. As discussed, we'll need the following items completed by Friday:</p>
                      <ul className="list-disc pl-5 mb-2 text-gray-800">
                        <li>Final approval on promotional graphics</li>
                        <li>Social media content calendar</li>
                        <li>Press release draft for review</li>
                      </ul>
                      <p className="text-gray-800 mb-2">Please let me know if you have any questions or if there are any roadblocks I can help clear.</p>
                      <p className="text-gray-800">Best regards,<br/>Alex</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" className="text-primary border border-primary-200 mr-2 hover:bg-primary-50 transition-colors">
                      Regenerate
                    </Button>
                    <Button className="bg-primary text-white hover:bg-primary-600 transition-colors">
                      Use This Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
