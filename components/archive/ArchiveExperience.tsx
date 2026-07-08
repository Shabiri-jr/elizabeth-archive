import { ArchiveEmptyState } from "@/components/archive/ArchiveEmptyState";
import { ArchiveHero } from "@/components/archive/ArchiveHero";
import { ArchiveInteractionsProvider } from "@/components/archive/ArchiveInteractionsProvider";
import { ArchiveRevealClient } from "@/components/archive/ArchiveRevealClient";
import { ChapterNav, type ChapterNavItem } from "@/components/archive/ChapterNav";
import { ChapterSection } from "@/components/archive/ChapterSection";
import { FashionEmpireCard } from "@/components/archive/FashionEmpireCard";
import { FavouritesTeaser } from "@/components/archive/FavouritesTeaser";
import { FinalLetter } from "@/components/archive/FinalLetter";
import { FutureWishCard } from "@/components/archive/FutureWishCard";
import { EmotionalGallery } from "@/components/archive/gallery/EmotionalGallery";
import { LilacSignatureEasterEgg } from "@/components/archive/LilacSignatureEasterEgg";
import { MemoryTimeline } from "@/components/archive/MemoryTimeline";
import { MessageCard } from "@/components/archive/MessageCard";
import { MilestoneCard } from "@/components/archive/MilestoneCard";
import { MobileChapterJump } from "@/components/archive/MobileChapterJump";
import { OpenWhenLetters } from "@/components/archive/OpenWhenLetters";
import { PastryBabeEasterEgg } from "@/components/archive/PastryBabeEasterEgg";
import { PrivateFromMeRoom } from "@/components/archive/PrivateFromMeRoom";
import { ReplayTrailerButton } from "@/components/archive/ReplayTrailerButton";
import { VoicesSection } from "@/components/archive/VoicesSection";
import { WordWall } from "@/components/archive/WordWall";
import type { ArchiveAccessState } from "@/lib/archive/access";
import type { ArchiveChapter, ArchiveData } from "@/lib/archive/queries";

type ArchiveExperienceProps = {
  data: ArchiveData;
  access: ArchiveAccessState;
  favouriteKeys: string[];
};

type ArchiveChapterView = Pick<ArchiveChapter, "slug" | "title" | "subtitle" | "body">;

const fallbackChapters: Record<string, ArchiveChapterView> = {
  "dear-elizabeth": {
    slug: "dear-elizabeth",
    title: "Dear Elizabeth",
    subtitle: "Opening letter",
    body: "Today is not just your birthday. It is a reminder of how many people carry pieces of your story with them.",
  },
  "the-girl-we-know": {
    slug: "the-girl-we-know",
    title: "The Girl We Know",
    subtitle: "A portrait in words",
    body: "A gathered portrait made from the little words people reach for when they think of you.",
  },
  "messages-from-your-people": {
    slug: "messages-from-your-people",
    title: "Messages From Your People",
    subtitle: "Birthday wishes",
    body: "A private wall of notes from the people who wanted you to hear their love clearly.",
  },
  "memories-with-you": {
    slug: "memories-with-you",
    title: "Memories With You",
    subtitle: "Shared moments",
    body: "A timeline of moments that stayed with people because you were in them.",
  },
  "the-gallery": {
    slug: "the-gallery",
    title: "The Gallery",
    subtitle: "Photo keepsakes",
    body: "A soft polaroid room for approved photos and visual keepsakes.",
  },
  voices: {
    slug: "voices",
    title: "Voices",
    subtitle: "Audio and video",
    body: "Some messages feel different when they arrive in someone's voice.",
  },
  "the-future-we-see-for-you": {
    slug: "the-future-we-see-for-you",
    title: "The Future We See For You",
    subtitle: "Prayers and wishes",
    body: "Blessings, prayers, and hopes for the year opening ahead of you.",
  },
  "from-me": {
    slug: "from-me",
    title: "From Me",
    subtitle: "Closing note",
    body: null,
  },
  "private-from-me-room": {
    slug: "private-from-me-room",
    title: "Private From Me Room",
    subtitle: "A little more personal",
    body: "I built this because I wanted you to have something you could return to - not just on your birthday, but on days when you need to remember that your presence matters.",
  },
};

function getChapter(chapters: ArchiveChapter[], slug: string): ArchiveChapterView {
  const chapter = chapters.find((item) => item.slug === slug);
  return chapter
    ? {
        slug: chapter.slug,
        title: chapter.title,
        subtitle: chapter.subtitle,
        body: chapter.body,
      }
    : fallbackChapters[slug];
}

function sectionLabel(value: string) {
  return value;
}

export function ArchiveExperience({ data, access, favouriteKeys }: ArchiveExperienceProps) {
  const dearElizabeth = getChapter(data.chapters, "dear-elizabeth");
  const girlWeKnow = getChapter(data.chapters, "the-girl-we-know");
  const messagesChapter = getChapter(data.chapters, "messages-from-your-people");
  const memoriesChapter = getChapter(data.chapters, "memories-with-you");
  const galleryChapter = getChapter(data.chapters, "the-gallery");
  const voicesChapter = getChapter(data.chapters, "voices");
  const futureChapter = getChapter(data.chapters, "the-future-we-see-for-you");
  const fromMe = getChapter(data.chapters, "from-me");
  const privateFromMe = getChapter(data.chapters, "private-from-me-room");
  const featuredMessage = data.messages[0];
  const remainingMessages = data.messages.slice(1);

  const navItems: ChapterNavItem[] = [
    { id: "opening-prelude", label: "Prelude", title: "Welcome" },
    { id: "dear-elizabeth", label: "Chapter 01", title: dearElizabeth.title },
    { id: "girl-we-know", label: "Chapter 02", title: girlWeKnow.title },
    { id: "messages", label: "Chapter 03", title: messagesChapter.title },
    { id: "memories", label: "Chapter 04", title: memoriesChapter.title },
    { id: "gallery", label: "Chapter 05", title: galleryChapter.title },
    { id: "voices", label: "Chapter 06", title: voicesChapter.title },
    { id: "future", label: "Chapter 07", title: futureChapter.title },
    { id: "open-when", label: "Open When", title: "Letters" },
    { id: "milestone", label: "Milestone", title: "Graduation" },
    { id: "future-empire", label: "Future", title: "Fashion Empire" },
    { id: "favourites", label: "Saved", title: "Favourites" },
    { id: "private-from-me", label: "Private", title: privateFromMe.title },
    { id: "from-me", label: "Final", title: fromMe.title },
  ];

  return (
    <ArchiveInteractionsProvider initialFavouriteKeys={favouriteKeys}>
      <ArchiveRevealClient revealModeEnabled={Boolean(data.settings?.reveal_mode_enabled)} />
      <ArchiveHero isAdminPreview={access.isAdminPreview} settings={data.settings ?? access.settings} heroImage={data.images[0]} />
      <div className="mx-auto -mt-12 flex max-w-6xl justify-center px-4 pb-8 sm:justify-end">
        <ReplayTrailerButton />
      </div>
      <MobileChapterJump items={navItems} />
      <ChapterNav items={navItems} />

      <ChapterSection
        id="dear-elizabeth"
        label={sectionLabel("Chapter 01 - Dear Elizabeth")}
        title={dearElizabeth.title}
        subtitle={dearElizabeth.subtitle}
        body={dearElizabeth.body}
      >
        <div
          data-archive-card
          className="rounded-[2rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-lg)]"
        >
          <div className="rounded-[calc(2rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-7 sm:p-10 lg:p-14">
            <p className="max-w-4xl font-serif text-3xl leading-tight text-espresso sm:text-4xl lg:text-5xl">
              {dearElizabeth.body ??
                "Today is not just your birthday. It is a reminder of how many people carry pieces of your story with them."}
            </p>
          </div>
        </div>
      </ChapterSection>

      <ChapterSection
        id="girl-we-know"
        label={sectionLabel("Chapter 02 - The Girl We Know")}
        title={girlWeKnow.title}
        subtitle={girlWeKnow.subtitle}
        body={girlWeKnow.body}
      >
        <WordWall words={data.words} />
      </ChapterSection>

      <ChapterSection
        id="messages"
        label={sectionLabel("Chapter 03 - Messages From Your People")}
        title={messagesChapter.title}
        subtitle={messagesChapter.subtitle}
        body={messagesChapter.body}
      >
        {featuredMessage ? (
          <div className="space-y-5">
            <MessageCard submission={featuredMessage} featured />
            {remainingMessages.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {remainingMessages.map((message) => (
                  <MessageCard key={message.id} submission={message} />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <ArchiveEmptyState
            title="Messages will appear here once they are approved."
            body="The birthday notes are private until admin review says they are ready for Elizabeth."
          />
        )}
      </ChapterSection>

      <ChapterSection
        id="memories"
        label={sectionLabel("Chapter 04 - Memories With You")}
        title={memoriesChapter.title}
        subtitle={memoriesChapter.subtitle}
        body={memoriesChapter.body}
      >
        <MemoryTimeline memories={data.memories} />
      </ChapterSection>

      <ChapterSection
        id="gallery"
        label={sectionLabel("Chapter 05 - The Gallery")}
        title={galleryChapter.title}
        subtitle={galleryChapter.subtitle}
        body={
          galleryChapter.body ??
          "Not just pictures. Small pieces of the story people kept with you."
        }
      >
        <EmotionalGallery images={data.images} />
      </ChapterSection>

      <ChapterSection
        id="voices"
        label={sectionLabel("Chapter 06 - Voices")}
        title={voicesChapter.title}
        subtitle={voicesChapter.subtitle}
        body={voicesChapter.body}
      >
        <VoicesSection audio={data.audio} videos={data.videos} />
      </ChapterSection>

      <ChapterSection
        id="future"
        label={sectionLabel("Chapter 07 - The Future We See For You")}
        title={futureChapter.title}
        subtitle={futureChapter.subtitle}
        body={futureChapter.body}
      >
        {data.futureWishes.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.futureWishes.map((wish) => (
              <FutureWishCard key={wish.id} wish={wish} />
            ))}
          </div>
        ) : (
          <ArchiveEmptyState
            title="Blessings for the year ahead will appear here."
            body="Approved prayers and future wishes will gather here with room to breathe."
          />
        )}
      </ChapterSection>

      <ChapterSection
        id="open-when"
        label="Open When"
        title="Letters for later days."
        subtitle="A private drawer"
        body="Some words are not for one day only. Some are for the days you need them most."
      >
        <OpenWhenLetters letters={data.openWhenLetters} />
      </ChapterSection>

      <ChapterSection
        id="milestone"
        label="Special Milestone"
        title="A proud new chapter."
        subtitle="Defense, graduation, becoming"
        body="The archive also remembers the year Elizabeth stepped across another threshold."
      >
        <MilestoneCard />
      </ChapterSection>

      <ChapterSection
        id="future-empire"
        label="Future Card"
        title="The life she is building."
        subtitle="Creative, peaceful, fully hers"
        body="A small card for the dreams that already have her name written on them."
      >
        <FashionEmpireCard />
      </ChapterSection>

      <PastryBabeEasterEgg />
      <LilacSignatureEasterEgg />

      <ChapterSection
        id="favourites"
        label="Elizabeth's Favourites"
        title="The moments you keep close."
        subtitle="Saved by you"
        body="These are the moments you chose to keep close."
      >
        <FavouritesTeaser />
      </ChapterSection>

      <ChapterSection
        id="private-from-me"
        label="Private From Me Room"
        title={privateFromMe.title}
        subtitle={privateFromMe.subtitle}
        body={undefined}
      >
        <PrivateFromMeRoom title={privateFromMe.title} subtitle={privateFromMe.subtitle} body={privateFromMe.body} />
      </ChapterSection>

      <ChapterSection
        id="from-me"
        label="Final Chapter - From Me"
        title={fromMe.title}
        subtitle={fromMe.subtitle}
        body={fromMe.slug === "from-me" ? undefined : fromMe.body}
        className="pb-28"
      >
        <FinalLetter body={fromMe.body} />
      </ChapterSection>
    </ArchiveInteractionsProvider>
  );
}
