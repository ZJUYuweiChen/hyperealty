import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CreateREForm from '@/components/form/CreateREForm';

const DeveloperMain = () => {
  return (
    <div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>发布新的房产任务</CardTitle>
            <CardDescription>
              填写房产信息并发布到区块链网络，等待承包商接取
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateREForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeveloperMain;