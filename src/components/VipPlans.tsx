'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useStore from '@/store/useStore';

const plans = [
  {
    id: 'month',
    name: '月度会员',
    price: '12.9',
    features: ['无限使用次数', '每日登录奖励', '优先客服支持']
  },
  {
    id: 'quarter',
    name: '季度会员',
    price: '29.9',
    features: ['无限使用次数', '每日登录奖励', '优先客服支持', '季度专属礼包']
  },
  {
    id: 'year',
    name: '年度会员',
    price: '99.9',
    features: ['无限使用次数', '每日登录奖励', '优先客服支持', '年度专属礼包', '生日特权']
  }
];

export default function VipPlans() {
  const [loading, setLoading] = useState(false);
  const { user } = useStore();

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error('请先登录');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payment/vip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          plan: planId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success('VIP 开通成功');
    } catch (error: any) {
      toast.error(error.message || '支付失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="bg-gray-800 rounded-xl p-6 flex flex-col space-y-4 hover:scale-105 transition-transform duration-300"
        >
          <h3 className="text-2xl font-bold text-center text-white">{plan.name}</h3>
          <p className="text-center text-3xl font-bold text-blue-500">
            ¥{plan.price}
            <span className="text-sm text-gray-400">
              /{plan.id === 'month' ? '月' : plan.id === 'quarter' ? '季' : '年'}
            </span>
          </p>
          <ul className="flex-grow space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe(plan.id)}
            disabled={loading}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? '处理中...' : '立即开通'}
          </button>
        </div>
      ))}
    </div>
  );
} 