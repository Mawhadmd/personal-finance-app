'use client'
import { motion } from 'framer-motion';
import { Shield, Play, Gift } from 'lucide-react';
import React from 'react'
import Card from './card';

export default function CardsSection() {
    const cardData = [
    {
      id: 1,
      content: "Our platform offers a user-friendly interface, powerful budgeting tools, and real-time insights to help you manage your finances effectively.",
      title: "Why Choose Us?",
      icon: <Shield className="size-8 text-accent" />,
      iconBg: "bg-accent/20"
    },
    {
      id: 2,
      content: "Sign up for free, connect your bank accounts, and start tracking your expenses. Set budgets, receive alerts, and visualize your financial health with our intuitive dashboard.",
      title: "How it Works",
      icon: <Play className="size-8 text-blue-500" />,
      iconBg: "bg-blue-500/20"
    },
    {
      id: 3,
      content: "Experience the freedom of managing your finances without any cost. Our platform is designed to be accessible to everyone, ensuring you can focus on your financial goals.",
      title: "It's Free",
      icon: <Gift className="size-8 text-green-500" />,
      iconBg: "bg-green-500/20"
    }
  ];
  return (
    <div className="flex items-center justify-center my-20 gap-10 z-10" id="features">
        {cardData.map((card) => (
          <motion.div 
          id={`feature-${card.id}`} 
          key={card.id} 
          initial='hidden'
          
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.3, delay: 0.3 * card.id  }}
            variants={{
                visible: { opacity: 1, transform: 'translateY(0)' },
                hidden: { opacity: 0, transform: 'translateY(-60px)' }
            }}
          ><Card
            Content={card.content}
            title={card.title}
            icon={card.icon}
            iconBg={card.iconBg}
          /></motion.div>
        ))}
       
      </div>
  )
}
