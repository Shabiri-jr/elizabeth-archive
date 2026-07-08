import { InviteStateShell } from "@/components/contribute/InviteStateShell";

export function ExpiredInvite() {
  return (
    <InviteStateShell
      eyebrow="Private contribution"
      title="This invite has expired."
      body="Elizabeth's archive is already being prepared, so this contribution link is no longer accepting messages."
    />
  );
}
