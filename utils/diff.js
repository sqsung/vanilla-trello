const updateDOM = (parentNode, realNode, virtualNode) => {
  if (!realNode && virtualNode) {
    parentNode.appendChild(virtualNode);
    return;
  }

  if (realNode && !virtualNode) {
    parentNode.removeChild(realNode);
    return;
  }

  if (realNode.nodeType === Node.TEXT_NODE && virtualNode.nodeType === Node.TEXT_NODE) {
    if (realNode.textContent !== virtualNode.textContent) realNode.textContent = virtualNode.textContent;
    return;
  }

  if (realNode.nodeType === Node.COMMENT_NODE || virtualNode.nodeType === Node.COMMENT_NODE) return;

  if (realNode.nodeName !== virtualNode.nodeName) {
    parentNode.insertBefore(virtualNode, realNode);
    parentNode.removeChild(realNode);
    return;
  }

  for (const { name, value } of [...virtualNode.attributes]) {
    if (!realNode.hasAttribute(name) || realNode.getAttribute(name) !== value) {
      realNode.setAttribute(name, value);
    }
  }

  for (const { name } of [...realNode.attributes]) {
    if (!virtualNode.hasAttribute(name)) realNode.removeAttribute(name);
  }

  ['checked', 'value', 'selected'].forEach(key => {
    if (realNode[key] !== undefined && virtualNode[key] !== undefined && realNode[key] !== virtualNode[key]) {
      realNode[key] = virtualNode[key];
    }
  });

  // eslint-disable-next-line no-use-before-define
  applyDiff(realNode, virtualNode);
};

const applyDiff = (realDOM, virtualDOM) => {
  const [realNodes, virtualNodes] = [[...realDOM.childNodes], [...virtualDOM.childNodes]];
  const max = Math.max(realNodes.length, virtualNodes.length);

  for (let i = 0; i < max; i++) {
    updateDOM(realDOM, realNodes[i], virtualNodes[i]);
  }
};

export default applyDiff;
