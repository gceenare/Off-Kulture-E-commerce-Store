import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, AlertCircle, CreditCard, Truck, RotateCcw } from 'lucide-react';

interface TermsProps {
  onBack: () => void;
}

export function Terms({ onBack }: TermsProps) {
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
            <FileText className="h-8 w-8" />
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 2024 | Effective Date: January 1, 2024
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Welcome to OffKulture. These Terms and Conditions ("Terms") govern your use of our website 
                and your purchase of products from us. By accessing our website or making a purchase, you 
                agree to be bound by these Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">OffKulture (Pty) Ltd</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Registration Number: 2024/123456/07</p>
                    <p>VAT Number: 4123456789</p>
                    <p>Physical Address:</p>
                    <p>123 Fashion Street</p>
                    <p>Cape Town, Western Cape 8001</p>
                    <p>South Africa</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Email:</strong> legal@offkulture.co.za</p>
                    <p><strong>Phone:</strong> +27 21 123 4567</p>
                    <p><strong>Customer Service:</strong> hello@offkulture.co.za</p>
                    <p><strong>Website:</strong> www.offkulture.co.za</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Website Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Account Registration</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• You must be 18 years or older to create an account</li>
                  <li>• You are responsible for maintaining account security</li>
                  <li>• Provide accurate and complete information</li>
                  <li>• Notify us immediately of any unauthorized use</li>
                  <li>• Only one account per person is permitted</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Prohibited Activities</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Using the website for illegal purposes</li>
                  <li>• Attempting to gain unauthorized access</li>
                  <li>• Interfering with website functionality</li>
                  <li>• Uploading malicious content or viruses</li>
                  <li>• Impersonating others or providing false information</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Orders and Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Order Process</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Orders constitute an offer to purchase</li>
                    <li>• We reserve the right to accept or decline orders</li>
                    <li>• Order confirmation via email</li>
                    <li>• Contract formed upon dispatch confirmation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Pricing</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• All prices in South African Rand (ZAR)</li>
                    <li>• Prices include VAT where applicable</li>
                    <li>• Shipping costs calculated at checkout</li>
                    <li>• Prices subject to change without notice</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Payment Methods</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Credit/Debit cards (Visa, Mastercard, etc.)</li>
                    <li>• EFT and instant banking</li>
                    <li>• Mobile payments (SnapScan, Zapper)</li>
                    <li>• Payment required before dispatch</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Payment Security</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• PCI DSS compliant payment processing</li>
                    <li>• No card details stored on our servers</li>
                    <li>• Fraud protection measures in place</li>
                    <li>• SSL encryption for all transactions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping and Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Delivery Areas</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Nationwide delivery in South Africa</li>
                    <li>• SADC countries (additional charges apply)</li>
                    <li>• No PO Box deliveries for courier services</li>
                    <li>• Valid physical address required</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Delivery Times</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Processing: 1-2 business days</li>
                    <li>• Standard delivery: 3-5 business days</li>
                    <li>• Express delivery: 1-2 business days</li>
                    <li>• Rural areas: 5-7 business days</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Risk and Title</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Risk transfers upon delivery</li>
                    <li>• Title transfers upon payment clearance</li>
                    <li>• Delivery person signature required</li>
                    <li>• Inspect items upon delivery</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Failed Deliveries</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Three delivery attempts made</li>
                    <li>• Collection notice left if unsuccessful</li>
                    <li>• Depot collection available</li>
                    <li>• Additional charges may apply</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Returns and Exchanges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Return Policy</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 30-day return period from delivery</li>
                    <li>• Items must be unworn and in original condition</li>
                    <li>• Original tags and packaging required</li>
                    <li>• Return authorization number needed</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Non-Returnable Items</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Underwear and intimate apparel</li>
                    <li>• Swimwear (hygiene reasons)</li>
                    <li>• Earrings and pierced jewelry</li>
                    <li>• Custom or personalized items</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Return Process</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Contact customer service for authorization</li>
                    <li>• Include return form with package</li>
                    <li>• Use trackable shipping method</li>
                    <li>• Refund processed within 5-10 business days</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Return Costs</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Customer pays return shipping (change of mind)</li>
                    <li>• We pay return shipping (defective items)</li>
                    <li>• Exchange shipping costs shared</li>
                    <li>• Original shipping not refundable</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Warranties and Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Product Warranties</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Products sold "as is" unless otherwise stated</li>
                    <li>• Consumer Protection Act warranties apply</li>
                    <li>• Manufacturing defects covered</li>
                    <li>• Normal wear and tear excluded</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Limitation of Liability</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Liability limited to purchase price</li>
                    <li>• No liability for indirect damages</li>
                    <li>• Force majeure events excluded</li>
                    <li>• Consumer rights not affected</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Our Rights</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• OffKulture trademark and logos</li>
                    <li>• Website content and design</li>
                    <li>• Product images and descriptions</li>
                    <li>• Software and technology</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Your Obligations</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• No unauthorized use of our IP</li>
                    <li>• No reproduction without permission</li>
                    <li>• Respect third-party rights</li>
                    <li>• Report IP violations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>General Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Governing Law</h3>
                  <p className="text-sm text-muted-foreground">
                    These Terms are governed by South African law. Any disputes will be subject to 
                    the exclusive jurisdiction of South African courts.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Severability</h3>
                  <p className="text-sm text-muted-foreground">
                    If any provision is found invalid, the remainder of these Terms will continue 
                    to be valid and enforceable.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Amendments</h3>
                  <p className="text-sm text-muted-foreground">
                    We may update these Terms at any time. Changes will be posted on our website 
                    with an updated effective date.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Contact Us</h3>
                  <p className="text-sm text-muted-foreground">
                    Questions about these Terms? Contact us at legal@offkulture.co.za or 
                    +27 21 123 4567.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Consumer Rights</h3>
              <p className="text-sm text-muted-foreground">
                Nothing in these Terms limits your rights under the Consumer Protection Act 68 of 2008 
                or other applicable consumer protection laws. If you believe your consumer rights have 
                been violated, you may contact the National Consumer Commission at 0860 667 272 or 
                complaints@ncc.org.za.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}