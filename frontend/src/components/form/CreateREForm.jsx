import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { CreateRE } from '@/api/Realestate';

const CreateREForm = ({ onTaskCreated }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    address: '',
    area: '',
    payment: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.address || !formData.area || !formData.payment) {
      toast({
        title: '表单验证失败',
        description: '请填写所有必填字段',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await CreateRE(
        formData.address,
        parseFloat(formData.area),
        parseFloat(formData.payment)
      );

      toast({
        title: '房产任务发布成功',
        description: `您的房产任务已成功发布到区块链网络，ID: ${result.REID}`
      });

      setFormData({
        address: '',
        area: '',
        payment: ''
      });

      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (error) {
      toast({
        title: '发布失败',
        description: error.message || '发布房产任务时发生错误',
        variant: 'destructive'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="address">房产地址 *</Label>
        <Textarea
          id="address"
          name="address"
          placeholder="请输入详细的房产地址"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="area">建筑面积 (㎡) *</Label>
          <Input
            id="area"
            name="area"
            type="number"
            placeholder="120"
            value={formData.area}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment">报酬金额 (元) *</Label>
          <Input
            id="payment"
            name="payment"
            type="number"
            placeholder="500000"
            value={formData.payment}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        发布房产任务
      </Button>
    </form>
  );
};

export default CreateREForm;