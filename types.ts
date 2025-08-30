
export interface User {
  name: string;
  avatarUrl: string;
}

export type Platform = 'VK' | 'Telegram' | 'Facebook' | 'YouDo';

export interface Post {
  id: string;
  platform: Platform;
  category: string;
  postDate: string;
  user: User;
  message: string;
  city: string;
  postUrl: string;
}
