import { Button as AriaButton, OverlayArrow as AriaOverlayArrow, Tooltip as AriaTooltip, TooltipTrigger as AriaTooltipTrigger } from "react-aria-components";
import { cx } from "@/lib/utils/cx";

export const Tooltip = ({
    title,
    description,
    children,
    arrow = true,
    delay = 300,
    closeDelay = 0,
    trigger,
    isDisabled,
    isOpen,
    defaultOpen,
    offset = 6,
    crossOffset,
    placement = "top",
    onOpenChange,
    ...tooltipProps
}) => {
    const isTopOrBottomLeft = ["top left", "top end", "bottom left", "bottom end"].includes(placement);
    const isTopOrBottomRight = ["top right", "top start", "bottom right", "bottom start"].includes(placement);
    // Set negative cross offset for left and right placement to visually balance the tooltip.
    const calculatedCrossOffset = isTopOrBottomLeft ? -12 : isTopOrBottomRight ? 12 : 0;
    return (
        <AriaTooltipTrigger {...{ trigger, delay, closeDelay, isDisabled, isOpen, defaultOpen, onOpenChange }}>
            {children}
            <AriaTooltip
                {...tooltipProps}
                offset={offset}
                placement={placement}
                crossOffset={crossOffset ?? calculatedCrossOffset}
                className={({ isEntering, isExiting }) => cx(isEntering && "ease-out animate-in", isExiting && "ease-in animate-out")}
            >
                {({ isEntering, isExiting }) => (
                    <div
                        className={cx(
                            "z-50 flex max-w-[200px] origin-(--trigger-anchor-point) flex-col items-center gap-0.5 rounded-lg will-change-transform tooltip-box",
                            description ? "px-4 py-3" : "px-4 py-3",
                            isEntering &&
                                "ease-out animate-in fade-in zoom-in-95 in-placement-left:slide-in-from-right-0.5 in-placement-right:slide-in-from-left-0.5 in-placement-top:slide-in-from-bottom-0.5 in-placement-bottom:slide-in-from-top-0.5",
                            isExiting &&
                                "ease-in animate-out fade-out zoom-out-95 in-placement-left:slide-out-to-right-0.5 in-placement-right:slide-out-to-left-0.5 in-placement-top:slide-out-to-bottom-0.5 in-placement-bottom:slide-out-to-top-0.5",
                        )}
                        style={{ fontFamily: "'Karla', sans-serif" }}
                    >
                        <span className="text-xs font-bold tooltip-title whitespace-nowrap">
                            {title}
                        </span>
                        {description && (
                            <span className="text-xs font-medium tooltip-description">
                                {description}
                            </span>
                        )}
                        {arrow && (
                            <AriaOverlayArrow>
                                <svg
                                    viewBox="0 0 12 6"
                                    className="size-2 fill-[rgb(38,38,38)] in-placement-left:-rotate-90 in-placement-right:rotate-90 in-placement-top:rotate-0 in-placement-bottom:rotate-180"
                                >
                                    <path d="M0 0 L6 6 L12 0 Z" />
                                </svg>
                            </AriaOverlayArrow>
                        )}
                    </div>
                )}
            </AriaTooltip>
        </AriaTooltipTrigger>
    );
};

export const TooltipTrigger = ({ children, className, ...buttonProps }) => {
    return (
        <AriaButton {...buttonProps} className={(values) => cx("h-max w-max outline-hidden", typeof className === "function" ? className(values) : className)}>
            {children}
        </AriaButton>
    );
};

