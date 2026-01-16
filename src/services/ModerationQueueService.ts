import type { ReportItem } from '../types';
import { ReportService } from './ReportService';
import { mockDelay } from './mockDelay';

export const ModerationQueueService = {
  async fetchQueue(): Promise<ReportItem[]> {
    await mockDelay(200);
    // TODO: replace with backend moderation system.
    return ReportService.getReports();
  },
  async assignReport(reportId: string, moderator: string): Promise<ReportItem | null> {
    await mockDelay(140);
    // TODO: replace with backend moderation system.
    return ReportService.updateReportStatus(reportId, 'in_review', undefined, moderator);
  },
  async resolveReport(reportId: string, note: string): Promise<ReportItem | null> {
    await mockDelay(140);
    // TODO: replace with backend moderation system.
    return ReportService.updateReportStatus(reportId, 'resolved', note);
  },
};
