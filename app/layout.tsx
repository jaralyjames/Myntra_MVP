import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';
import { Toast } from '@/components/Toast';
import { SimulatePriceDropButton } from '@/components/SimulatePriceDropButton';
import { PriceDropModal } from '@/components/PriceDropModal';

export const metadata: Metadata = {
  title: 'Myntra MVP — Fashion Store & Price Drop Simulation',
  description: 'Experience Myntra fashion catalogue with automated wishlist price drop alerts, dynamic bag calculations, and custom discount engine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafafa]">
        <ShopProvider>
          <Toast />
          {children}
          <SimulatePriceDropButton />
          <PriceDropModal />
        </ShopProvider>
      </body>
    </html>
  );
}
