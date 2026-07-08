type GallerySectionIntroProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export function GallerySectionIntro({ eyebrow, title, body }: GallerySectionIntroProps) {
  return (
    <div className="mx-auto mb-7 max-w-3xl text-center sm:mb-9">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-deep-lilac/72">{eyebrow}</p>
      <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight text-espresso sm:text-4xl">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-espresso/58">{body}</p>
    </div>
  );
}
