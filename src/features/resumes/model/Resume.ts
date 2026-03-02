export type ResumeBasics = {
  firstName: string;
  lastName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
};

export type ResumeExperience = {
  id: string;
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export type ResumeEducation = {
  id: string;
  school: string;
  degree: string;
  location: string;
  start: string;
  end: string;
  details: string;
};

export type ResumeProject = {
  id: string;
  name: string;
  link: string;
  details: string;
  bullets: string[];
};

export type ResumeSkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export type Resume = {
  id: string;
  createdAt: number;
  updatedAt: number;
  title: string;
  templateId: string;
  basics: ResumeBasics;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkillGroup[];
};
