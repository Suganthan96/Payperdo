"use client";

import Link from "next/link";
import { GL } from "./gl";
import { Pill } from "./pill";
import { Button } from "./ui/button";
import { useState } from "react";
import { usePayperdoWallet } from "@/hooks/useRealPayperdoWallet";

export function Hero() {
  const [hovering, setHovering] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const { createConsumerWallet, createBusinessWallet, ready } = usePayperdoWallet();

  const handleConsumerClick = async () => {
    if (!ready) return;
    
    setIsCreatingWallet(true);
    try {
      const result = await createConsumerWallet();
      if (result.success) {
        console.log('🎉 Consumer wallet created!', result.wallet?.address);
      } else {
        console.error('Failed to create consumer wallet:', result.error);
        // Silent error handling - the Privy modal will handle user feedback
      }
    } catch (error) {
      console.error('Error creating consumer wallet:', error);
      // Silent error handling - let Privy handle the user experience
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const handleBusinessClick = async () => {
    if (!ready) return;
    
    setIsCreatingWallet(true);
    try {
      const result = await createBusinessWallet();
      if (result.success) {
        console.log('🏢 Business wallet created!', result.wallet?.address);
      } else {
        console.error('Failed to create business wallet:', result.error);
        // Silent error handling - the Privy modal will handle user feedback
      }
    } catch (error) {
      console.error('Error creating business wallet:', error);
      // Silent error handling - let Privy handle the user experience
    } finally {
      setIsCreatingWallet(false);
    }
  };
  return (
    <div className="flex flex-col h-svh justify-between">
      <GL hovering={hovering} />

      <div className="pb-16 mt-auto text-center relative">
        <Pill className="mb-6">BETA RELEASE</Pill>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient">
          Earn money <br />
          <i className="font-light">instantly</i>
        </h1>
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-8 max-w-[440px] mx-auto">
          Complete simple tasks on your phone and get paid instantly via x402
        </p>

        <div className="flex gap-4 justify-center mt-14 max-sm:hidden">
          <Button
            onClick={handleConsumerClick}
            disabled={isCreatingWallet || !ready}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {isCreatingWallet ? '[Creating Wallet...]' : '[For Consumers]'}
          </Button>
          <Button
            onClick={handleBusinessClick}
            disabled={isCreatingWallet || !ready}
            className="bg-background border-primary text-white [&>[data-border]]:bg-primary"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {isCreatingWallet ? '[Creating Wallet...]' : '[For Business]'}
          </Button>
        </div>

        <div className="flex flex-col gap-3 items-center mt-14 sm:hidden">
          <Button
            size="sm"
            onClick={handleConsumerClick}
            disabled={isCreatingWallet || !ready}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {isCreatingWallet ? '[Creating...]' : '[For Consumers]'}
          </Button>
          <Button
            size="sm"
            onClick={handleBusinessClick}
            disabled={isCreatingWallet || !ready}
            className="bg-background border-primary text-white [&>[data-border]]:bg-primary"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {isCreatingWallet ? '[Creating...]' : '[For Business]'}
          </Button>
        </div>
      </div>
    </div>
  );
}
