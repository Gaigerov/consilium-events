"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {XIcon} from "lucide-react";

import {cn} from "./utils";

function Dialog({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentProps<typeof DialogPrimitive.Overlay>
>(({className, ...props}, ref) => {
    return (
        <DialogPrimitive.Overlay
            ref={ref}
            data-slot="dialog-overlay"
            className={cn(
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
                className,
            )}
            {...props}
        />
    );
});
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentProps<typeof DialogPrimitive.Content>
>(({className, children, ...props}, ref) => {
    return (
        <DialogPortal data-slot="dialog-portal">
            <DialogOverlay />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="p-[5px] rounded-2xl max-w-[95vw] max-h-[90vh] mx-auto"
                    style={{
                        background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.5), rgba(66, 200, 187, 0.5), rgba(13, 81, 136, 0.5))'
                    }}
                >
                    <DialogPrimitive.Content
                        ref={ref}
                        data-slot="dialog-content"
                        className={cn(
                            "bg-black/60 backdrop-blur-xl border-0 shadow-lg duration-200 min-w-[300px] max-h-[90vh] overflow-auto",
                            "data-[state=open]:animate-in data-[state=closed]:animate-out",
                            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                            "rounded-xl relative",
                            className
                        )}
                        {...props}
                    >
                        {children}
                        <DialogPrimitive.Close className="absolute top-3 right-3 rounded-full p-2 transition-all hover:bg-white/20 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 text-white z-10">
                            <XIcon />
                            <span className="sr-only">Close</span>
                        </DialogPrimitive.Close>
                    </DialogPrimitive.Content>
                </div>
            </div>
        </DialogPortal>
    );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

function DialogHeader({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
            {...props}
        />
    );
}

function DialogFooter({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className,
            )}
            {...props}
        />
    );
}

function DialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn("text-lg leading-none font-semibold", className)}
            {...props}
        />
    );
}

function DialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
