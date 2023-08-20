import * as React from "react";
import {cva, type VariantProps} from "class-variance-authority";

import {cn} from "@/lib/cn";

const badgeVariants = cva(
    "inline-flex items-center border border-transparent rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-opacity-80",
    {
        variants: {
            variant: {
                primary:
                    "bg-primary text-primary-foreground",
                info:
                    "bg-sky-500 text-destructive-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground",
                success:
                    "bg-success text-success-foreground",
                destructive:
                    "bg-destructive text-destructive-foreground",
            },
        },
        defaultVariants: {
            variant: "primary",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
    plain?: boolean;
}

function Badge({className, variant, plain, ...props}: BadgeProps) {
    let plainClass = '';
    if (plain) {
        switch (variant) {
            case 'secondary':
                plainClass = 'bg-secondary/10 border-secondary text-secondary';
                break;
            case 'info':
                plainClass = 'bg-sky-500/10 border-sky-500 text-sky-500';
                break;
            case 'success':
                plainClass = 'bg-success/10 border-success text-success';
                break;
            case 'destructive':
                plainClass = 'bg-destructive/10 border-destructive text-destructive';
                break;
            default:
                plainClass = 'bg-primary/10 border-primary text-primary';
                break;
        }
    }
    return (
        <div className={cn(badgeVariants({variant}), plainClass, className)} {...props} />
    );
}

export {Badge, badgeVariants};
