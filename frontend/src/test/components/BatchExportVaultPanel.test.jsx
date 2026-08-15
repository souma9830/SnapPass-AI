import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import BatchExportVaultPanel from '../../components/BatchExportVaultPanel';

describe('BatchExportVaultPanel component', () => {
  it('renders batch vault panel', () => {
    render(<BatchExportVaultPanel batchItems={[{ id: '1' }]} />);
    expect(screen.getByTestId('batch-vault-panel')).toBeDefined();
    expect(screen.getByText('Batch Photo Export Archive Vault')).toBeDefined();
    expect(screen.getByText('1 Photos Queued')).toBeDefined();
  });
});
