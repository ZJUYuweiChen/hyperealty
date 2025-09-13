import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CreateCT } from '@/api/Contract';

const CreateCTForm = () => {
  const { toast } = useToast();
  const [realestateId, setRealestateId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!realestateId) {
      toast({
        title: '请输入房产ID',
        description: '请输入要接取的房产任务ID',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await CreateCT(realestateId);
      
      if (result) {
        toast({
          title: '任务接取成功',
          description: `已成功接取房产任务 ${realestateId}，合同ID: ${result.ContractID}`
        });
        setRealestateId('');
      } else {
        toast({
          title: '接取失败',
          description: '接取房产任务时发生错误',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '接取失败',
        description: error.message || '接取房产任务时发生错误',
        variant: 'destructive'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="realestateId">房产ID *</Label>
        <Input
          id="realestateId"
          name="realestateId"
          placeholder="例如: RE001"
          value={realestateId}
          onChange={(e) => setRealestateId(e.target.value)}
          required
        />
        <p className="text-sm text-gray-500">
          请输入开发商提供的房产任务ID
        </p>
      </div>

      <Button type="submit" className="w-full">
        接取任务
      </Button>
    </form>
  );
};

export default CreateCTForm;