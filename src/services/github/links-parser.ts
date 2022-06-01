export function parseNextUrl(linkHeader: string | undefined): string | undefined {
  if (!linkHeader) {
    return undefined;
  }

  // see https://docs.github.com/en/rest/guides/traversing-with-pagination
  // about the structure
  const re = /<([^>]+)>;\s*rel="([a-z]+)"/g;
  let arrRes: RegExpExecArray | null;
  const obj: {[key: string]: string} = {};
  while ((arrRes = re.exec(linkHeader)) !== null) {
    obj[arrRes[2]] = arrRes[1];
  }

  return obj.next;
}
