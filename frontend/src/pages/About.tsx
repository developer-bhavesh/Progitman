import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, Code, Users } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export const About = ({ onBack }: AboutProps) => {
  return (
    <div className="min-h-screen bg-github-canvas">
      {/* Header */}
      <header className="border-b border-github-default bg-github-default/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-github-secondary hover:text-github-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-github-primary">About Progitman</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="h-20 w-20 rounded-full bg-github-accent flex items-center justify-center mx-auto mb-6">
            <Github className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-github-primary mb-4">Progitman</h2>
          <p className="text-lg text-github-secondary max-w-2xl mx-auto">
            A modern desktop application for managing GitHub credentials securely across multiple student profiles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-github-subtle border border-github-muted rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Code className="h-6 w-6 text-github-accent mr-3" />
              <h3 className="text-lg font-semibold text-github-primary">Technology Stack</h3>
            </div>
            <ul className="space-y-2 text-github-secondary">
              <li>• Built in Go using Wails</li>
              <li>• Cross-platform desktop application</li>
            </ul>
          </div>

          <div className="bg-github-subtle border border-github-muted rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-github-accent mr-3" />
              <h3 className="text-lg font-semibold text-github-primary">Team</h3>
            </div>
            <div className="space-y-3 text-github-secondary">
              <div>
                <p className="font-medium text-github-primary">Developed by</p>
                <p>Solanki Bhavesh</p>
              </div>
              <div>
                <p className="font-medium text-github-primary">Contributor</p>
                <p>Shreyas Shuresh</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-github-subtle border border-github-muted rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-github-primary mb-4">About This Application</h3>
          <p className="text-github-secondary leading-relaxed max-w-3xl mx-auto">
            Progitman provides a seamless cross-platform experience for managing GitHub credentials 
            with native performance and modern web technologies. The application leverages the Wails 
            framework to create native desktop applications using web technologies, offering the best 
            of both worlds - the performance of Go.
          </p>
        </div>
      </main>
    </div>
  );
};