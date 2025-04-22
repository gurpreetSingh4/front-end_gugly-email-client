import { Button } from "../ui/button";

interface CTAProps {
  onGetStarted: () => void;
}

const CTA: React.FC<CTAProps> = ({ onGetStarted }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your email experience?</h2>
        <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who have already upgraded to GuglyMail's intelligent email platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            onClick={onGetStarted}
            className="bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all text-lg px-8 py-6 h-auto"
          >
            Get Started Free
          </Button>
          <Button 
            variant="outline"
            className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary transition-all text-lg px-8 py-6 h-auto"
          >
            Request a Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
