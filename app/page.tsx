import HomePageClient from "./HomePageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EKsutra — Apply for government services without repeating documents.",
  description:
    "EkSutra is the interoperability layer connecting citizens, government services and departmental systems.",
  openGraph: {
    description: "EkSutra is the interoperability layer connecting citizens, government services and departmental systems.",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
