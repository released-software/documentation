import { renderMermaidSVG } from 'beautiful-mermaid';

const googleFontImports = /^\s*@import url\([^\n]+\);\n/gm;

function transform(node) {
  if (!node.children) return;

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];

    if (child.type === 'code' && child.lang === 'mermaid') {
      try {
        const svg = renderMermaidSVG(child.value, {
          bg: 'var(--sl-color-bg)',
          fg: 'var(--sl-color-text)',
          line: 'var(--sl-color-text)',
          accent: 'var(--sl-color-text)',
          muted: 'var(--sl-color-text)',
          surface: 'var(--sl-color-bg-inline-code)',
          border: 'var(--sl-color-hairline)',
          font: 'Switzer',
          transparent: true
        })
          .replace(googleFontImports, '')
          .replace('<svg ', '<svg role="img" aria-label="Mermaid diagram" ');

        node.children[index] = {
          type: 'html',
          value: `<figure data-mermaid-diagram>${svg}</figure>`
        };
      } catch {
        // Preserve the authored source block when Beautiful Mermaid cannot parse it.
      }
    } else {
      transform(child);
    }
  }
}

export default function remarkBeautifulMermaid() {
  return transform;
}
