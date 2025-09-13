import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NoDataCard = ({ icon: Icon, title, description, backPath, backTitle }) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        {Icon && <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Button asChild>
          <Link to={backPath}>
            {backTitle || '返回工作台'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default NoDataCard;