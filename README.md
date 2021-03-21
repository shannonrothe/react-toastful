# react-toastful

Simple, renderless, React toast library

[![NPM](https://img.shields.io/npm/v/react-toastful.svg)](https://www.npmjs.com/package/react-toastful) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-toastful
```

## Usage

```tsx
import * as React from "react";
import { Toastful, toastful } from "react-toastful";

class App extends React.Component {
  render() {
    return (
      <>
        <Toastful />
        <button onClick={() => toastful("Hello, World!")}>Show Toast</button>
      </>
    );
  }
}
```

## More Information

[Documentation](https://react-toastful.com/docs)

## License

MIT © [shannonrothe](https://github.com/shannonrothe)
