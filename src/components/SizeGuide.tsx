import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Ruler, Info } from 'lucide-react';

interface SizeGuideProps {
  onBack: () => void;
}

export function SizeGuide({ onBack }: SizeGuideProps) {
  const [selectedCategory, setSelectedCategory] = useState('mens');

  const mensData = [
    { size: 'XS', chest: '86-89', waist: '71-74', hips: '86-89' },
    { size: 'S', chest: '91-94', waist: '76-79', hips: '91-94' },
    { size: 'M', chest: '97-102', waist: '81-86', hips: '97-102' },
    { size: 'L', chest: '107-112', waist: '91-97', hips: '107-112' },
    { size: 'XL', chest: '117-122', waist: '102-107', hips: '117-122' },
    { size: '2XL', chest: '127-132', waist: '112-117', hips: '127-132' },
  ];

  const womensData = [
    { size: 'XS', chest: '81-84', waist: '61-64', hips: '86-89' },
    { size: 'S', chest: '86-89', waist: '66-69', hips: '91-94' },
    { size: 'M', chest: '91-94', waist: '71-74', hips: '97-100' },
    { size: 'L', chest: '97-102', waist: '79-84', hips: '105-110' },
    { size: 'XL', chest: '107-112', waist: '89-94', hips: '115-120' },
    { size: '2XL', chest: '117-122', waist: '99-104', hips: '125-130' },
  ];

  const babyData = [
    { size: '0-3M', age: '0-3 months', height: '50-62', weight: '3-6' },
    { size: '3-6M', age: '3-6 months', height: '62-68', weight: '6-8' },
    { size: '6-9M', age: '6-9 months', height: '68-74', weight: '8-10' },
    { size: '9-12M', age: '9-12 months', height: '74-80', weight: '10-12' },
    { size: '12-18M', age: '12-18 months', height: '80-86', weight: '12-14' },
    { size: '18-24M', age: '18-24 months', height: '86-92', weight: '14-16' },
  ];

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
            <Ruler className="h-8 w-8" />
            Size Guide
          </h1>
          <p className="text-muted-foreground">Find your perfect fit with our comprehensive sizing charts</p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mens">Men's</TabsTrigger>
            <TabsTrigger value="womens">Women's</TabsTrigger>
            <TabsTrigger value="baby">Baby</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>

          <TabsContent value="mens" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Men's Clothing Sizes</CardTitle>
                <p className="text-muted-foreground">All measurements in centimeters (cm)</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Size</th>
                        <th className="text-left p-3 font-medium">Chest</th>
                        <th className="text-left p-3 font-medium">Waist</th>
                        <th className="text-left p-3 font-medium">Hips</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mensData.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 font-medium">{item.size}</td>
                          <td className="p-3">{item.chest} cm</td>
                          <td className="p-3">{item.waist} cm</td>
                          <td className="p-3">{item.hips} cm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="womens" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Women's Clothing Sizes</CardTitle>
                <p className="text-muted-foreground">All measurements in centimeters (cm)</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Size</th>
                        <th className="text-left p-3 font-medium">Bust</th>
                        <th className="text-left p-3 font-medium">Waist</th>
                        <th className="text-left p-3 font-medium">Hips</th>
                      </tr>
                    </thead>
                    <tbody>
                      {womensData.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 font-medium">{item.size}</td>
                          <td className="p-3">{item.chest} cm</td>
                          <td className="p-3">{item.waist} cm</td>
                          <td className="p-3">{item.hips} cm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="baby" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Baby Clothing Sizes</CardTitle>
                <p className="text-muted-foreground">Height in cm, Weight in kg</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Size</th>
                        <th className="text-left p-3 font-medium">Age</th>
                        <th className="text-left p-3 font-medium">Height</th>
                        <th className="text-left p-3 font-medium">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {babyData.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 font-medium">{item.size}</td>
                          <td className="p-3">{item.age}</td>
                          <td className="p-3">{item.height} cm</td>
                          <td className="p-3">{item.weight} kg</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessories" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hat Sizes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>One Size</span>
                      <span>54-58 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adjustable</span>
                      <span>52-60 cm</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bag Dimensions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Small Bag</span>
                      <span>20 x 15 x 8 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium Bag</span>
                      <span>30 x 25 x 12 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Large Bag</span>
                      <span>40 x 35 x 15 cm</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              How to Measure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Chest/Bust</h4>
                <p className="text-sm text-muted-foreground">
                  Measure around the fullest part of your chest, keeping the tape level under your arms and around your back.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Waist</h4>
                <p className="text-sm text-muted-foreground">
                  Measure around your natural waistline, keeping one finger between your body and the measuring tape.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Hips</h4>
                <p className="text-sm text-muted-foreground">
                  Measure around the fullest part of your hips, approximately 20cm below your natural waistline.
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Sizing Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Always measure over light clothing or undergarments</li>
                <li>• Keep the measuring tape snug but not tight</li>
                <li>• For best results, have someone else take your measurements</li>
                <li>• If between sizes, we recommend sizing up for comfort</li>
                <li>• Contact us if you need help choosing the right size</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}