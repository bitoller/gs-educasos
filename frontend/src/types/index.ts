export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Content {
  id: number;
  title: string;
  description: string;
  disasterType: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Kit {
  id: number;
  houseType: string;
  residents: number;
  hasChildren: boolean;
  hasElderly: boolean;
  hasPets: boolean;
  region: string;
  items: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface RiskMap {
  id: number;
  region: string;
  riskLevel: 'baixo' | 'médio' | 'alto';
  commonDisasters: string[];
  safetyTips: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
} 