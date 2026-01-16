import { BugReportService } from '../src/services/BugReportService';

describe('BugReportService', () => {
  it('stores submitted bug reports', async () => {
    const report = await BugReportService.submitReport({
      category: 'ui',
      description: 'Button overlaps content',
      severity: 'low',
      allowLogs: false,
      includeMetadata: false,
      isAnonymous: true,
    });

    const list = await BugReportService.listReports();
    expect(list.find((item) => item.id === report.id)).toBeTruthy();
  });
});
