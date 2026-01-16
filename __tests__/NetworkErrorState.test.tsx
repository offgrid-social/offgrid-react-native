import React from 'react';
import { render } from '@testing-library/react-native';

import { NetworkErrorState } from '../src/components/NetworkErrorState';

describe('NetworkErrorState', () => {
  it('renders skeleton cards without collapsing layout', () => {
    const { getAllByTestId, getByText } = render(
      <NetworkErrorState variant="text" onRetry={() => {}} onReportBug={() => {}} />
    );

    expect(getByText('Network issue')).toBeTruthy();
    expect(getAllByTestId('network-error-text-card').length).toBe(4);
  });
});
