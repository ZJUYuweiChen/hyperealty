import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Hammer, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const workbenches = [
    { 
      id: 'developer', 
      name: '开发商工作台', 
      icon: Building, 
      path: '/developer',
      description: '发布房产建筑任务，管理项目进度'
    },
    { 
      id: 'contractor', 
      name: '承包商工作台', 
      icon: Hammer, 
      path: '/contractor',
      description: '接取建筑任务，提交完成请求'
    },
    { 
      id: 'supervisor', 
      name: '监督者工作台', 
      icon: ShieldCheck, 
      path: '/supervisor',
      description: '审核建筑任务完成情况'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            可信建筑任务交易平台
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            基于Hyperledger Fabric的区块链建筑任务管理平台，提升开发商、承包商与监督者之间的交易透明度与信任度
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {workbenches.map((workbench) => {
            const Icon = workbench.icon;
            return (
              <Card key={workbench.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center">
                    <Icon className="h-8 w-8 text-primary mr-3" />
                    <CardTitle>{workbench.name}</CardTitle>
                  </div>
                  <CardDescription>{workbench.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={workbench.path}>
                    <Button className="w-full">
                      进入工作台
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
