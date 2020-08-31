import React from 'react';
import { shallow } from 'enzyme';
import styled, {
  supersetTheme,
  SupersetThemeProps,
  useTheme,
  ThemeProvider,
  SupersetTheme,
} from '../src';

describe('@superset-ui/style package', () => {
  it('exports a theme', () => {
    expect(typeof supersetTheme).toBe('object');
  });

  it('exports styled component templater', () => {
    expect(typeof styled.div).toBe('function');
  });

  it('exports SupersetThemeProps', () => {
    const props: SupersetThemeProps = {
      theme: supersetTheme,
    };
    expect(typeof props).toBe('object');
  });

  describe('useTheme()', () => {
    let theme: SupersetTheme | null = null;
    it('returns the theme', () => {
      function ThemeUser() {
        theme = useTheme();
        return <div>test</div>;
      }
      shallow(
        <ThemeProvider theme={supersetTheme}>
          <ThemeUser />
        </ThemeProvider>,
      );
      expect(theme).toBe(supersetTheme);
    });

    it('throws when a theme is not present', () => {
      function ThemeUser() {
        expect(useTheme).toThrow(/could not find a ThemeContext/);
        return <div>test</div>;
      }
      shallow(<ThemeUser />);
    });
  });
});
