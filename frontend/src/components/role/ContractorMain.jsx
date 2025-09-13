import React from 'react';
import { CardContent, CardHeader, CardDescription, Card, CardTitle } from '@/components/ui/card';
import CreateCTForm from '@/components/form/CreateCTForm';

const ContractorMain = () => {
  return (
    <div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>接取房产任务</CardTitle>
            <CardDescription>
              输入房产ID来接取开发商发布的建筑任务
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateCTForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractorMain;