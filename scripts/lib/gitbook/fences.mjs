export function matchFenceOpening(line) {
  const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
  if (!match) return null;
  if (match[1][0] === '`' && match[2].includes('`')) return null;
  return {
    character: match[1][0],
    length: match[1].length
  };
}

export function isFenceClosing(line, fence) {
  const match = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
  return Boolean(
    match &&
    match[1][0] === fence.character &&
    match[1].length >= fence.length
  );
}
