import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getSiteArticle, type PublicArticle } from "@/lib/content";
import { formatDate } from "@/lib/dates";
import { getPostBySlug } from "@/lib/wordpress/queries";

export const revalidate = 3600;

type Params = { slug: string };

/**
 * Un article peut venir de l'espace bénévoles ou du WordPress ; les articles
 * publiés sur le site sont prioritaires (même adresse = même contenu).
 */
async function findArticle(slug: string): Promise<PublicArticle | null> {
  const own = await getSiteArticle(slug);
  if (own) return own;

  const post = await getPostBySlug(slug);
  if (!post) return null;
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    dateISO: post.dateISO,
    cover: post.cover
      ? {
          url: post.cover.url,
          alt: post.cover.alt,
          width: post.cover.width ?? 1600,
          height: post.cover.height ?? 1200,
        }
      : null,
    contentHtml: post.contentHtml,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await findArticle(slug);
  if (!post) return { title: "Article introuvable" };
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/actualites/${post.slug}` },
    openGraph: post.cover
      ? { images: [{ url: post.cover.url, alt: post.cover.alt }] }
      : undefined,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await findArticle(slug);
  if (!post) notFound();

  return (
    <article className="bg-ivory">
      <header className="on-dark relative overflow-hidden bg-ink pt-36 pb-14 text-ivory lg:pt-44 lg:pb-16">
        <div aria-hidden className="pattern-zellige absolute inset-0" />
        <Container className="relative">
          <Reveal>
            <Eyebrow onDark>Actualité</Eyebrow>
            <h1 className="mt-7 max-w-4xl font-display text-4xl leading-[1.05] font-medium tracking-[-0.01em] text-ivory sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <time
              dateTime={post.dateISO}
              className="mt-6 block text-[0.72rem] font-semibold tracking-[0.26em] text-ivory/80 uppercase"
            >
              Publié le {formatDate(post.dateISO)}
            </time>
          </Reveal>
        </Container>
      </header>

      {post.cover ? (
        <Container className="pt-12 lg:pt-16">
          <Reveal>
            <figure className="relative aspect-[16/9] overflow-hidden bg-sand">
              <Image
                src={post.cover.url}
                alt={post.cover.alt}
                fill
                sizes="(min-width: 1024px) 76rem, 94vw"
                className="object-cover"
                priority
              />
            </figure>
          </Reveal>
        </Container>
      ) : null}

      <Container className="py-14 lg:py-20">
        <Reveal>
          <div
            className="wp-prose mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-14 max-w-3xl border-t hairline pt-8">
            <Link
              href="/actualites"
              className="link-editorial text-[0.72rem] font-semibold tracking-[0.2em] text-charcoal uppercase"
            >
              ← Toutes les actualités
            </Link>
          </p>
        </Reveal>
      </Container>
    </article>
  );
}
