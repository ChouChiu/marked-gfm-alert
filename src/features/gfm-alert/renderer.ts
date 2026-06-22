import type { Token, Tokens } from "marked";
import { getAlertIconSvg, getAlertIconSvgInline } from "./icons.js";
import type { AlertType, GfmAlertOptions } from "./types.js";

const ALERT_REGEX = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i;

const INLINE_COLORS: Record<AlertType, { border: string; title: string }> = {
	NOTE: { border: "#0969da", title: "#0969da" },
	TIP: { border: "#1f883d", title: "#1a7f37" },
	IMPORTANT: { border: "#8957e5", title: "#8250df" },
	WARNING: { border: "#9e6a03", title: "#9a6700" },
	CAUTION: { border: "#cf222e", title: "#d1242f" },
};

function isAlertParagraph(token: Token): token is Tokens.Paragraph {
	if (token.type !== "paragraph") return false;
	const paragraph = token as Tokens.Paragraph;
	const firstText = paragraph.tokens[0];
	if (firstText?.type !== "text") return false;
	return ALERT_REGEX.test(firstText.text);
}

function stripAlertMarker(paragraph: Tokens.Paragraph): Tokens.Paragraph[] {
	const firstText = paragraph.tokens[0] as Tokens.Text;
	const remaining = firstText.text.replace(ALERT_REGEX, "").trimStart();

	if (!remaining) {
		return [];
	}

	return [
		{
			...paragraph,
			tokens: [{ ...firstText, text: remaining }, ...paragraph.tokens.slice(1)],
		},
	];
}

function buildClassNames(alertType: AlertType, extra?: string): string {
	const classes = [
		"markdown-alert",
		`markdown-alert-${alertType.toLowerCase()}`,
	];
	if (extra) {
		for (const cls of extra.split(" ")) {
			if (cls.length > 0) classes.push(cls);
		}
	}
	return classes.join(" ");
}

function extractAlertType(token: Tokens.Paragraph): AlertType {
	const firstText = token.tokens[0];
	if (firstText?.type !== "text") return "NOTE";
	const match = firstText.text.match(ALERT_REGEX);
	return (match?.[1]?.toUpperCase() as AlertType) ?? "NOTE";
}

export function createBlockquoteRenderer(
	parser: { parse: (tokens: Token[]) => string },
	token: Tokens.Blockquote,
	options: GfmAlertOptions = {},
): string {
	const firstToken = token.tokens[0];

	if (!firstToken || !isAlertParagraph(firstToken)) {
		return `<blockquote>\n${parser.parse(token.tokens)}</blockquote>\n`;
	}

	const alertType = extractAlertType(firstToken as Tokens.Paragraph);
	const restTokens = token.tokens.slice(1);
	const stripped = stripAlertMarker(firstToken as Tokens.Paragraph);
	const allTokens = [...stripped, ...restTokens];

	const body = parser.parse(allTokens);
	const icon = getAlertIconSvg(alertType);

	if (options.inlineStyles) {
		const colors = INLINE_COLORS[alertType];
		const inlineIcon = getAlertIconSvgInline(alertType);
		return `<div style="border-left:0.25em solid ${colors.border};color:inherit;margin-bottom:16px;padding:0.5rem 1em" dir="auto">\n<p style="align-items:center;display:flex;font-size:14px;font-weight:500;line-height:1;color:${colors.title}" dir="auto">${inlineIcon}${alertType}</p>\n${body}</div>\n`;
	}

	const classNames = buildClassNames(alertType, options.className);
	return `<div class="${classNames}" dir="auto">\n<p class="markdown-alert-title" dir="auto">${icon}${alertType}</p>\n${body}</div>\n`;
}
