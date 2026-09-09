import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EventModal } from './components/EventModal';
import { DonationModal } from './components/DonationModal';
import { OhelModal } from './components/OhelModal';
import { AudioPlayerWidget } from './components/AudioPlayerWidget';
import { PushNotificationPrompt } from './components/PushNotificationPrompt';
import { DailyNoticeNotification } from './components/DailyNoticeNotification';
import { PushkaModal } from './components/PushkaModal';

// Pages
import { Home } from './pages/Home';
import { QuemSomos } from './pages/QuemSomos';
import { ORebe } from './pages/ORebe';
import { MitzvotCampaigns } from './pages/MitzvotCampaigns';
import { ChabadMundoOhel } from './pages/ChabadMundoOhel';
import { Sinagoga } from './pages/Sinagoga';
import { Mikve } from './pages/Mikve';
import { Ganenu } from './pages/Ganenu';
import { KiTov } from './pages/KiTov';
import { MezuzotTefilin } from './pages/MezuzotTefilin';
import { Colel } from './pages/Colel';
import { Biblioteca } from './pages/Biblioteca';
import { Juventude } from './pages/Juventude';
import { EventsPage } from './pages/EventsPage';
import { RsvpPage } from './pages/RsvpPage';
import { YahrtzeitPage } from './pages/YahrtzeitPage';
import { CuritibaInfo } from './pages/CuritibaInfo';
import { FotosRevista } from './pages/FotosRevista';
import { FaleConosco } from './pages/FaleConosco';
import { AdminPanel } from './pages/AdminPanel';
import { TzedakaPage } from './pages/TzedakaPage';

import { CommunityEvent } from './types';
import { fetchRemoteEvents, fetchRemoteRsvps, fetchRemoteDonations } from './utils/cloudSync';

export const App: React.FC = () => {
  // Sync state with URL hash for easy navigation and bookmarking
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  };

  const [currentPage, setCurrentPage] = useState<string>(getInitialPage());
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [ohelModalOpen, setOhelModalOpen] = useState(false);
  const [pushkaModalOpen, setPushkaModalOpen] = useState(false);

  useEffect(() => {
    // Background cloud sync for all devices & incognito
    fetchRemoteEvents().catch(() => {});
    fetchRemoteRsvps().catch(() => {});
    fetchRemoteDonations().catch(() => {});

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setCurrentPage(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEvent = (event: CommunityEvent) => {
    setSelectedEvent(event);
    handleNavigate('rsvp');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            onOpenDonate={() => setDonationModalOpen(true)}
            onOpenOhel={() => setOhelModalOpen(true)}
            onOpenPushka={() => setPushkaModalOpen(true)}
          />
        );
      case 'quem-somos':
        return <QuemSomos onNavigate={handleNavigate} onOpenDonate={() => setDonationModalOpen(true)} />;
      case 'o-rebe':
        return <ORebe onNavigate={handleNavigate} onOpenOhel={() => setOhelModalOpen(true)} />;
      case 'campanha-mitsvot':
        return <MitzvotCampaigns onNavigate={handleNavigate} onOpenDonate={() => setDonationModalOpen(true)} />;
      case 'chabad-mundo-ohel':
        return <ChabadMundoOhel onOpenOhel={() => setOhelModalOpen(true)} onOpenDonate={() => setDonationModalOpen(true)} />;
      case 'sinagoga':
        return <Sinagoga onNavigate={handleNavigate} onOpenDonate={() => setDonationModalOpen(true)} />;
      case 'mikve':
        return <Mikve />;
      case 'ganenu':
        return <Ganenu />;
      case 'kitov':
        return <KiTov />;
      case 'mezuzot-tefilin':
        return <MezuzotTefilin />;
      case 'colel':
        return <Colel />;
      case 'biblioteca':
        return <Biblioteca />;
      case 'juventude':
        return <Juventude />;
      case 'eventos':
        return <EventsPage onSelectEvent={handleSelectEvent} />;
      case 'rsvp':
        return (
          <RsvpPage 
            selectedEvent={selectedEvent} 
            onSelectEvent={setSelectedEvent} 
            onNavigate={handleNavigate} 
          />
        );
      case 'yahrtzeit':
        return <YahrtzeitPage />;
      case 'curitiba-info':
        return <CuritibaInfo />;
      case 'fotos-revista':
        return <FotosRevista />;
      case 'fale-conosco':
        return <FaleConosco />;
      case 'tzedaka':
        return <TzedakaPage />;
      case 'admin':
        return <AdminPanel />;
      default:
        return (
          <Home
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            onOpenDonate={() => setDonationModalOpen(true)}
            onOpenOhel={() => setOhelModalOpen(true)}
            onOpenPushka={() => setPushkaModalOpen(true)}
          />
        );
    }
  };

  const hideHeaderFooter = currentPage === 'eventos' || currentPage === 'rsvp';

  return (
    <div className="min-h-screen flex flex-col bg-chabad-warm text-slate-800 antialiased font-sans">
      
      {/* Navbar */}
      {!hideHeaderFooter && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenDonate={() => setDonationModalOpen(true)}
          onOpenPushka={() => setPushkaModalOpen(true)}
        />
      )}

      {/* Main Page Content */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      {!hideHeaderFooter && (
        <Footer
          onNavigate={handleNavigate}
          onOpenDonate={() => setDonationModalOpen(true)}
          onOpenPushka={() => setPushkaModalOpen(true)}
        />
      )}

      {/* Pushka / e-Tsedacá Modal */}
      <PushkaModal
        isOpen={pushkaModalOpen}
        onClose={() => setPushkaModalOpen(false)}
        onOpenDonate={() => {
          setPushkaModalOpen(false);
          setDonationModalOpen(true);
        }}
      />

      {/* Donation Modal */}
      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
      />

      {/* Ohel / Pan Modal */}
      <OhelModal
        isOpen={ohelModalOpen}
        onClose={() => setOhelModalOpen(false)}
      />

      {/* Floating Audio Niggunim Player */}
      {!hideHeaderFooter && <AudioPlayerWidget />}

      {/* Push Notification One-Time Permission Prompt */}
      <PushNotificationPrompt />

      {/* Daily Notice / Shabbat Alert on Site Open with X button */}
      <DailyNoticeNotification onNavigate={handleNavigate} />

    </div>
  );
};
