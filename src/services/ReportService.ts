import type { ReportItem, ReportReason } from '../types';
import { mockDelay } from './mockDelay';

let reports: ReportItem[] = [];

export const ReportService = {
  async submitReport(report: Omit<ReportItem, 'id' | 'createdAt' | 'status'>): Promise<ReportItem> {
    await mockDelay(200);
    // TODO: replace with backend moderation system.
    const next: ReportItem = {
      ...report,
      id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    reports = [next, ...reports];
    return next;
  },
  async getReports(): Promise<ReportItem[]> {
    await mockDelay(200);
    // TODO: replace with backend moderation system.
    return [...reports];
  },
  async updateReportStatus(
    reportId: string,
    status: ReportItem['status'],
    resolutionNote?: string,
    assignedModerator?: string
  ): Promise<ReportItem | null> {
    await mockDelay(200);
    // TODO: replace with backend moderation system.
    let updated: ReportItem | null = null;
    reports = reports.map((item) => {
      if (item.id !== reportId) return item;
      updated = { ...item, status, resolutionNote, assignedModerator };
      return updated;
    });
    return updated;
  },
  async getReasons(): Promise<ReportReason[]> {
    await mockDelay(80);
    return ['spam', 'harassment', 'nsfw', 'misinformation', 'impersonation', 'other'];
  },
};
