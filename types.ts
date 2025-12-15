import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface MetricCardProps {
  label: string;
  value: string;
  subtext: string;
  trend?: 'up' | 'down' | 'neutral';
}

export enum Section {
  HERO = 'hero',
  ARCH = 'architecture',
  DATA = 'data',
  TRANSPORT = 'transport',
  CONTROL = 'control',
  CHAT = 'chat'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}