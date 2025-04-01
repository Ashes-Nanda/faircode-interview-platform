
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Menu, X, Code } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'For Candidates', path: '/candidate' },
  { name: 'For Interviewers', path: '/interviewer' },
  { name: 'Try Editor', path: '/editor' },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check if user is on dashboard page to simulate logged in state
    setIsLoggedIn(location.pathname.includes('/dashboard'));
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-soft py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 flex items-center justify-center rounded-md overflow-hidden bg-brand-500 shadow-soft">
            <Code className="h-5 w-5 text-white" />
          </div>
          <span className="font-medium text-lg tracking-tight">FairCode</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3 py-2 rounded-md text-sm transition-colors ${
                  location.pathname === item.path
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-brand-50 rounded-md -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                {item.name}
              </Link>
            ))}
            
            {/* Show Dashboard link if logged in */}
            {isLoggedIn && (
              <Link
                to="/candidate/dashboard"
                className={`relative px-3 py-2 rounded-md text-sm transition-colors ${
                  location.pathname === '/candidate/dashboard'
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {location.pathname === '/candidate/dashboard' && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-brand-50 rounded-md -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                Dashboard
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Button as={Link} to="/candidate/dashboard">
                My Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" as={Link} to="/candidate">
                  Log in
                </Button>
                <Button as={Link} to="/candidate">
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>

        <button
          className="md:hidden flex items-center justify-center"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white/95 backdrop-blur-md shadow-soft"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm ${
                  location.pathname === item.path
                    ? 'bg-brand-50 text-foreground font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Show Dashboard link if logged in */}
            {isLoggedIn && (
              <Link
                to="/candidate/dashboard"
                className={`px-3 py-2 rounded-md text-sm ${
                  location.pathname === '/candidate/dashboard'
                    ? 'bg-brand-50 text-foreground font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
            )}
            
            <div className="flex flex-col gap-2 pt-2 border-t mt-2">
              {isLoggedIn ? (
                <Button as={Link} to="/candidate/dashboard" className="justify-start">
                  My Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start" as={Link} to="/candidate">
                    Log in
                  </Button>
                  <Button className="justify-start" as={Link} to="/candidate">
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navigation;
