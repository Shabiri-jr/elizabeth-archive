import { InviteStateShell } from "@/components/contribute/InviteStateShell";

export function SubmissionSuccess() {
  return (
    <InviteStateShell
      eyebrow="Message saved"
      title="Your message has been saved."
      body="Thank you for helping build Elizabeth's birthday archive. Your words, memories, and keepsakes will be reviewed before they become part of her story."
      note="Please keep the surprise quiet until August 19."
      buttonLabel="Close this page"
      buttonHref="/"
    />
  );
}
