import type { MarkedExtension } from "marked";
import { createBlockquoteRenderer } from "./renderer.js";
import type { GfmAlertOptions } from "./types.js";

export type { AlertType, GfmAlertOptions } from "./types.js";
export { ALERT_TYPES } from "./types.js";

export function gfmAlert(options: GfmAlertOptions = {}): MarkedExtension {
	return {
		renderer: {
			blockquote({ tokens }) {
				return createBlockquoteRenderer(
					this.parser,
					{ type: "blockquote", raw: "", text: "", tokens },
					options,
				);
			},
		},
	};
}
