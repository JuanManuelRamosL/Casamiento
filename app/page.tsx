"use client";

import { HeroSection } from "@/components/wedding/hero-section";
import { CountdownSection } from "@/components/wedding/countdown-section";
import { OurStorySection } from "@/components/wedding/our-story-section";
import { EventDetailsSection } from "@/components/wedding/event-details-section";
import { QuoteSection } from "@/components/wedding/quote-section";
import { GallerySection } from "@/components/wedding/gallery-section";
import { RsvpSection } from "@/components/wedding/rsvp-section";
import { FooterSection } from "@/components/wedding/footer-section";

export default function WeddingPage() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <CountdownSection />
      {/* <OurStorySection /> */}
      <EventDetailsSection />
      <QuoteSection />
      <GallerySection />
      <RsvpSection />
      <FooterSection />
    </main>
  );
}
