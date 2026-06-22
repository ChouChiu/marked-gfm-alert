import type { Token, Tokens } from "marked";
import { getAlertIconSvg } from "./icons.js";
import type { AlertType, GfmAlertOptions } from "./types.js";

const ALERT_REGEX = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i;

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
	const classNames = buildClassNames(alertType, options.className);
	const icon = getAlertIconSvg(alertType);

	return `<div class="${classNames}" dir="auto">\n<p class="markdown-alert-title" dir="auto">${icon}${alertType}</p>\n${body}</div>\n`;
}
