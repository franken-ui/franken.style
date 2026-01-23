import { readdirSync, readFileSync } from "fs";
import { join, resolve } from "path";

export function getSnippetPaths(config: {
  version: string;
  project: "kit" | "style" | "ft";
  file?: string;
}) {
  const { version, project, file = "code.html" } = config;

  const SNIPPETS_DIR = resolve("src", "snippets", version, project);

  try {
    // Get all snippet categories (directories)
    const categories = readdirSync(SNIPPETS_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // Build paths array by reading each category directory
    const paths = categories.flatMap((category) => {
      const categoryPath = join(SNIPPETS_DIR, category);

      try {
        const examples = readdirSync(categoryPath, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);

        return examples.map((slug) => {
          const codePath = join(SNIPPETS_DIR, category, slug, file);
          let content: string;

          try {
            content = readFileSync(codePath, "utf-8");
          } catch (error) {
            // File doesn't exist or can't be read
            console.warn(`Could not read file: ${codePath}`, error);
            content = "<!-- No available snippet -->";
          }

          return {
            params: { snippets: category, slug },
            props: {
              category,
              content,
            },
          };
        });
      } catch (error) {
        // Category directory can't be read
        console.warn(`Could not read category: ${categoryPath}`, error);
        return [];
      }
    });

    return paths;
  } catch (error) {
    // Snippets directory doesn't exist or can't be read
    console.warn(`Could not read snippets directory: ${SNIPPETS_DIR}`, error);
    return [];
  }
}
