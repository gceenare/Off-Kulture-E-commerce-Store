import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { HelpCircle, Search } from 'lucide-react';
import { Input } from './ui/input';

interface FAQProps {
  onBack: () => void;
}

export function FAQ({ onBack }: FAQProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const faqData = [
    {
      category: "Orders & Payment",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept Visa, Mastercard, American Express, Diners Club, and EFT payments. We also accept SnapScan, Zapper, and other mobile payment solutions. All payments are processed securely through our payment gateway."
        },
        {
          question: "Can I cancel or modify my order?",
          answer: "You can cancel or modify your order within 1 hour of placing it, provided it hasn't been processed for shipping. After this time, please contact our customer service team and we'll do our best to accommodate your request."
        },
        {
          question: "Do you offer layaway or payment plans?",
          answer: "Yes! We offer a layaway service where you can secure items with a 20% deposit and pay the balance within 30 days. Contact us to set up a payment plan for orders over R1000."
        },
        {
          question: "Why was my payment declined?",
          answer: "Payment declines can happen due to insufficient funds, card limits, or security restrictions. Please check with your bank, ensure your billing address matches your card details, or try a different payment method."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          question: "How long does delivery take?",
          answer: "Standard delivery takes 3-5 business days for major cities and 5-7 days for rural areas. Express delivery (1-2 days) is available in Cape Town, Johannesburg, and Durban for an additional R50."
        },
        {
          question: "Do you deliver nationwide?",
          answer: "Yes, we deliver anywhere in South Africa. We also ship to SADC countries including Botswana, Namibia, Zimbabwe, Lesotho, and Swaziland."
        },
        {
          question: "What if I'm not home for delivery?",
          answer: "Our couriers will attempt delivery 3 times. If unsuccessful, your package will be held at the nearest depot for collection. You'll receive SMS notifications with collection details."
        },
        {
          question: "Can I change my delivery address?",
          answer: "You can change your delivery address within 2 hours of placing your order. After your order is dispatched, changes are not possible, but you can arrange collection from the courier depot."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer 30-day returns on unworn items with original tags. Items must be in original packaging. Swimwear, underwear, and earrings cannot be returned for hygiene reasons."
        },
        {
          question: "How do I exchange an item?",
          answer: "Exchanges can be done in-store or by mail. Online exchanges: contact us for a return label, send the item back, and we'll send the replacement size/color. In-store exchanges are immediate with receipt."
        },
        {
          question: "Who pays for return shipping?",
          answer: "Returns due to sizing issues or change of mind: customer pays return shipping (R80). Returns due to defects or our error: we provide a prepaid return label."
        },
        {
          question: "How long do refunds take?",
          answer: "Refunds are processed within 3-5 business days of receiving the returned item. Credit card refunds may take 5-10 business days to reflect, while EFT refunds take 3-5 business days."
        }
      ]
    },
    {
      category: "Products & Sizing",
      questions: [
        {
          question: "How do I find my size?",
          answer: "Use our detailed size guide with measurements in centimeters. If between sizes, we recommend sizing up. Our customer service team can help with specific sizing questions for individual items."
        },
        {
          question: "Are your products authentic?",
          answer: "Absolutely! All OffKulture products are designed and manufactured to our specifications. We source from trusted suppliers and maintain strict quality control standards."
        },
        {
          question: "Do you restock sold-out items?",
          answer: "Popular items are usually restocked within 2-4 weeks. Sign up for restock notifications on product pages, or contact us to check expected restock dates for specific items."
        },
        {
          question: "How do I care for my OffKulture clothing?",
          answer: "Care instructions are on each item's label and product page. Generally: wash cold, hang dry, iron on low heat. For specific fabrics like denim or knitwear, check the detailed care guide on our website."
        }
      ]
    },
    {
      category: "Account & Website",
      questions: [
        {
          question: "Do I need an account to shop?",
          answer: "Yes, you need to create an account to access our website and make purchases. This helps us provide better service, track your orders, and save your preferences and wishlist."
        },
        {
          question: "I forgot my password, what do I do?",
          answer: "Use the 'Forgot Password' link on the login page. Enter your email address and we'll send you instructions to reset your password. If you don't receive the email, check your spam folder."
        },
        {
          question: "Can I save items for later?",
          answer: "Yes! Add items to your wishlist by clicking the heart icon. Your wishlist is saved to your account and you can access it anytime to move items to your cart."
        },
        {
          question: "How do I track my order?",
          answer: "Log into your account and go to 'Order History' to see all your orders and tracking information. You'll also receive tracking details via email and SMS when your order ships."
        }
      ]
    }
  ];

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      qa => 
        qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qa.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
            <HelpCircle className="h-8 w-8" />
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">Find answers to common questions about shopping with OffKulture</p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {filteredFAQ.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No questions found matching your search.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try different keywords or <button 
                  onClick={() => setSearchTerm('')}
                  className="text-primary hover:underline"
                >
                  clear your search
                </button> to see all questions.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {filteredFAQ.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((qa, questionIndex) => (
                      <AccordionItem 
                        key={`${categoryIndex}-${questionIndex}`} 
                        value={`item-${categoryIndex}-${questionIndex}`}
                      >
                        <AccordionTrigger className="text-left">
                          {qa.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {qa.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8 bg-muted">
          <CardContent className="pt-6 text-center">
            <h3 className="font-medium mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Our customer service team is here to help!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span><strong>Email:</strong> hello@offkulture.co.za</span>
              <span><strong>Phone:</strong> +27 21 123 4567</span>
              <span><strong>WhatsApp:</strong> +27 82 456 7890</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Customer service available Mon-Fri 9AM-6PM SAST
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}