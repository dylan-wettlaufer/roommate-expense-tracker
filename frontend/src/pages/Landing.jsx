import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Receipt, 
  Scan, 
  ArrowRight, 
  CheckCircle, 
  Smartphone,
  Globe,
  Shield,
  Zap
} from "lucide-react";
import Button from "../components/Button";

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Users,
      title: "Create Groups",
      description: "Easily create groups for your apartment, trips, or any shared expenses",
      gradient: "from-blue-primary to-green-primary"
    },
    {
      icon: Receipt,
      title: "Split Bills",
      description: "Split expenses fairly among group members with automatic calculations",
      gradient: "from-green-primary to-blue-primary"
    },
    {
      icon: Scan,
      title: "AI Receipt Scanning",
      description: "Scan receipts with AI to automatically extract expense details",
      gradient: "from-blue-secondary to-green-secondary"
    }
  ];

  const benefits = [
    "Track all your shared expenses in one place",
    "Never forget who owes what",
    "Settle up with friends easily",
    "Perfect for roommates and travel groups"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-light via-green-light to-blue-light text-foreground overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-primary rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-primary rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-secondary rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className={`text-2xl font-bold bg-gradient-to-r from-blue-primary to-green-primary bg-clip-text text-transparent transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            SplitEasy
          </div>
          <Link to="/login">
            <Button className="bg-gradient-to-r from-blue-primary to-green-primary hover:from-blue-secondary hover:to-green-secondary border-0 shadow-lg transition-all duration-300 hover:scale-105 text-white">
              Launch App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-primary via-green-primary to-blue-secondary bg-clip-text text-transparent transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Split Expenses
            <br />
            <span className="text-4xl md:text-6xl">Made Simple</span>
          </h1>
          
          <p className={`text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Track shared expenses with friends and roommates. Create groups, split bills, and settle up with ease.
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link to="/app">
              <Button size="lg" className="bg-gradient-to-r from-blue-primary to-green-primary hover:from-blue-secondary hover:to-green-secondary border-0 shadow-2xl transition-all duration-300 hover:scale-105 text-lg px-8 py-6 text-white">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white transition-all duration-300 hover:scale-105 text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-primary to-green-primary bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage shared expenses effortlessly
          </p>
        </div>

       
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-primary to-blue-primary bg-clip-text text-transparent">
              Why Choose SplitEasy?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <ul className="space-y-6">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-lg">
                    <CheckCircle className="h-6 w-6 text-green-primary mr-4 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-primary to-green-primary rounded-2xl p-1">
                <div className="bg-card rounded-xl p-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-light rounded-lg p-4 text-center">
                      <Smartphone className="h-8 w-8 text-blue-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Mobile Friendly</p>
                    </div>
                    <div className="bg-green-light rounded-lg p-4 text-center">
                      <Globe className="h-8 w-8 text-green-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Works Anywhere</p>
                    </div>
                    <div className="bg-blue-light rounded-lg p-4 text-center">
                      <Shield className="h-8 w-8 text-blue-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Secure & Private</p>
                    </div>
                    <div className="bg-green-light rounded-lg p-4 text-center">
                      <Zap className="h-8 w-8 text-green-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Lightning Fast</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center bg-gradient-to-r from-blue-primary/10 to-green-primary/10 backdrop-blur-lg rounded-3xl p-12 border border-border">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-primary to-green-primary bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already splitting expenses the smart way
          </p>
          <Link to="/app">
            <Button size="lg" className="bg-gradient-to-r from-blue-primary to-green-primary hover:from-blue-secondary hover:to-green-secondary border-0 shadow-2xl transition-all duration-300 hover:scale-105 text-lg px-12 py-6 text-white">
              Start Splitting Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-8 text-center text-muted-foreground border-t border-border">
        <p>&copy; 2024 SplitEasy. Made with ❤️ for better expense sharing.</p>
      </footer>
    </div>
  );
};

export default Landing;
