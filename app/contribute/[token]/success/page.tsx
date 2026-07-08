import type { Metadata } from "next";
import { SubmissionSuccess } from "@/components/contribute/SubmissionSuccess";

export const metadata: Metadata = {
  title: "Message Saved | A Story Called Elizabeth",
};

export default function ContributorSuccessPage() {
  return <SubmissionSuccess />;
}
