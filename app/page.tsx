import { redirect } from "next/navigation";

/**
 * Root page — redirects to /dashboard per the routing map (task.md §5).
 */
export default function HomePage() {
  redirect("/dashboard");
}
