import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ListHeader = ({ title, subtitle, backPath, backTitle }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link to={backPath}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回{backTitle}
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default ListHeader;