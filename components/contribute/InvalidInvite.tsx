import { InviteStateShell } from "@/components/contribute/InviteStateShell";

type InvalidInviteProps = {
  detail?: string;
};

export function InvalidInvite({ detail }: InvalidInviteProps) {
  return (
    <InviteStateShell
      eyebrow="Private contribution"
      title="This invite link is not available."
      body="This private contribution link may be invalid, expired, or already used."
      note={detail}
    />
  );
}
