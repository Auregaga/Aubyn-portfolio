// src/data/types.ts

export interface Profile {
  name: string;
  nameEn?: string;
  title: string;
  status: string;
  tagline: TaglineConfig;
  avatar: string;
  bio?: string;
  bioParagraphs?: string[];
  contact: ContactInfo;
  highlights: Highlight[];
}

export interface TaglineConfig {
  lines: TaglineLine[];
}

export interface TaglineLine {
  text: string;
  variant: 'primary' | 'tertiary';
}

export interface ContactInfo {
  email: string;
  wechat: string;
  phone: string;
  github: string;
  xiaohongshu: string;
}

export interface Highlight {
  id: string;
  icon?: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  period: string;
  tags: string[];
  description: string;
  outcome: string;
  link?: string;
  images?: string[];
}

// Projects 展示页（TOOLS 风格）
export interface ShowcaseProject {
  id: string;
  name: string;
  description: string;
  mediaType: 'image' | 'video' | 'gif' | 'canvas';
  mediaSrc: string;
  mediaLayout: 'left-large' | 'right-large' | 'center';
  hasStaircase: boolean;
  scrollNum: number;
  link?: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  period: string;
  description: string;
  achievements: string[];
  logo?: string;
}

// Internship 展示页（WORK 风格）
export interface Internship {
  id: string;
  number: string;
  company: string;
  position: string;
  period: string;
  summary: string;
  achievements: string[];
  image: string;
  link?: string;
}

export interface SkillCategory {
  key: string;
  label: string;
  items: SkillItem[];
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface LifePost {
  id: string;
  title: string;
  image: string;
  author: string;
  avatar: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface PortfolioData {
  profile: Profile;
  navigation: NavItem[];
  projects: Project[];
  showcaseProjects: ShowcaseProject[];
  experiences: Experience[];
  internships: Internship[];
  skills: SkillCategory[];
  lifePosts: LifePost[];
}
