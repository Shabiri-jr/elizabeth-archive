import { ArchiveEmptyState } from "@/components/archive/ArchiveEmptyState";
import { GalleryGrid } from "@/components/archive/GalleryGrid";
import { MemoryTimeline } from "@/components/archive/MemoryTimeline";
import { MessageCard } from "@/components/archive/MessageCard";
import { FutureWishCard } from "@/components/archive/FutureWishCard";
import { OpenWhenLetters } from "@/components/archive/OpenWhenLetters";
import { VoicesSection } from "@/components/archive/VoicesSection";
import { parseFavouriteKey } from "@/lib/archive/favourites";
import type { ArchiveData } from "@/lib/archive/queries";

type FavouriteMomentsProps = {
  data: ArchiveData;
  favouriteKeys: string[];
};

export function FavouriteMoments({ data, favouriteKeys }: FavouriteMomentsProps) {
  const parsedKeys = favouriteKeys.map(parseFavouriteKey).filter(Boolean);
  const hasFavourite = (itemType: string, itemId: string) =>
    parsedKeys.some((key) => key?.itemType === itemType && key.itemId === itemId);

  const messages = data.messages.filter((message) => hasFavourite("submission", message.id));
  const memories = data.memories.filter((memory) => hasFavourite("memory", memory.id));
  const futureWishes = data.futureWishes.filter((wish) => hasFavourite("future_wish", wish.id));
  const images = data.images.filter((image) => hasFavourite("media", image.id));
  const audio = data.audio.filter((item) => hasFavourite("media", item.id));
  const videos = data.videos.filter((item) => hasFavourite("media", item.id));
  const letters = data.openWhenLetters.filter((letter) => hasFavourite("open_when_letter", letter.id));
  const hasAny =
    messages.length || memories.length || futureWishes.length || images.length || audio.length || videos.length || letters.length;

  if (!hasAny) {
    return (
      <ArchiveEmptyState
        title="Your favourite moments will live here."
        body="Tap the little heart beside a message, memory, photo, wish, voice note, or Open When letter to keep it close."
      />
    );
  }

  return (
    <div className="space-y-16">
      {messages.length ? (
        <section>
          <h2 className="font-serif text-4xl font-semibold text-espresso">Saved messages</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {messages.map((message) => (
              <MessageCard key={message.id} submission={message} />
            ))}
          </div>
        </section>
      ) : null}

      {memories.length ? (
        <section>
          <h2 className="font-serif text-4xl font-semibold text-espresso">Saved memories</h2>
          <div className="mt-6">
            <MemoryTimeline memories={memories} />
          </div>
        </section>
      ) : null}

      {images.length ? (
        <section>
          <h2 className="font-serif text-4xl font-semibold text-espresso">Saved photos</h2>
          <div className="mt-6">
            <GalleryGrid images={images} />
          </div>
        </section>
      ) : null}

      {audio.length || videos.length ? (
        <section>
          <h2 className="font-serif text-4xl font-semibold text-espresso">Saved voices</h2>
          <div className="mt-6">
            <VoicesSection audio={audio} videos={videos} />
          </div>
        </section>
      ) : null}

      {futureWishes.length ? (
        <section>
          <h2 className="font-serif text-4xl font-semibold text-espresso">Saved wishes</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {futureWishes.map((wish) => (
              <FutureWishCard key={wish.id} wish={wish} />
            ))}
          </div>
        </section>
      ) : null}

      {letters.length ? (
        <section>
          <h2 className="font-serif text-4xl font-semibold text-espresso">Saved Open When letters</h2>
          <div className="mt-6">
            <OpenWhenLetters letters={letters} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

