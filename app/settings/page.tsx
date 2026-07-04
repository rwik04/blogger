import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — Presswork CMS",
  description: "Configure your Presswork CMS preferences.",
};

/**
 * Settings page — low priority, single plain form.
 */
export default function SettingsPage() {
  return (
    <div className="p-6 max-w-[600px]">
      <h2 className="text-headline-lg text-on-surface">Settings</h2>
      <p className="text-ui-base text-on-surface-variant mt-1">
        Configure your preferences and account settings.
      </p>

      {/* Settings placeholder */}
      <div className="mt-8 bg-surface-container border border-border rounded-lg p-12 text-center">
        <p className="text-ui-base text-graphite">
          Settings form coming later
        </p>
      </div>
    </div>
  );
}
