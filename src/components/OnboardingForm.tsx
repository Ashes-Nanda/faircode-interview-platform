
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
}

interface OnboardingFormProps {
  title: string;
  subtitle: string;
  fields: FormField[];
  submitText: string;
  onSubmit: (data: Record<string, string>) => void;
  userType?: 'candidate' | 'interviewer';
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  title,
  subtitle,
  fields,
  submitText,
  onSubmit,
  userType = 'candidate'
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmit(formData);
      setIsSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  const handleContinue = () => {
    // Redirect based on user type
    navigate(userType === 'candidate' ? '/candidate/dashboard' : '/interviewer/dashboard');
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 md:p-8">
      {isSuccess ? (
        <motion.div 
          variants={successVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center py-8"
        >
          <div className="h-16 w-16 rounded-full bg-brand-50 flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-brand-500" />
          </div>
          <h3 className="text-2xl font-medium mb-2">Registration Successful</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Thank you for registering. You'll receive a confirmation email shortly with next steps.
          </p>
          <div className="space-x-3">
            <Button variant="outline" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
            <Button onClick={handleContinue}>
              Continue to Dashboard
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-medium mb-2">{title}</h3>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            ))}
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : submitText}
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default OnboardingForm;
