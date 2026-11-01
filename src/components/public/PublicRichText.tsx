import type { RichText } from "@/schemas/rich-text";

type RichTextBlock = RichText["blocks"][number];
type InlineNode = Extract<RichTextBlock, { type: "paragraph" }>["children"][number];

function withValues(value: string, replacements: Record<string, string>) {
  return Object.entries(replacements).reduce(
    (text, [key, replacement]) => text.replaceAll(`{${key}}`, replacement),
    value,
  );
}

function renderInline(nodes: InlineNode[], replacements: Record<string, string>) {
  return nodes.map((node, index) => {
    const text = withValues(node.text, replacements);
    return node.type === "link" ? (
      <a key={`${node.url}-${index}`} href={node.url} className="font-medium text-[#3f5212] underline underline-offset-2">
        {text}
      </a>
    ) : (
      <span key={index}>{text}</span>
    );
  });
}

export function PublicRichText({
  value,
  replacements = {},
}: {
  value: RichText;
  replacements?: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      {value.blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return <p key={index} className="m-0 text-sm leading-7 text-[#52525b]">{renderInline(block.children, replacements)}</p>;
        }
        if (block.type === "heading") {
          const Heading = block.level === 2 ? "h2" : "h3";
          return <Heading key={index} className="mb-0 mt-6 text-lg font-semibold text-[#18181a]">{renderInline(block.children, replacements)}</Heading>;
        }
        const List = block.ordered ? "ol" : "ul";
        return (
          <List key={index} className={`m-0 space-y-1 pl-5 text-sm leading-7 text-[#52525b] ${block.ordered ? "list-decimal" : "list-disc"}`}>
            {block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item, replacements)}</li>)}
          </List>
        );
      })}
    </div>
  );
}
