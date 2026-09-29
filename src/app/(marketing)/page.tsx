import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { GroupsStory } from "@/components/home/GroupsStory";
import { EventsStory } from "@/components/home/EventsStory";
import { DiscoverStory } from "@/components/home/DiscoverStory";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { FaqSection } from "@/components/home/FaqSection";
import { DownloadCta } from "@/components/home/DownloadCta";

export const metadata = {
  title: "EventUally — Make Plans. Find People. Actually Go.",
  description:
    "EventUally helps you discover events, join groups, plan with friends and turn ideas into real moments without messy group chats.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <GroupsStory />
      <EventsStory />
      <DiscoverStory />
      <FeatureGrid />
      <FaqSection />
      <DownloadCta />
    </>
  );
}
