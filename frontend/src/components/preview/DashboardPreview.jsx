import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, FileText, LinkIcon } from 'lucide-react';
import RealestatePreview from '@/components/preview/RealestatePreview';
import ContractPreview from '@/components/preview/ContractPreview';
import BlockPreview from '@/components/preview/BlockPreview';

const DashboardPreview = ({ role }) => {
  const getRoutePrefix = () => {
    switch (role) {
      case 'developer':
        return '/developer';
      case 'contractor':
        return '/contractor';
      case 'supervisor':
        return '/supervisor';
      default:
        return '';
    }
  };

  const routePrefix = getRoutePrefix();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            房产状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RealestatePreview viewAllRoute={`${routePrefix}/realestate/list`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            交易状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ContractPreview viewAllRoute={`${routePrefix}/contract/list`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LinkIcon className="mr-2 h-5 w-5" />
            区块状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BlockPreview viewAllRoute={`${routePrefix}/block/list`} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPreview;