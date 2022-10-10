import {Color} from '../../src/helpers/color-solver';

/* eslint-disable no-undef */

describe('Testing the color translations', () => {
  const colorRgb = [1, 252, 255];
  const colorHsl = {h: 181, l: 50, s: 100};

  it('Converts colors to hsl correctly', () => {
    let color = new Color(...colorRgb);
    expect(color.hsl(...colorRgb)).toEqual(colorHsl);
  })
});
