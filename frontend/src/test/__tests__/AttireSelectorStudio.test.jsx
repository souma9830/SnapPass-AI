import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AttireSelector from '../../components/AttireSelector';
import AttireManualAdjuster from '../../components/AttireManualAdjuster';

describe('Studio Photo Toolbar Components', () => {
  describe('AttireSelector', () => {
    test('renders attire cards and filters by category', () => {
      const handleChange = jest.fn();
      render(<AttireSelector selected="none" onChange={handleChange} />);

      expect(screen.getByText('Formal Attire')).toBeInTheDocument();
      const maleTab = screen.getByRole('button', { name: 'male' });
      fireEvent.click(maleTab);

      const suitCard = screen.getByTitle(/Formal suit & tie/i);
      expect(suitCard).toBeInTheDocument();
      fireEvent.click(suitCard);
      expect(handleChange).toHaveBeenCalledWith('male_suit');
    });
  });

  describe('AttireManualAdjuster', () => {
    test('renders scale, x, y and rotation sliders', () => {
      const changeScale = jest.fn();
      const changeRotation = jest.fn();

      render(
        <AttireManualAdjuster
          scale={1}
          xOffset={0}
          yOffset={0}
          rotation={0}
          onChangeScale={changeScale}
          onChangeRotation={changeRotation}
        />
      );

      expect(screen.getByText('Scale')).toBeInTheDocument();
      expect(screen.getByText('Rotation Angle')).toBeInTheDocument();
    });
  });
});
