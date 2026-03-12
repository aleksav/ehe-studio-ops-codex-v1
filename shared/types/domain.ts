export const projectStatuses = ['PLANNED', 'ACTIVE', 'COMPLETED', 'ARCHIVED'] as const;
export const taskStatuses = ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'] as const;
export const budgetTypes = ['NONE', 'CAPPED', 'TRACKED_ONLY'] as const;
export const auditActions = ['CREATE', 'UPDATE', 'DELETE'] as const;
export const taskTypes = [
  'ARCHITECTURE_ENGINEERING_DIRECTION',
  'DESIGN_DELIVERY_RESEARCH',
  'DEVELOPMENT_TESTING',
  'BUSINESS_SUPPORT',
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];
export type TaskStatus = (typeof taskStatuses)[number];
export type BudgetType = (typeof budgetTypes)[number];
export type AuditAction = (typeof auditActions)[number];
export type TaskType = (typeof taskTypes)[number];

