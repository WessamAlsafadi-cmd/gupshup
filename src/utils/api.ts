
import { Message } from '../components/ChatInterface';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Fetch messages for a tenant
export const fetchMessages = async (tenantId: string, toNumber?: string) => {
  const url = new URL(`${API_BASE_URL}/messages`);
  url.searchParams.append('tenant_id', tenantId);
  if (toNumber) url.searchParams.append('to_number', toNumber);
  const response = await fetch(url.toString());
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch messages');
  return data.messages;
};

// Send a message for a tenant
export const sendMessage = async (params: { tenantId: string; toNumber: string; message: string }) => {
  const response = await fetch(`${API_BASE_URL}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenant_id: params.tenantId,
      to_number: params.toNumber,
      message: params.message
    })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to send message');
  return data;
};

// Setup WhatsApp phone for a tenant
export const setupPhone = async (params: { tenantId: string; phoneNumber: string; setupType: 'existing' | 'new' }) => {
  const response = await fetch(`${API_BASE_URL}/setup/${params.tenantId}/phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone_number: params.phoneNumber,
      setup_type: params.setupType
    })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to setup phone');
  return data;
};

// Install a new tenant (Bitrix24 install)
export const installTenant = async (installData: any) => {
  console.log('🔗 Backend API URL:', API_BASE_URL);
  const response = await fetch(`${API_BASE_URL}/bitrix24/install`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(installData)
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to install tenant');
  return data;
};
