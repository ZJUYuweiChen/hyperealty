import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthenticateForm from '@/components/form/AuthenticateForm';

const SupervisorMain = () => {
  return (
    <div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>审核房产交易</CardTitle>
            <CardDescription>
              承包商已提交完成请求，等待您的审核
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthenticateForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupervisorMain;