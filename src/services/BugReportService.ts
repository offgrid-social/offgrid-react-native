import type { BugReport } from '../types';
import { mockDelay } from './mockDelay';

let bugReports: BugReport[] = [];

export const BugReportService = {
  async submitReport(report: Omit<BugReport, 'id' | 'createdAt'>): Promise<BugReport> {
    await mockDelay(160);
    // TODO: backend hook - submit bug report to bug_report collection.
    const saved: BugReport = {
      ...report,
      id: `bug_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    bugReports = [saved, ...bugReports];
    return saved;
  },
  async listReports(): Promise<BugReport[]> {
    await mockDelay(120);
    // TODO: backend hook - fetch bug reports.
    return [...bugReports];
  },
};
