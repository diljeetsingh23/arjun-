export interface Memory {
  id: string;
  emoji: string;
  title: string;
  description: string;
  date?: string;
}

export interface Coupon {
  id: string;
  title: string;
  description: string;
  emoji: string;
  code: string;
  redeemed: boolean;
}

export interface PromiseItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  status: 'pending' | 'promised' | 'fulfilled';
}

export interface MessageCard {
  id: string;
  message: string;
  category: 'sincere' | 'sweet' | 'promise' | 'funny';
}
