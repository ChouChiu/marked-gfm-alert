export const ALERT_TYPES = [
	"NOTE",
	"TIP",
	"IMPORTANT",
	"WARNING",
	"CAUTION",
] as const;

export type AlertType = (typeof ALERT_TYPES)[number];

export interface GfmAlertOptions {
	/** Extra CSS class names appended to the alert container. */
	className?: string;
	/** Use inline styles instead of CSS classes. Eliminates the need to import alert.css. */
	inlineStyles?: boolean;
}
