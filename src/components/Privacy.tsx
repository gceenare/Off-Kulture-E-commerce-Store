import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Shield, Eye, Lock, Users, FileText } from 'lucide-react';

interface PrivacyProps {
  onBack: () => void;
}

export function Privacy({ onBack }: PrivacyProps) {
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
            <Shield className="h-8 w-8" />
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 2024 | Effective Date: January 1, 2024
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                At OffKulture, we respect your privacy and are committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your information when you visit 
                our website or make purchases from us.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Personal Information</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Name, email address, and phone number</li>
                  <li>• Billing and shipping addresses</li>
                  <li>• Payment information (processed securely by our payment providers)</li>
                  <li>• Order history and preferences</li>
                  <li>• Communication preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Automatically Collected Information</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• IP address and browser type</li>
                  <li>• Device information and operating system</li>
                  <li>• Pages visited and time spent on our website</li>
                  <li>• Referring website and search terms</li>
                  <li>• Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Order Processing</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Process and fulfill your orders</li>
                    <li>• Send order confirmations and updates</li>
                    <li>• Handle returns and exchanges</li>
                    <li>• Provide customer support</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Communication</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Send promotional emails (with consent)</li>
                    <li>• Notify you of new products and sales</li>
                    <li>• Respond to your inquiries</li>
                    <li>• Send important account updates</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Website Improvement</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Analyze website usage and performance</li>
                    <li>• Personalize your shopping experience</li>
                    <li>• Improve our products and services</li>
                    <li>• Detect and prevent fraud</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Legal Compliance</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Comply with applicable laws</li>
                    <li>• Protect our legal rights</li>
                    <li>• Investigate potential violations</li>
                    <li>• Maintain business records</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We do not sell, trade, or rent your personal information to third parties. We may share your 
                information only in the following circumstances:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Service Providers</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Payment processors (PayGate, PayFast)</li>
                    <li>• Shipping and courier companies</li>
                    <li>• Email marketing services</li>
                    <li>• Website hosting and analytics</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Legal Requirements</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• When required by South African law</li>
                    <li>• To protect our legal rights</li>
                    <li>• To investigate fraud or security issues</li>
                    <li>• In response to valid legal requests</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We implement appropriate security measures to protect your personal information:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Technical Safeguards</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• SSL encryption for data transmission</li>
                    <li>• Secure payment processing</li>
                    <li>• Regular security updates</li>
                    <li>• Access controls and authentication</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Operational Safeguards</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Limited access to personal data</li>
                    <li>• Employee privacy training</li>
                    <li>• Regular security assessments</li>
                    <li>• Incident response procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Under the Protection of Personal Information Act (POPIA), you have the following rights:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Objection:</strong> Object to processing of your information</li>
                  </ul>
                </div>
                <div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li><strong>Portability:</strong> Request transfer of your data</li>
                    <li><strong>Restriction:</strong> Limit how we process your information</li>
                    <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
                    <li><strong>Complaint:</strong> Lodge complaints with the Information Regulator</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>To exercise your rights:</strong> Contact us at privacy@offkulture.co.za or 
                  +27 21 123 4567. We will respond within 30 days as required by POPIA.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We use cookies and similar technologies to enhance your browsing experience:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Essential Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Required for website functionality, shopping cart, and secure checkout.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Analytics Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors use our website to improve performance.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Marketing Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Used to show relevant advertisements and measure campaign effectiveness.
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                You can manage cookie preferences through your browser settings or our cookie consent banner.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about this Privacy Policy or how we handle your personal information:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">OffKulture Privacy Office</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>123 Fashion Street</p>
                    <p>Cape Town, Western Cape 8001</p>
                    <p>South Africa</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Contact Details</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Email:</strong> privacy@offkulture.co.za</p>
                    <p><strong>Phone:</strong> +27 21 123 4567</p>
                    <p><strong>Hours:</strong> Mon-Fri 9AM-5PM SAST</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Updates to This Policy</h3>
              <p className="text-sm text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new policy on our website and updating the "Last Updated" date. 
                Your continued use of our website after any changes constitutes acceptance of the new policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}