import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { LOCAL_ANNOUNCEMENTS } from "@/content/announcements";
import { isActive, sortAnnouncements } from "@/lib/announcements";
import { formatDate } from "@/lib/dates";
import { getPosts } from "@/lib/wordpress/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Les annonces et actualités de la mosquée Omar Ibn al Khattab de Creil : vie de la mosquée, avancement du projet, événements de la communauté.",
  alternates: { canonical: "/actualites" },
};

export default async function ActualitesPage() {
  const posts = await getPosts({ perPage: 12 });
  const announcements = sortAnnouncements(LOCAL_ANNOUNCEMENTS);

  return (
    <>
      <PageHeader
        eyebrow="Actualités"
        title={
          <>
            La vie
            <br />
            <em className="font-light italic">de la mosquée</em>
          </>
        }
        lead="Annonces officielles, avancement du projet et moments de la communauté."
      />

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          {/* Annonces curées — toujours disponibles, même sans CMS */}
          <Reveal>
            <h2 className="flex items-center gap-4 text-[0.68rem] font-semibold tracking-[0.28em] text-taupe uppercase">
              <span aria-hidden className="h-px w-10 bg-beige" />
              Annonces de la mosquée
            </h2>
          </Reveal>
          <div className="mt-8 border-t hairline">
            {announcements.map((a, index) => {
              const active = isActive(a);
              return (
                <Reveal key={a.id} delay={index * 0.05}>
                  <article className="grid gap-3 border-b hairline py-8 sm:grid-cols-12 sm:gap-8">
                    <div className="sm:col-span-3">
                      <time
                        dateTime={a.publishedAt}
                        className="text-[0.72rem] font-semibold tracking-[0.24em] text-taupe uppercase"
                      >
                        {formatDate(a.publishedAt)}
                      </time>
                      {!active ? (
                        <p className="mt-2 text-[0.62rem] font-semibold tracking-[0.24em] text-beige uppercase">
                          Annonce passée
                        </p>
                      ) : null}
                    </div>
                    <div className="sm:col-span-9">
                      <h3 className="font-display text-2xl leading-snug font-medium text-charcoal sm:text-3xl">
                        {a.title}
                      </h3>
                      {a.body ? (
                        <p className="mt-3 max-w-2xl text-[0.95rem] leading-[1.8] text-charcoal/70">
                          {a.body}
                        </p>
                      ) : null}
                      {a.href ? (
                        <Link
                          href={a.href}
                          className="link-editorial mt-4 inline-block text-[0.72rem] font-semibold tracking-[0.2em] text-charcoal uppercase"
                        >
                          {a.hrefLabel ?? "En savoir plus"}
                        </Link>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {/* Articles du CMS */}
          <Reveal>
            <h2 className="mt-20 flex items-center gap-4 text-[0.68rem] font-semibold tracking-[0.28em] text-taupe uppercase">
              <span aria-hidden className="h-px w-10 bg-beige" />
              Articles
            </h2>
          </Reveal>

          {posts === null ? (
            <Reveal delay={0.05}>
              <div className="mt-8 border hairline bg-cream p-8 sm:p-10">
                <p className="font-display text-2xl font-medium text-charcoal">
                  Les articles sont momentanément indisponibles.
                </p>
                <p className="mt-3 max-w-xl text-[0.95rem] leading-[1.8] text-charcoal/65">
                  La connexion à l’espace de publication n’a pas abouti. Les
                  annonces ci-dessus restent à jour ; vous pouvez également
                  suivre les informations de la mosquée sur MAWAQIT ou nous
                  contacter directement.
                </p>
              </div>
            </Reveal>
          ) : posts.length === 0 ? (
            <Reveal delay={0.05}>
              <p className="mt-8 max-w-xl text-[0.95rem] leading-[1.8] text-charcoal/65">
                Aucun article publié pour le moment — les prochaines
                publications de la mosquée apparaîtront ici.
              </p>
            </Reveal>
          ) : (
            <div className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.id} delay={(index % 3) * 0.06}>
                  <article className="group flex h-full flex-col">
                    <Link
                      href={`/actualites/${post.slug}`}
                      className="flex h-full flex-col"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                        {post.cover ? (
                          <Image
                            src={post.cover.url}
                            alt={post.cover.alt}
                            fill
                            sizes="(min-width: 1024px) 30vw, 92vw"
                            className="object-cover transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out-soft)] group-hover:scale-[1.04] motion-reduce:transition-none"
                          />
                        ) : (
                          <div
                            aria-hidden
                            className="pattern-khatam absolute inset-0"
                          />
                        )}
                      </div>
                      <time
                        dateTime={post.dateISO}
                        className="mt-5 text-[0.68rem] font-semibold tracking-[0.24em] text-taupe uppercase"
                      >
                        {formatDate(post.dateISO)}
                      </time>
                      <h3 className="mt-3 font-display text-2xl leading-snug font-medium text-charcoal">
                        {post.title}
                      </h3>
                      {post.excerpt ? (
                        <p className="mt-3 line-clamp-3 text-[0.9rem] leading-[1.75] text-charcoal/65">
                          {post.excerpt}
                        </p>
                      ) : null}
                      <span className="link-editorial mt-5 inline-block self-start text-[0.7rem] font-semibold tracking-[0.2em] text-charcoal uppercase">
                        Lire l’article →
                      </span>
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
