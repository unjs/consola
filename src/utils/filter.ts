export function matchesTag(tag: string, pattern: string = "*") {
  if (pattern === "*") {
    return true;
  }

  const templates = pattern
    .trim()
    .replaceAll(" ", ",")
    .split(",")
    .filter(Boolean);

  for (const template of templates) {
    if (template[0] === "-") {
      if (matchesTemplate(tag, template.slice(1))) {
        return false;
      }
    } else {
      if (matchesTemplate(tag, template)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if the given string matches a namespace template, honoring
 * asterisks as wildcards.
 *
 * Ported from https://github.com/debug-js/debug/blob/7e3814cc603bf64fdd69e714e0cf5611ec31f43b/src/common.js#L184-L225
 * MIT License
 */
function matchesTemplate(search: string, template: string) {
  let searchIndex = 0;
  let templateIndex = 0;
  let starIndex = -1;
  let matchIndex = 0;

  while (searchIndex < search.length) {
    if (
      templateIndex < template.length &&
      (template[templateIndex] === search[searchIndex] ||
        template[templateIndex] === "*")
    ) {
      // Match character or proceed with wildcard
      if (template[templateIndex] === "*") {
        starIndex = templateIndex;
        matchIndex = searchIndex;
        templateIndex++; // Skip the '*'
      } else {
        searchIndex++;
        templateIndex++;
      }
    } else if (starIndex === -1) {
      return false; // No match
    } else {
      // Backtrack to the last '*' and try to match more characters
      templateIndex = starIndex + 1;
      matchIndex++;
      searchIndex = matchIndex;
    }
  }

  // Handle trailing '*' in template
  while (templateIndex < template.length && template[templateIndex] === "*") {
    templateIndex++;
  }

  return templateIndex === template.length;
}
