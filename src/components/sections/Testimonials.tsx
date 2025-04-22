import { TestimonialProps } from "../../lib/types";
import { Star } from "lucide-react";

const Testimonial: React.FC<TestimonialProps> = ({ name, role, content }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden text-gray-500">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <p className="text-gray-600">
        {content}
      </p>
      <div className="mt-4 flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-current" />
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          GuglyMail is helping professionals across industries save time and communicate better.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Testimonial 
            name="Sarah Johnson"
            role="Marketing Director"
            content="The AI text generation has completely transformed how our team handles email communications. We're saving hours each week and our response quality has improved dramatically."
          />
          
          <Testimonial 
            name="Michael Chen"
            role="Software Engineer"
            content="The technical architecture is impressive. We've integrated GuglyMail with our existing tools, and the performance is outstanding even with our heavy email volume."
          />
          
          <Testimonial 
            name="Jessica Martinez"
            role="Small Business Owner"
            content="As someone who isn't tech-savvy, I was surprised by how intuitive GuglyMail is. The AI helps me write professional emails quickly, which has been a game-changer for my business."
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
