import Image from 'next/image';
import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalUpdateJSON,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

export type ImagePayload = {
  altText: string;
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  src: string;
  width?: number;
};

export const $createImageNode = ({ maxWidth = 500, ...props }: ImagePayload) => {
  return new ImageNode({ maxWidth, ...props });
};

const $convertImageElement = (domNode: Node): DOMConversionOutput | null => {
  if (domNode instanceof HTMLImageElement) {
    const { src, alt } = domNode;
    const node = $createImageNode({ src, altText: alt });
    return { node };
  }
  return null;
};

export type SerializedImageNode = Spread<
  {
    altText: string;
    height?: number;
    maxWidth: number;
    src: string;
    width?: number;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __height: number;
  __width: number;
  __maxWidth: number;

  constructor({
    src,
    altText,
    maxWidth,
    width,
    height,
    key,
  }: {
    src: string;
    altText: string;
    maxWidth: number;
    width?: number;
    height?: number;
    key?: NodeKey;
  }) {
    super(key);
    this.__altText = altText;
    this.__width = width ?? 100;
    this.__height = height ?? 100;
    this.__maxWidth = maxWidth;
    this.__src = src;
  }

  static getType(): string {
    return 'image';
  }

  static clone(_node: ImageNode): ImageNode {
    return new ImageNode({
      altText: _node.__altText,
      src: _node.__src,
      height: _node.__height,
      width: _node.__width,
      maxWidth: _node.__maxWidth,
      key: _node.__key,
    });
  }

  decorate(): JSX.Element {
    /* eslint-disable @next/next/no-img-element*/
    return (
      <Image
        src={this.__src}
        alt={this.__altText}
        width={this.__width}
        height={this.__height}
        style={{
          maxWidth: this.__maxWidth,
        }}
      />
    );
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    return span;
  }

  updateDOM(): false {
    return false;
  }

  exportDOM(): DOMExportOutput {
    const image = document.createElement('img');
    image.setAttribute('src', this.__src);
    image.setAttribute('alt', this.__altText);

    return { element: image };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => {
        return { conversion: $convertImageElement, priority: 0 };
      },
    };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, src } = serializedNode;
    return $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
    }).updateFromJSON(serializedNode);
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedImageNode>): this {
    return super.updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      altText: this.__altText,
      height: this.__height,
      maxWidth: this.__maxWidth,
      src: this.__src,
      width: this.__width,
    };
  }
}
