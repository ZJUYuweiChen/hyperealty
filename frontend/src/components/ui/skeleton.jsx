import { mergeClassnames } from "@/utils/classname"

function Skeleton({
  className,
  ...props
}) {
  return (<div className={mergeClassnames("animate-pulse rounded-md bg-muted", className)} {...props} />);
}

export { Skeleton }
