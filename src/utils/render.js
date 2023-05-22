/* eslint-disable import/extensions */
import applyDiff from './diff.js';
import eventStorage from './eventStorage.js';

let $root = null;
let rootComponentInstance = null;

const bindEvents = () => {
  eventStorage.forEach(({ eventType, handler }) => $root.addEventListener(`${eventType}`, handler));
};

const render = (RootComponent, $container) => {
  if ($container) $root = $container;
  if (RootComponent) rootComponentInstance = new RootComponent();

  const $virtual = $root.cloneNode();
  const domString = rootComponentInstance.render();
  $virtual.innerHTML = domString;

  applyDiff($root, $virtual);

  bindEvents();
};

export default render;
