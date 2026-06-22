import { describe, expect, it } from "bun:test";
import { marked } from "marked";
import { gfmAlert } from "../src/index.js";

function parse(markdown: string, options?: Parameters<typeof gfmAlert>[0]) {
	return marked.use(gfmAlert(options)).parse(markdown);
}

describe("gfmAlert", () => {
	it("renders NOTE alert", () => {
		const md = `> [!NOTE]\n> Useful information that users should know, even when skimming content.`;
		const html = parse(md);
		expect(html).toContain('class="markdown-alert markdown-alert-note"');
		expect(html).toContain('class="markdown-alert-title"');
		expect(html).toContain(">NOTE</p>");
		expect(html).toContain(
			"<p>Useful information that users should know, even when skimming content.</p>",
		);
		expect(html).toContain("svg class=\"octicon\"");
	});

	it("renders TIP alert", () => {
		const md = `> [!TIP]\n> Helpful advice for doing things better or more easily.`;
		const html = parse(md);
		expect(html).toContain('class="markdown-alert markdown-alert-tip"');
		expect(html).toContain(">TIP</p>");
	});

	it("renders IMPORTANT alert", () => {
		const md = `> [!IMPORTANT]\n> Key information users need to know to achieve their goal.`;
		const html = parse(md);
		expect(html).toContain('class="markdown-alert markdown-alert-important"');
		expect(html).toContain(">IMPORTANT</p>");
	});

	it("renders WARNING alert", () => {
		const md = `> [!WARNING]\n> Urgent info that needs immediate user attention to avoid problems.`;
		const html = parse(md);
		expect(html).toContain('class="markdown-alert markdown-alert-warning"');
		expect(html).toContain(">WARNING</p>");
	});

	it("renders CAUTION alert", () => {
		const md = `> [!CAUTION]\n> Advises about risks or negative outcomes of certain actions.`;
		const html = parse(md);
		expect(html).toContain('class="markdown-alert markdown-alert-caution"');
		expect(html).toContain(">CAUTION</p>");
	});

	it("renders regular blockquote without alert", () => {
		const md = `> This is a regular blockquote.`;
		const html = parse(md);
		expect(html).toContain("<blockquote>");
		expect(html).not.toContain("markdown-alert");
		expect(html).toContain("This is a regular blockquote.");
	});

	it("handles case-insensitive alert types", () => {
		const md = `> [!note]\n> lowercase test`;
		const html = parse(md);
		expect(html).toContain('class="markdown-alert markdown-alert-note"');
	});

	it("handles mixed-case alert types", () => {
		const md = `> [!Warning]\n> mixed case test`;
		const html = parse(md);
		expect(html).toContain('class="markdown-alert markdown-alert-warning"');
	});

	it("applies custom className", () => {
		const md = `> [!NOTE]\n> custom class test`;
		const html = parse(md, { className: "my-custom-class" });
		expect(html).toContain("markdown-alert-note my-custom-class");
	});

	it("applies multiple custom classNames", () => {
		const md = `> [!TIP]\n> multiple classes`;
		const html = parse(md, { className: "class-a class-b" });
		expect(html).toContain("markdown-alert-tip class-a class-b");
	});

	it("ignores empty className", () => {
		const md = `> [!NOTE]\n> empty class`;
		const html = parse(md, { className: "" });
		expect(html).toContain('class="markdown-alert markdown-alert-note"');
		expect(html).not.toContain("markdown-alert-note ");
	});

	it("renders alert with content after the marker on same line", () => {
		const md = `> [!NOTE] Inline title\n> Body content.`;
		const html = parse(md);
		expect(html).toContain('class="markdown-alert markdown-alert-note"');
		expect(html).toContain("Body content.");
	});

	it("does not treat non-alert blockquote as alert", () => {
		const md = `> [!UNKNOWN]\n> Not a valid alert type.`;
		const html = parse(md);
		expect(html).toContain("<blockquote>");
		expect(html).not.toContain("markdown-alert");
	});
});
