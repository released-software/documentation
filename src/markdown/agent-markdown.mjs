import { parseExpressionAt } from 'acorn';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkGfm)
  .use(remarkStringify, {
    bullet: '-',
    fences: true,
    listItemIndent: 'one'
  });

function attribute(node, name) {
  return node.attributes?.find(
    (candidate) => candidate.type === 'mdxJsxAttribute' && candidate.name === name
  );
}

function stringAttribute(node, name, fallback = '') {
  const value = attribute(node, name)?.value;
  return typeof value === 'string' ? value : fallback;
}

function staticExpressionValue(expression) {
  if (!expression || typeof expression.value !== 'string') return undefined;

  const syntax = parseExpressionAt(expression.value, 0, {
    ecmaVersion: 'latest'
  });

  function read(node) {
    if (!node) return undefined;
    if (node.type === 'Literal') return node.value;
    if (node.type === 'ArrayExpression') return node.elements.map(read);
    if (node.type === 'ObjectExpression') {
      return Object.fromEntries(
        node.properties.flatMap((property) => {
          if (
            property.type !== 'Property' ||
            property.computed ||
            property.kind !== 'init'
          ) {
            return [];
          }
          const key =
            property.key.type === 'Identifier'
              ? property.key.name
              : property.key.type === 'Literal'
                ? String(property.key.value)
                : undefined;
          return key ? [[key, read(property.value)]] : [];
        })
      );
    }
    if (
      node.type === 'UnaryExpression' &&
      (node.operator === '+' || node.operator === '-') &&
      typeof read(node.argument) === 'number'
    ) {
      const value = read(node.argument);
      return node.operator === '-' ? -value : value;
    }
    return undefined;
  }

  return read(syntax);
}

function expressionAttribute(node, name) {
  const value = attribute(node, name)?.value;
  return typeof value === 'object' ? staticExpressionValue(value) : undefined;
}

function paragraph(children) {
  return { type: 'paragraph', children };
}

function text(value) {
  return { type: 'text', value };
}

function link(url, label) {
  return {
    type: 'link',
    url,
    children: [text(label)]
  };
}

function transformChildren(node) {
  if (!Array.isArray(node.children)) return [];
  return node.children.flatMap((child) => transformNode(child, node.type));
}

function calloutNodes(node) {
  const calloutTitle =
    stringAttribute(node, 'title') ||
    `${stringAttribute(node, 'type', 'note').replace(/^./, (letter) => letter.toUpperCase())}`;
  const children = transformChildren(node);

  return [
    {
      type: 'blockquote',
      children: [
        paragraph([{ type: 'strong', children: [text(calloutTitle)] }]),
        ...children
      ]
    }
  ];
}

function figureNodes(node, parentType) {
  const src = stringAttribute(node, 'src');
  const alt = stringAttribute(node, 'alt');
  if (!src) return [];

  const image = { type: 'image', url: src, alt };
  if (node.type === 'mdxJsxTextElement' || parentType === 'paragraph') {
    return [image];
  }

  const caption = stringAttribute(node, 'caption');
  return [
    paragraph([image]),
    ...(caption
      ? [paragraph([{ type: 'emphasis', children: [text(caption)] }])]
      : [])
  ];
}

function linkRowNodes(node) {
  const href = stringAttribute(node, 'href');
  const title = stringAttribute(node, 'title', href);
  const description = stringAttribute(node, 'description');
  if (!href) return [];

  return [
    paragraph([
      link(href, title),
      ...(description ? [text(` — ${description}`)] : [])
    ])
  ];
}

function responsiveEmbedNodes(node) {
  const src = stringAttribute(node, 'src');
  if (!src) return [];
  return [paragraph([link(src, stringAttribute(node, 'title', src))])];
}

function overviewNodes(node) {
  const items = expressionAttribute(node, 'items');
  const validItems = Array.isArray(items)
    ? items.filter(
        (item) =>
          item &&
          typeof item.href === 'string' &&
          typeof item.title === 'string'
      )
    : [];

  return [
    {
      type: 'heading',
      depth: 2,
      children: [text(stringAttribute(node, 'title', 'Overview'))]
    },
    ...(validItems.length
      ? [
          {
            type: 'list',
            ordered: false,
            spread: false,
            children: validItems.map((item) => ({
              type: 'listItem',
              spread: false,
              children: [
                paragraph([
                  link(item.href, item.title),
                  ...(typeof item.description === 'string' && item.description
                    ? [text(` — ${item.description}`)]
                    : [])
                ])
              ]
            }))
          }
        ]
      : [])
  ];
}

function transformComponent(node, parentType) {
  switch (node.name) {
    case 'Figure':
      return figureNodes(node, parentType);
    case 'NeutralCallout':
    case 'Aside':
      return calloutNodes(node);
    case 'LinkRow':
      return linkRowNodes(node);
    case 'ResponsiveEmbed':
      return responsiveEmbedNodes(node);
    case 'OverviewSection':
      return overviewNodes(node);
    case 'TabItem': {
      const label = stringAttribute(node, 'label', 'Option');
      return [
        { type: 'heading', depth: 3, children: [text(label)] },
        ...transformChildren(node)
      ];
    }
    case 'Steps':
    case 'Tabs':
      return transformChildren(node);
    default:
      return transformChildren(node);
  }
}

function transformNode(node, parentType) {
  if (
    node.type === 'mdxjsEsm' ||
    node.type === 'mdxFlowExpression' ||
    node.type === 'mdxTextExpression'
  ) {
    return [];
  }

  if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
    return transformComponent(node, parentType);
  }

  if (Array.isArray(node.children)) {
    node.children = transformChildren(node);
  }
  if (node.type === 'heading' && node.depth === 1) node.depth = 2;
  return [node];
}

export async function renderAgentMarkdown({ title, body }) {
  const tree = processor.parse(body);
  tree.children = transformChildren(tree);
  tree.children.unshift({
    type: 'heading',
    depth: 1,
    children: [text(title)]
  });

  const transformed = await processor.run(tree);
  return `${processor.stringify(transformed).trim()}\n`;
}
