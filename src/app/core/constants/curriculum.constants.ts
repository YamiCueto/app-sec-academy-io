export interface ModuleMeta {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly lessonIds: readonly string[];
}

export const CURRICULUM_MODULES: readonly ModuleMeta[] = [
  {
    id: 'm01',
    code: 'M01',
    title: 'Fundamentos OWASP Top 10',
    lessonIds: ['1.1', '1.2', '1.3', '1.4']
  },
  {
    id: 'm02',
    code: 'M02',
    title: 'Secure Coding & Defensas',
    lessonIds: ['2.1', '2.2', '2.3', '2.4']
  },
  {
    id: 'm03',
    code: 'M03',
    title: 'API Security & REST Hardening',
    lessonIds: ['3.1', '3.2', '3.3', '3.4']
  },
  {
    id: 'm04',
    code: 'M04',
    title: 'Vulnerability Management & CVSS',
    lessonIds: ['4.1', '4.2', '4.3']
  },
  {
    id: 'm05',
    code: 'M05',
    title: 'Software Supply Chain Security',
    lessonIds: ['5.1', '5.2', '5.3']
  },
  {
    id: 'm06',
    code: 'M06',
    title: 'Cloud Security & IAM',
    lessonIds: ['6.1', '6.2', '6.3']
  },
  {
    id: 'm07',
    code: 'M07',
    title: 'Container & Kubernetes Security',
    lessonIds: ['7.1', '7.2', '7.3']
  },
  {
    id: 'm08',
    code: 'M08',
    title: 'Identity, OAuth 2.1 & Session Management',
    lessonIds: ['8.1', '8.2', '8.3', '8.4']
  },
  {
    id: 'm09',
    code: 'M09',
    title: 'Threat Modeling & STRIDE',
    lessonIds: ['9.1', '9.2', '9.3', '9.4']
  },
  {
    id: 'm10',
    code: 'M10',
    title: 'Applied Cryptography',
    lessonIds: ['10.1', '10.2', '10.3', '10.4']
  },
  {
    id: 'm11',
    code: 'M11',
    title: 'DevSecOps & Policy as Code',
    lessonIds: ['11.1', '11.2', '11.3']
  },
  {
    id: 'm12',
    code: 'M12',
    title: 'CI/CD Pipeline Security',
    lessonIds: ['12.1', '12.2', '12.3']
  },
  {
    id: 'm13',
    code: 'M13',
    title: 'Application Security Testing (AST)',
    lessonIds: ['13.1', '13.2', '13.3', '13.4']
  },
  {
    id: 'm14',
    code: 'M14',
    title: 'AI & LLM Security',
    lessonIds: ['14.1', '14.2', '14.3']
  }
];

export const TOTAL_CURRICULUM_LESSONS = CURRICULUM_MODULES.reduce(
  (total, mod) => total + mod.lessonIds.length,
  0
);
