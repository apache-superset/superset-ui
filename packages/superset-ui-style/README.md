# `style`

Provides a style object containing a variety of style parameters for theming Superset components with Emotion. See [SIP-37](https://github.com/apache/incubator-superset/issues/9123) for additional context. This will eventually allow for custom themes to override default Superset styles. These parameters (and the styled-components/emotion design pattern) will, over time, be used to whittle away at widely-scoped LESS styles, making it easier to build and (re)style Superset components.

## Usage

```
import { ThemeProvider } from 'emotion-theming';
import styled, { supersetTheme } from '@superset-ui/style';

// use emotion api as normal, but the theme uses the correct types
const MyHeader = styled.h1`
  color: ${props => props.theme.colors.primary.base};
  font-family: sans-serif;
`

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={supersetTheme}>
        <MyHeader>Properly styled text!</MyHeader>
      </ThemeProvider>
    );
  }
}
```
