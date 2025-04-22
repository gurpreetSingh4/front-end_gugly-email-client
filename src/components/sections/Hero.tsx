import { Button } from "../ui/button";

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              The <span className="gradient-text">Intelligent</span> Email Experience
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
              Revolutionize your communication with AI-powered email drafting, smart responses, and intelligent organization.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={onGetStarted} 
                className="bg-primary text-white px-8 py-6 rounded-full font-medium hover:bg-primary-600 shadow-md hover:shadow-lg transition-all text-lg h-auto"
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                onClick={scrollToFeatures}
                className="bg-white text-primary px-8 py-6 rounded-full font-medium border border-primary-200 shadow-sm hover:shadow-md transition-all text-lg h-auto"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative rounded-lg shadow-2xl custom-shadow overflow-hidden">
              <svg 
                viewBox="0 0 800 500" 
                className="w-full h-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="800" height="500" fill="#f8fafc" />
                <rect x="40" y="40" width="720" height="60" rx="4" fill="#e2e8f0" />
                <rect x="70" y="60" width="150" height="20" rx="2" fill="#94a3b8" />
                <rect x="600" y="60" width="130" height="20" rx="2" fill="#94a3b8" />
                
                <rect x="40" y="120" width="720" height="340" rx="4" fill="#f1f5f9" />
                <rect x="60" y="140" width="680" height="80" rx="3" fill="#ffffff" />
                <rect x="80" y="160" width="200" height="15" rx="2" fill="#3b82f6" />
                <rect x="80" y="185" width="640" height="10" rx="2" fill="#cbd5e1" />
                <rect x="80" y="205" width="400" height="10" rx="2" fill="#cbd5e1" />
                
                <rect x="60" y="240" width="680" height="100" rx="3" fill="#ffffff" />
                <rect x="80" y="260" width="250" height="15" rx="2" fill="#3b82f6" />
                <rect x="80" y="285" width="640" height="10" rx="2" fill="#cbd5e1" />
                <rect x="80" y="305" width="600" height="10" rx="2" fill="#cbd5e1" />
                <rect x="80" y="325" width="530" height="10" rx="2" fill="#cbd5e1" />
                
                <rect x="60" y="360" width="680" height="80" rx="3" fill="#ffffff" />
                <rect x="80" y="380" width="180" height="15" rx="2" fill="#3b82f6" />
                <rect x="80" y="405" width="640" height="10" rx="2" fill="#cbd5e1" />
                <rect x="80" y="425" width="520" height="10" rx="2" fill="#cbd5e1" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-20 flex flex-col items-center">
          <p className="text-gray-500 mb-6 text-center">Trusted by innovative teams worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70">
            {/* Company logos */}
            <div className="h-8 flex items-center justify-center">
              <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="30" rx="4" fill="#64748b" opacity="0.2"/>
                <text x="60" y="19" fontFamily="Arial" fontSize="12" fill="#64748b" textAnchor="middle">Company 1</text>
              </svg>
            </div>
            <div className="h-8 flex items-center justify-center">
              <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="30" rx="4" fill="#64748b" opacity="0.2"/>
                <text x="60" y="19" fontFamily="Arial" fontSize="12" fill="#64748b" textAnchor="middle">Company 2</text>
              </svg>
            </div>
            <div className="h-8 flex items-center justify-center">
              <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="30" rx="4" fill="#64748b" opacity="0.2"/>
                <text x="60" y="19" fontFamily="Arial" fontSize="12" fill="#64748b" textAnchor="middle">Company 3</text>
              </svg>
            </div>
            <div className="h-8 flex items-center justify-center">
              <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="30" rx="4" fill="#64748b" opacity="0.2"/>
                <text x="60" y="19" fontFamily="Arial" fontSize="12" fill="#64748b" textAnchor="middle">Company 4</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
