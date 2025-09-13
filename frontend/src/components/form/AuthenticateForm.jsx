import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Authenticate } from '@/api/Contract';

const AuthenticateForm = () => {
  const [ctId, setCtId] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ctId) {
      toast({
        title: '请输入交易ID',
        description: '请输入要审核的交易ID',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await Authenticate(ctId);
      
      if (result) {
        toast({
          title: '审核成功',
          description: `交易 ${ctId} 已成功审核完成`
        });
        setCtId('');
      } else {
        toast({
          title: '审核失败',
          description: '未找到待审核的交易或交易状态不正确',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '审核失败',
        description: error.message || '审核交易时发生错误',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ctId">交易ID *</Label>
          <Input
            id="ctId"
            name="ctId"
            placeholder="例如: CT2023001"
            value={ctId}
            onChange={(e) => setCtId(e.target.value)}
            required
          />
          <p className="text-sm text-gray-500">
            请输入要审核完成的交易ID
          </p>
        </div>

        <Button type="submit" className="w-full">
          审核交易
        </Button>
      </form>
    </div>
  );
};

export default AuthenticateForm;