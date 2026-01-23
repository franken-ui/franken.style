import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const docs = {
  project: z.enum(["kit", "style", "ft"]).default("style"),
  group: z.string(),
  order: z.number().optional(),
  text: z.string(),
  title: z.string(),
  lead: z.string().optional(),
  wip: z.boolean().optional(),
  meta: z.record(z.string()).optional(),
  ping: z.boolean().optional(),
  keywords: z.string().optional(),
  submenu: z
    .array(
      z.object({
        href: z.string(),
        text: z.string(),
        target: z.enum(["_self", "_blank", "_parent", "_top"]).optional(),
      }),
    )
    .optional(),
  tbc: z.literal(false).optional(),
  webc: z.literal(true).optional(),
  hidden: z.boolean().optional(),
  alias: z.string().optional(),
  breadcrumb: z
    .array(
      z.object({
        text: z.string(),
        id: z.string(),
      }),
    )
    .optional(),
};

const latest = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/docs/latest" }),
  schema: z.object(docs),
});

export const collections = {
  latest: latest,
};
