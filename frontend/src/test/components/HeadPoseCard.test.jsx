import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import HeadPoseCard from '../../components/HeadPoseCard';

describe('HeadPoseCard component', () => {
  const dummyLandmarks = new Array(68).fill(null).map(() => ({ x: 100, y: 100 }));
  dummyLandmarks[36] = { x: 50, y: 50 };
  dummyLandmarks[45] = { x: 150, y: 50 };
  dummyLandmarks[30] = { x: 100, y: 90 };
  dummyLandmarks[8] = { x: 100, y: 170 };

  it('renders correctly with landmark data', () => {
    render(<HeadPoseCard landmarks={dummyLandmarks} />);
    expect(screen.getByTestId('head-pose-card')).toBeDefined();
    expect(screen.getByText('ICAO Head Pose Orientation')).toBeDefined();
  });
});
