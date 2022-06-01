import {parseNextUrl} from "./links-parser";

test('Parse with next URL 2', () => {
  const linksHeader = '<https://api.github.com/repositories/584334615/pulls?page=1&per_page=1>; rel="prev", <https://api.github.com/repositories/584334615/pulls?page=3&per_page=1>; rel="next", <https://api.github.com/repositories/584334615/pulls?page=4&per_page=1>; rel="last", <https://api.github.com/repositories/584334615/pulls?page=1&per_page=1>; rel="first"';
  const nextUrl = parseNextUrl(linksHeader);
  expect(nextUrl).toBe('https://api.github.com/repositories/584334615/pulls?page=3&per_page=1');
});

test('Parse with no next URL', () => {
  const linksHeader = '<https://api.github.com/repositories/584334615/pulls?page=3&per_page=1>; rel="prev", <https://api.github.com/repositories/584334615/pulls?page=1&per_page=1>; rel="first"';
  const nextUrl = parseNextUrl(linksHeader);
  expect(nextUrl).toBeUndefined();
});

test('Parse undefined', () => {
  const nextUrl = parseNextUrl(undefined);
  expect(nextUrl).toBeUndefined();
});

