import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Eye, Ear, Hand, Monitor, Users, Heart } from 'lucide-react';

interface AccessibilityProps {
  onBack: () => void;
}

export function Accessibility({ onBack }: AccessibilityProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-primary hover:underline mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Users className="h-8 w-8" />
            Accessibility Statement
          </h1>
          <p className="text-muted-foreground">
            Our commitment to making OffKulture accessible to everyone
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                At OffKulture, we believe that fashion should be accessible to everyone. We are committed 
                to ensuring our website is usable by people with disabilities and are continuously working 
                to improve the accessibility and usability of our online store.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Our Commitment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA 
                standards and are working towards making our website fully accessible to users with 
                various abilities and disabilities.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Our Goals</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Provide equal access to information and functionality</li>
                    <li>• Ensure content is perceivable by all users</li>
                    <li>• Make our interface operable for everyone</li>
                    <li>• Maintain understandable and robust content</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Ongoing Efforts</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Regular accessibility audits and testing</li>
                    <li>• User feedback integration</li>
                    <li>• Staff training on accessibility best practices</li>
                    <li>• Continuous improvement initiatives</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Visual Accessibility</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• High contrast color schemes</li>
                    <li>• Scalable text and images</li>
                    <li>• Alt text for all images</li>
                    <li>• Clear visual hierarchy</li>
                  </ul>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Ear className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Audio Accessibility</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Screen reader compatibility</li>
                    <li>• Descriptive link text</li>
                    <li>• Proper heading structure</li>
                    <li>• Audio alternatives available</li>
                  </ul>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Hand className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Motor Accessibility</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Keyboard navigation support</li>
                    <li>• Large clickable areas</li>
                    <li>• Skip navigation links</li>
                    <li>• No time-sensitive actions</li>
                  </ul>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Monitor className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Cognitive Accessibility</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Clear and simple language</li>
                    <li>• Consistent navigation</li>
                    <li>• Error prevention and guidance</li>
                    <li>• Predictable functionality</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Standards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">WCAG 2.1 Compliance</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Level A:</strong> Basic accessibility requirements</li>
                    <li>• <strong>Level AA:</strong> Standard accessibility (our target)</li>
                    <li>• <strong>Perceivable:</strong> Information presented in multiple ways</li>
                    <li>• <strong>Operable:</strong> Interface components are functional</li>
                    <li>• <strong>Understandable:</strong> Information and UI operation is clear</li>
                    <li>• <strong>Robust:</strong> Content works across different technologies</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Assistive Technology Support</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Screen Readers:</strong> JAWS, NVDA, VoiceOver</li>
                    <li>• <strong>Voice Control:</strong> Dragon NaturallySpeaking</li>
                    <li>• <strong>Switch Navigation:</strong> Alternative input devices</li>
                    <li>• <strong>Magnification:</strong> ZoomText, built-in browser zoom</li>
                    <li>• <strong>Alternative Keyboards:</strong> On-screen and adaptive keyboards</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Website Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Navigation</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Consistent navigation structure</li>
                    <li>• Skip links to main content</li>
                    <li>• Breadcrumb navigation</li>
                    <li>• Logical tab order</li>
                    <li>• Focus indicators for interactive elements</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Content</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Descriptive page titles</li>
                    <li>• Proper heading hierarchy (H1-H6)</li>
                    <li>• Alternative text for images</li>
                    <li>• Descriptive link text</li>
                    <li>• Form labels and instructions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Design</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Sufficient color contrast ratios</li>
                    <li>• Resizable text up to 200%</li>
                    <li>• No content that flashes or strobes</li>
                    <li>• Multiple ways to find content</li>
                    <li>• Responsive design for all devices</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Functionality</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Keyboard accessible interface</li>
                    <li>• No time limits on interactions</li>
                    <li>• Error identification and correction</li>
                    <li>• Help and documentation available</li>
                    <li>• Context-sensitive assistance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Known Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We are continuously working to improve our website's accessibility. Currently identified areas for improvement include:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">In Progress</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Enhanced product image descriptions</li>
                    <li>• Improved form validation messages</li>
                    <li>• Better mobile touch target sizing</li>
                    <li>• Additional keyboard shortcuts</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Planned Updates</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Audio descriptions for product videos</li>
                    <li>• High contrast theme option</li>
                    <li>• Voice navigation support</li>
                    <li>• Enhanced screen reader announcements</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Browser Accessibility Features</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Chrome:</strong> Settings → Advanced → Accessibility</li>
                    <li>• <strong>Firefox:</strong> about:preferences#general</li>
                    <li>• <strong>Safari:</strong> Preferences → Accessibility</li>
                    <li>• <strong>Edge:</strong> Settings → Accessibility</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Operating System Features</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Windows:</strong> Settings → Ease of Access</li>
                    <li>• <strong>macOS:</strong> System Preferences → Accessibility</li>
                    <li>• <strong>iOS:</strong> Settings → Accessibility</li>
                    <li>• <strong>Android:</strong> Settings → Accessibility</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback and Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your feedback is essential in helping us improve our website's accessibility. If you encounter 
                any barriers or have suggestions for improvement, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Accessibility Team</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Email:</strong> accessibility@offkulture.co.za</p>
                    <p><strong>Phone:</strong> +27 21 123 4567</p>
                    <p><strong>WhatsApp:</strong> +27 82 456 7890</p>
                    <p><strong>Hours:</strong> Mon-Fri 9AM-5PM SAST</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">What to Include</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Description of the accessibility barrier</li>
                    <li>• The web page where you encountered the issue</li>
                    <li>• Your operating system and browser</li>
                    <li>• Assistive technology you're using</li>
                    <li>• Suggested improvements</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Response Time:</strong> We aim to respond to accessibility feedback within 48 hours 
                  and implement fixes within 30 days, depending on the complexity of the issue.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Accessibility Statement Updates</h3>
              <p className="text-sm text-muted-foreground">
                This accessibility statement was last reviewed in January 2024. We review and update this 
                statement regularly to reflect our ongoing accessibility improvements and to ensure it 
                remains accurate and up-to-date.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}