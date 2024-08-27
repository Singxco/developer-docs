import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import { MoveUpRightIcon, TerminalIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex sm:min-h-[91vh] min-h-[88vh] flex-col items-center justify-center text-center px-2 py-8">
      <h1 className="text-3xl font-bold mb-4 sm:text-7xl">
        SingX Developer portal
      </h1>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground"></p>
      <div className="flex flex-row items-center gap-5">
        <Link
          href={`/docs${page_routes[0].href}`}
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          Documentation
        </Link>
        <Link
          href={`/blog/home`}
          className={buttonVariants({
            variant: "outline",
            className: "px-6",
            size: "lg",
          })}
        >
          Blog
        </Link>
      </div>
    </div>
  );
}
