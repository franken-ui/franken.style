import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import { visit } from "unist-util-visit";

function plugin() {
  const classMap = {
    a: "uk-link",
    h1: "uk-h1",
    h2: "uk-h2 mt",
    h3: "uk-h3 mt",
    h4: "uk-h4 mt",
    p: "uk-paragraph",
    table: "uk-table uk-table-divider uk-table-responsive mt",
    ul: "uk-list uk-list-hyphen mt",
    hr: "uk-divider-icon mt",
  };

  const stylesMap = {
    h2: { "--mt": "10" },
    h3: { "--mt": "10" },
    h4: { "--mt": "10" },
    table: { "--mt": "10" },
    ul: { "--mt": "6" },
    hr: { "--mt": "10" },
  };

  return (tree) => {
    visit(tree, "element", (node) => {
      const { tagName, properties = {} } = node;

      // Handle inline code separately
      if (tagName === "code") {
        const isInlineCode = !node.parent || node.parent.tagName !== "pre";
        if (isInlineCode) {
          properties.className = [
            "uk-codespan",
            ...(properties.className || []),
          ];
        }
        node.properties = properties;
        return;
      }

      // Apply mapped classes
      if (classMap[tagName]) {
        properties.className = [
          ...(properties.className || []),
          classMap[tagName],
        ];
      }

      // Apply mapped styles
      if (stylesMap[tagName]) {
        properties.style = {
          ...(properties.style || {}),
          ...stylesMap[tagName],
        };
      }

      // Add data-uk-scroll to anchor links with hash
      if (tagName === "a" && properties.href?.startsWith("#")) {
        properties["data-uk-scroll"] = "offset: 40";
      }

      node.properties = properties;
    });
  };
}

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  integrations: [
    expressiveCode({
      frames: {
        showCopyToClipboardButton: false,
      },
      themes: ["houston"],
    }),
    mdx(),
  ],
  markdown: {
    rehypePlugins: [plugin],
  },
});
