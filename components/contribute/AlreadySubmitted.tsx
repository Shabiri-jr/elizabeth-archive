import { InviteStateShell } from "@/components/contribute/InviteStateShell";

export function AlreadySubmitted() {
  return (
    <InviteStateShell
      eyebrow="Private contribution"
      title="Your message has already been received."
      body="Thank you for helping make Elizabeth's birthday archive special."
    />
  );
}
