import { configure, addParameters } from '@storybook/react';
import { themes } from '@storybook/theming';
import './story.styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const req = require.context('../src', true, /\.stories\.js$/);

addParameters({
  options: {
    theme: themes.dark,
  },
  backgrounds: [
    { name: "Dark", value: 'transparent', default: true },
    { name: "Light", value: "#ffffff" }
  ]
});

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);