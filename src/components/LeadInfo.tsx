
import { User, Phone, Mail, Building, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LeadInfoProps {
  leadData: any;
  isConnected: boolean;
  onConnect: () => void;
}

const LeadInfo = ({ leadData, isConnected, onConnect }: LeadInfoProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getPhoneNumber = () => {
    return leadData?.PHONE?.[0]?.VALUE || 'No phone number';
  };

  const getEmail = () => {
    return leadData?.EMAIL?.[0]?.VALUE || 'No email';
  };

  const getFullName = () => {
    const firstName = leadData?.NAME || '';
    const lastName = leadData?.LAST_NAME || '';
    return `${firstName} ${lastName}`.trim() || leadData?.TITLE || 'Unknown';
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">WhatsApp Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isConnected ? (
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Connected</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Not Connected</span>
              </div>
              <Button 
                onClick={onConnect}
                size="sm"
                className="w-full"
              >
                Connect WhatsApp
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Information */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Lead Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Name */}
          <div className="flex items-start space-x-3">
            <User className="w-4 h-4 text-gray-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {getFullName()}
              </p>
              <p className="text-xs text-gray-500">Full Name</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start space-x-3">
            <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 font-mono">
                {getPhoneNumber()}
              </p>
              <p className="text-xs text-gray-500">Phone Number</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start space-x-3">
            <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 break-all">
                {getEmail()}
              </p>
              <p className="text-xs text-gray-500">Email</p>
            </div>
          </div>

          {/* Company */}
          {leadData?.COMPANY_TITLE && (
            <div className="flex items-start space-x-3">
              <Building className="w-4 h-4 text-gray-500 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {leadData.COMPANY_TITLE}
                </p>
                <p className="text-xs text-gray-500">Company</p>
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-start space-x-3">
            <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                {formatDate(leadData?.DATE_CREATE)}
              </p>
              <p className="text-xs text-gray-500">Created</p>
            </div>
          </div>

          {/* Lead ID */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Lead ID: {leadData?.ID}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadInfo;
