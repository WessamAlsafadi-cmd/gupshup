
import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatInterface from './components/ChatInterface';
import LoadingSpinner from './components/LoadingSpinner';
import ConnectWhatsAppModal from './components/ConnectWhatsAppModal';
import { installTenant } from './utils/api';

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [leadData, setLeadData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    // Initialize Bitrix24 SDK
    if (window.BX24) {
      window.BX24.init(async () => {
        try {
          // Get Bitrix24 install data (simulate for now)
          const installData = window.BX24.getAuth ? window.BX24.getAuth() : {};
          installData.DOMAIN = window.location.hostname;
          // Call backend to install tenant
          const result = await installTenant(installData);
          setTenantId(result.tenant_id);
          localStorage.setItem('tenant_id', result.tenant_id);
          // Get current lead ID from URL or placement
          const placement = window.BX24.placement.info();
          let leadId = null;
          if (placement && placement.options && placement.options.ID) {
            leadId = placement.options.ID;
          } else {
            const urlParams = new URLSearchParams(window.location.search);
            leadId = urlParams.get('leadId') || urlParams.get('id');
          }
          if (leadId) {
            window.BX24.callMethod('crm.lead.get', { id: leadId }, (result: any) => {
              if (result.error()) {
                setError('Failed to load lead data');
              } else {
                setLeadData(result.data());
              }
              setIsLoading(false);
            });
          } else {
            setError('No lead ID found. Please open this app from a lead in Bitrix24.');
            setIsLoading(false);
          }
        } catch (error) {
          setError('Failed to initialize the application. Please try refreshing the page.');
          setIsLoading(false);
        }
      });
    } else {
      setError('This application must be run within Bitrix24. Please open it from your Bitrix24 CRM.');
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-gray-50">
          <ChatInterface 
            leadData={leadData}
            tenantId={tenantId}
            onShowConnectModal={() => setShowConnectModal(true)}
          />
          <ConnectWhatsAppModal 
            isOpen={showConnectModal}
            onClose={() => setShowConnectModal(false)}
            tenantId={tenantId}
          />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
