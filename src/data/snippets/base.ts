import { readdirSync, readFileSync } from "fs";
import { join, resolve } from "path";

export function getSnippetPaths(config: {
  version: string;
  project: "kit" | "style";
  file?: string;
}) {
  const { version, project, file = "code.html" } = config;

  const SNIPPETS_DIR = resolve("src", "snippets", version, project);

  // Get all snippet categories (directories)
  const categories = readdirSync(SNIPPETS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // Build paths array by reading each category directory
  const paths = categories.flatMap((category) => {
    const categoryPath = join(SNIPPETS_DIR, category);
    const examples = readdirSync(categoryPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    return examples.map((slug) => {
      const codePath = join(SNIPPETS_DIR, category, slug, "code.html");
      const content = readFileSync(codePath, "utf-8");

      return {
        params: { snippets: category, slug },
        props: {
          category,
          content,
        },
      };
    });
  });

  return paths;
}
