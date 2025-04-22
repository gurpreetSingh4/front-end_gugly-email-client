import { TechItemProps } from "../../lib/types";

const TechItem: React.FC<TechItemProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

const TechStack = () => {
  return (
    <section id="tech" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Cutting-Edge Technology</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built on a robust, scalable architecture using industry-leading technologies.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <TechItem 
            icon={
              <svg viewBox="0 0 32 32" className="w-12 h-12 text-red-600 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.174 0 0 7.174 0 16s7.174 16 16 16 16-7.174 16-16S24.826 0 16 0zm0 28.202c-6.73 0-12.204-5.473-12.204-12.203 0-6.73 5.474-12.204 12.204-12.204 6.731 0 12.204 5.474 12.204 12.204 0 6.73-5.473 12.203-12.204 12.203z"/>
                <path d="M24.12 14.78l-3.435 1.304c-.318.12-.537.416-.537.76v2.512c0 .343.219.638.537.758l3.435 1.304c.315.12.675.04.91-.207.235-.246.301-.608.163-.919l-1.069-2.512c-.14-.33-.462-.546-.82-.546s-.68.217-.82.546l-1.069 2.512c-.138.311-.073.673.163.919.234.247.594.327.909.207l3.435-1.304c.318-.12.537-.415.537-.758v-2.513c0-.343-.219-.639-.537-.76l-3.435-1.303c-.104-.04-.214-.06-.323-.06-.221 0-.438.084-.604.25-.237.237-.308.595-.178.905l1.04 2.492c.131.316.437.521.775.521s.645-.204.775-.52l1.04-2.493c.13-.31.059-.668-.177-.905-.167-.166-.384-.25-.605-.25-.11 0-.219.02-.324.06z"/>
              </svg>
            }
            title="Redis"
            description="Ultra-fast in-memory database for caching and real-time data processing."
          />
          
          <TechItem 
            icon={
              <svg viewBox="0 0 32 32" className="w-12 h-12 text-orange-500 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.982 14.139v-1.104c0-4.842-3.921-8.764-8.764-8.764h-1.104c-4.842 0-8.764 3.922-8.764 8.764v1.104c0 4.842 3.922 8.764 8.764 8.764h1.104c4.842 0 8.764-3.922 8.764-8.764zm-13.798.552c0-2.65 2.15-4.8 4.8-4.8s4.8 2.15 4.8 4.8-2.15 4.8-4.8 4.8-4.8-2.15-4.8-4.8zm7.698 0c0-1.595-1.303-2.898-2.898-2.898s-2.898 1.303-2.898 2.898 1.303 2.898 2.898 2.898 2.898-1.303 2.898-2.898z"/>
                <path d="M10.35 14.690v-1.655c0-6.601 5.35-11.95 11.95-11.95h1.655c6.601 0 11.95 5.35 11.95 11.95v1.655c0 6.601-5.35 11.95-11.95 11.95h-1.655c-6.601 0-11.95-5.35-11.95-11.95zm-4.255 0v-1.655c0-8.943 7.262-16.205 16.205-16.205h1.655c8.943 0 16.205 7.262 16.205 16.205v1.655c0 8.943-7.262 16.205-16.205 16.205h-1.655c-8.943 0-16.205-7.262-16.205-16.205z"/>
              </svg>
            }
            title="RabbitMQ"
            description="Reliable message broker for distributed and scalable applications."
          />
          
          <TechItem 
            icon={
              <svg viewBox="0 0 32 32" className="w-12 h-12 text-pink-600 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 1.625l-13.968 8.125v13l13.968 8.125 13.969-8.125v-13l-13.969-8.125zM16 4.5l11.175 6.5-4.382 2.5-6.793-3.938-6.793 3.938-4.382-2.5 11.175-6.5zM7.612 15.57l3.443 2-3.443 2v-4zM16 26.875l-8.387-4.875 8.387-4.875 8.387 4.875-8.387 4.875zM24.388 19.57v-4l3.443-2-3.443 2z"/>
                <path d="M16 18.625c1.381 0 2.5-1.119 2.5-2.5s-1.119-2.5-2.5-2.5-2.5 1.119-2.5 2.5 1.119 2.5 2.5 2.5zM16 4c1.381 0 2.5-1.119 2.5-2.5s-1.119-2.5-2.5-2.5-2.5 1.119-2.5 2.5 1.119 2.5 2.5 2.5zM16 28c1.381 0 2.5-1.119 2.5-2.5s-1.119-2.5-2.5-2.5-2.5 1.119-2.5 2.5 1.119 2.5 2.5 2.5z"/>
              </svg>
            }
            title="GraphQL"
            description="Flexible query language for efficient API interactions and data fetching."
          />
          
          <TechItem 
            icon={
              <svg viewBox="0 0 32 32" className="w-12 h-12 text-green-600 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 30a2.151 2.151 0 01-1.076-.288L11.5 27.685c-.513-.287-.262-.388-.093-.447a6.828 6.828 0 001.549-.7.263.263 0 01.255.019l2.631 1.563a.34.34 0 00.318 0l10.26-5.922a.323.323 0 00.157-.278V10.075a.331.331 0 00-.159-.283l-10.26-5.917a.319.319 0 00-.317 0L5.582 9.794a.33.33 0 00-.16.284v11.835a.323.323 0 00.161.276l2.81 1.624c1.525.763 2.459-.136 2.459-1.038V11.085a.3.3 0 01.3-.3h1.3a.3.3 0 01.3.3v11.692c0 2.035-1.108 3.2-3.038 3.2a4.389 4.389 0 01-2.363-.642l-2.697-1.547a2.166 2.166 0 01-1.076-1.872V10.075a2.171 2.171 0 011.076-1.872l10.261-5.924a2.246 2.246 0 012.156 0l10.26 5.923A2.171 2.171 0 0127 10.074v11.836a2.176 2.176 0 01-1.077 1.872l-10.26 5.924A2.152 2.152 0 0116 30z"/>
                <path d="M14.054 17.953a.3.3 0 01.3-.3h1.327a.3.3 0 01.295.251c.2 1.351.8 2.032 3.513 2.032 2.161 0 3.082-.489 3.082-1.636 0-.661-.261-1.152-3.62-1.481-2.808-.278-4.544-.9-4.544-3.144 0-2.07 1.745-3.305 4.67-3.305 3.287 0 4.914 1.141 5.12 3.593a.3.3 0 01-.295.323h-1.336a.3.3 0 01-.288-.232c-.321-1.421-1.1-1.875-3.2-1.875-2.36 0-2.634.822-2.634 1.438 0 .746.324.964 3.51 1.385 3.153.417 4.652 1.008 4.652 3.231 0 2.236-1.866 3.516-5.126 3.516-4.501-.001-5.418-2.055-5.418-3.797z"/>
              </svg>
            }
            title="Node.js"
            description="High-performance server-side JavaScript runtime for scalable applications."
          />
        </div>
        
        <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">Technical Architecture</h3>
          <div className="flex justify-center">
            <svg viewBox="0 0 800 400" className="max-w-full rounded-lg shadow-md" xmlns="http://www.w3.org/2000/svg">
              <rect width="800" height="400" fill="#f8fafc" rx="4" />
              
              {/* User Layer */}
              <rect x="350" y="30" width="100" height="50" rx="4" fill="#3b82f6" />
              <text x="400" y="60" fontSize="14" textAnchor="middle" fill="white" fontFamily="Arial">User</text>
              
              {/* Frontend Layer */}
              <rect x="200" y="120" width="400" height="60" rx="4" fill="#93c5fd" />
              <text x="400" y="155" fontSize="14" textAnchor="middle" fill="#1e3a8a" fontFamily="Arial">React Frontend</text>
              
              {/* API Gateway */}
              <rect x="350" y="220" width="100" height="50" rx="4" fill="#bfdbfe" />
              <text x="400" y="250" fontSize="12" textAnchor="middle" fill="#1e3a8a" fontFamily="Arial">API Gateway</text>
              
              {/* Microservices */}
              <rect x="150" y="310" width="100" height="50" rx="4" fill="#dbeafe" />
              <text x="200" y="340" fontSize="12" textAnchor="middle" fill="#1e3a8a" fontFamily="Arial">Auth Service</text>
              
              <rect x="350" y="310" width="100" height="50" rx="4" fill="#dbeafe" />
              <text x="400" y="340" fontSize="12" textAnchor="middle" fill="#1e3a8a" fontFamily="Arial">Email Service</text>
              
              <rect x="550" y="310" width="100" height="50" rx="4" fill="#dbeafe" />
              <text x="600" y="340" fontSize="12" textAnchor="middle" fill="#1e3a8a" fontFamily="Arial">AI Service</text>
              
              {/* Connecting Lines */}
              <line x1="400" y1="80" x2="400" y2="120" stroke="#94a3b8" strokeWidth="2" />
              <line x1="400" y1="180" x2="400" y2="220" stroke="#94a3b8" strokeWidth="2" />
              <line x1="400" y1="270" x2="400" y2="290" stroke="#94a3b8" strokeWidth="2" />
              <line x1="400" y1="290" x2="200" y2="290" stroke="#94a3b8" strokeWidth="2" />
              <line x1="400" y1="290" x2="600" y2="290" stroke="#94a3b8" strokeWidth="2" />
              <line x1="200" y1="290" x2="200" y2="310" stroke="#94a3b8" strokeWidth="2" />
              <line x1="400" y1="290" x2="400" y2="310" stroke="#94a3b8" strokeWidth="2" />
              <line x1="600" y1="290" x2="600" y2="310" stroke="#94a3b8" strokeWidth="2" />
            </svg>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-primary-600">Highly Scalable</h4>
              <p className="text-gray-600">Built with microservices architecture that scales horizontally to handle millions of users and emails.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-primary-600">Real-time Processing</h4>
              <p className="text-gray-600">Message queuing and in-memory caching ensure instant email delivery and lightning-fast search.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-primary-600">Secure by Design</h4>
              <p className="text-gray-600">End-to-end encryption and robust authentication protect your sensitive communication.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
