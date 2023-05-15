const diff = (parent, newNode, oldNode) => {
  const updateAttributes = (oldNode, newNode) => {
    if (newNode.checked !== oldNode.checked) oldNode.checked = newNode.checked;

    if (newNode.selected !== oldNode.selected) oldNode.selected = newNode.selected;

    for (const { name, value } of [...newNode.attributes]) {
      if (value !== oldNode.getAttribute(name)) oldNode.setAttribute(name, value);
    }

    for (const { name } of [...oldNode.attributes]) {
      if (newNode.getAttribute(name) === undefined) oldNode.removeAttribute(name);
    }
  };

  const updateDOM = (parent, newNode, oldNode) => {
    if (!newNode && oldNode) return oldNode.remove();

    if (newNode && !oldNode) return parent.appendChild(newNode);

    if (newNode instanceof Text && oldNode instanceof Text) {
      if (oldNode.nodeValue === newNode.nodeValue) return;

      oldNode.nodeValue = newNode.nodeValue;
      return;
    }

    if (newNode.nodeName !== oldNode.nodeName) {
      const index = [...parent.childNodes].indexOf(oldNode);

      oldNode.remove();
      parent.appendChild(newNode, index);

      return;
    }

    updateAttributes(oldNode, newNode);

    const newChildNodes = [...newNode.childNodes];
    const oldChildNodes = [...oldNode.childNodes];

    const maxLength = Math.max(newChildNodes.length, oldChildNodes.length);

    for (let i = 0; i < maxLength; i++) {
      updateDOM(oldNode, newChildNodes[i], oldChildNodes[i]);
    }
  };

  const diffRender = () => {
    const maxLength = Math.max(newNode.length, oldNode.length);

    for (let i = 0; i < maxLength; i++) {
      updateDOM(parent, newNode[i], oldNode[i]);
    }
  };

  diffRender();
};

export default diff;
