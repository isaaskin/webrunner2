[![Build and deploy to Pages](https://github.com/isaaskin/webrunner2/actions/workflows/build_and_deploy.yml/badge.svg)](https://github.com/isaaskin/webrunner2/actions/workflows/build_and_deploy.yml)

## Webrunner2

Webrunner2 is a simple and smart library that enables you to bring an isolated and locally running HTML, CSS and JavaScript runner platform to your web page.

## How to use

Add the javascript library to your page from the following source.

```https://www.unpkg.com/webrunner2@latest/dist/bundle.js```

You can initialize the webrunner2 into any DOM element you want.

All you need to do is to run ```webrunner2.init(domElement, options?)``` in the ```<script>``` tag.

```init``` function accepts two arguments, a required DOM element and an optional `options` object.

### Options object

Unless you provide any parameter, the following default values are used.

```js
const defaultOptions = {
  width: '100%',                  // Width of the container
  height: '300px',                // Height of the container
  loadHTMLFromCache: true,        // Loads the last HTML code from local storage
  loadCSSFromCache: true,         // Loads the last CSS code from local storage
  loadJavaScriptFromCache: true,  // Loads the last JavaScript code from local storage
};
```

The ```options``` object can include only the desired option parameters like the one below.

```js
let options = {
  loadHTMLFromCache: false,
  loadCSSFromCache: false,
}

webrunner2.init(document.getElementById("container"), options)
```

## Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Webrunner2 Example</title>
</head>
<body>
  <div id="container"></div>
  <script src="https://www.unpkg.com/webrunner2@latest/dist/bundle.js"></script>
  <script>
    webrunner2.init(document.getElementById("container"))
  </script>
</body>
</html>
```

## An example on CodePen

[Click for example](https://codepen.io/isaaskin/pen/mdQPzNx)