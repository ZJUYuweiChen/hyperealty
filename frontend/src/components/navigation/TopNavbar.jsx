import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building, Hammer, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TopNavbar = () => {
  const location = useLocation();
  
  const workbenches = [
    { id: 'developer', name: '开发商工作台', icon: Building, path: '/developer' },
    { id: 'contractor', name: '承包商工作台', icon: Hammer, path: '/contractor' },
    { id: 'supervisor', name: '监督者工作台', icon: ShieldCheck, path: '/supervisor' },
  ];

  const isActiveWorkbench = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-800">
              可信建筑
            </Link>
            
            <div className="flex space-x-2">
              {workbenches.map((workbench) => {
                const Icon = workbench.icon;
                return (
                  <Button
                    key={workbench.id}
                    variant={isActiveWorkbench(workbench.path) ? "default" : "ghost"}
                    asChild
                  >
                    <Link to={workbench.path} className="flex items-center">
                      <Icon className="mr-2 h-4 w-4" />
                      {workbench.name}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {workbenches.find(wb => isActiveWorkbench(wb.path))?.name || '首页'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
