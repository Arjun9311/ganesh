import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import DivineBackground from '@/components/ui/DivineBackground';
import NewUserOnboardingModal from '@/components/modals/NewUserOnboardingModal';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#080B14',
};

export const metadata: Metadata = {
  title: 'Vighnaharta Run — Remove the Obstacles | The 108 Vighnas',
  description: 'An interactive Indian festival 3D endless runner and Hill Climb Racing multi-game arcade where you play as Lord Ganesha, remove 108 Vighnas, conquer sacred mountains, and compete on a live leaderboard.',
  keywords: ['Ganesha', 'Ganesh Chaturthi', 'Endless Runner', 'Hill Climb Racing', 'Vighnaharta', 'Indian Game', '3D Web Game', 'Three.js', 'Festival Game'],
  openGraph: {
    title: 'Vighnaharta Run — Sacred Expeditions of Ganesha',
    description: "Don't avoid obstacles. Remove them. Play as Lord Ganesha in this divine 3D festival endless runner & physics mountain climb racer.",
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DivineBackground />
        <Navbar />
        <main>{children}</main>
        <MobileBottomNav />
        <NewUserOnboardingModal />
      </body>
    </html>
  );
}
