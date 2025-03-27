
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Code, Twitter, Linkedin, Github, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container px-4 sm:px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10 flex items-center justify-center rounded-md overflow-hidden bg-brand-500 shadow-soft">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-lg tracking-tight">FairCode</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              A secure, cheat-resistant environment for conducting live, one-on-one technical interviews.
            </p>
            <div className="flex space-x-4 pt-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium text-sm">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/candidate" className="text-muted-foreground hover:text-foreground transition-colors">
                  For Candidates
                </Link>
              </li>
              <li>
                <Link to="/interviewer" className="text-muted-foreground hover:text-foreground transition-colors">
                  For Interviewers
                </Link>
              </li>
              <li>
                <Link to="/editor" className="text-muted-foreground hover:text-foreground transition-colors">
                  Try Editor
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium text-sm">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium text-sm">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Have questions or want to learn more?
            </p>
            <Button size="sm" variant="outline" className="w-fit">
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FairCode. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
