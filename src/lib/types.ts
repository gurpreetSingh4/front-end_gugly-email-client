export interface User {
  id: number;
  fullName?: string;
  email?: string;
}

export interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor?: string;
  iconColor?: string;
}

export interface TestimonialProps {
  name: string;
  role: string;
  content: string;
}

export interface TechItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
