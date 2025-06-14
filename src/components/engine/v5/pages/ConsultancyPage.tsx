
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Zap, TrendingUp, FileText } from 'lucide-react'; // Using FileText as main icon

const ConsultancyPage = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for form submission logic
    // For now, we can use a mailto link or log to console
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    console.log('Consultancy Form Submitted:', { name, email, message });
    alert('Thank you for your inquiry! This form is currently a demo. We will contact you shortly (not really, this is a test).');
    
    // Example mailto link (can be uncommented and used)
    // window.location.href = `mailto:consultancy@agienginex.com?subject=AGI Consultancy Inquiry from ${name}&body=${message}%0A%0AReply to: ${email}`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <FileText className="h-8 w-8 text-cyan-400" />
            AGI Consultancy Services
          </CardTitle>
          <CardDescription className="text-gray-300">
            Leverage the power of AGIengineX to transform your business. Our experts provide tailored AI solutions, automation strategies, and data-driven insights to accelerate your growth and efficiency.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-slate-700/30 p-6 rounded-lg">
              <Brain className="h-12 w-12 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">AI Strategy & Integration</h3>
              <p className="text-gray-400 text-sm">Develop bespoke AI strategies and seamlessly integrate AGI solutions into your existing workflows.</p>
            </div>
            <div className="bg-slate-700/30 p-6 rounded-lg">
              <Zap className="h-12 w-12 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Process Automation</h3>
              <p className="text-gray-400 text-sm">Identify and automate key business processes using intelligent agents for maximum ROI.</p>
            </div>
            <div className="bg-slate-700/30 p-6 rounded-lg">
              <TrendingUp className="h-12 w-12 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Data-Driven Growth</h3>
              <p className="text-gray-400 text-sm">Unlock actionable insights from your data to optimize operations and drive revenue growth.</p>
            </div>
          </div>

          <Card className="bg-slate-700/50 border-slate-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-white">Request a Consultation</CardTitle>
              <CardDescription className="text-gray-400">
                Fill out the form below, and one of our AGI specialists will contact you to discuss your specific needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <Input type="text" name="name" id="name" required className="bg-slate-800 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                  <Input type="email" name="email" id="email" required className="bg-slate-800 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Your Message / Inquiry</label>
                  <Textarea name="message" id="message" rows={4} required className="bg-slate-800 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold">
                  Send Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultancyPage;
