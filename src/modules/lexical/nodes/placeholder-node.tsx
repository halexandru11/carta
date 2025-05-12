import { DecoratorNode, LexicalNode, NodeKey } from 'lexical';

type SerializedPlaceholderNode = {
  id: string;
  value: string;
  type: 'placeholder';
  version: 1;
};

export class PlaceholderNode extends DecoratorNode<JSX.Element> {
  __id: string;
  __value: string;

  static getType() {
    return 'placeholder';
  }

  static clone(node: PlaceholderNode): PlaceholderNode {
    return new PlaceholderNode(node.__id, node.__value, node.__key);
  }

  constructor(id: string, value: string, key?: NodeKey) {
    super(key);
    this.__id = id;
    this.__value = value;
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    span.style.background = 'var(--surface0)';
    span.style.padding = '0 4px';
    span.style.borderRadius = '6px';
    span.contentEditable = 'false';
    return span;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return <span>{this.__value}</span>;
  }

  exportJSON(): SerializedPlaceholderNode {
    return {
      id: this.__id,
      value: this.__value,
      type: 'placeholder',
      version: 1,
    };
  }

  static importJSON(serialized: SerializedPlaceholderNode): PlaceholderNode {
    return new PlaceholderNode(serialized.id, serialized.value);
  }

  getId(): string {
    return this.__id;
  }

  getValue(): string {
    return this.__value;
  }

  setValue(newValue: string): void {
    const writable = this.getWritable();
    writable.__value = newValue;
  }
}

export function $createPlaceholderNode(id: string, value: string): PlaceholderNode {
  return new PlaceholderNode(id, value);
}

export function $isPlaceholderNode(node: LexicalNode): node is PlaceholderNode {
  return node instanceof PlaceholderNode;
}
