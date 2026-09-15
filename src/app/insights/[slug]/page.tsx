import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function getPost(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      type: true,
      title: true,
      excerpt: true,
      body: true,
      metaTitle: true,
      metaDescription: true,
      publishedAt: true,
      coverImageType: true,
      author: { select: { name: true } },
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.coverImageType ? [`/api/post-covers/${post.id}`] : undefined,
      type: "article",
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const paragraphs = post.body.split(/\n\s*\n/).filter(Boolean);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="container" style={{ padding: "56px 24px 96px", maxWidth: 760 }}>
        <Link href="/#insights" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>
          ← Back to Insights
        </Link>

        <div style={{ marginTop: 24, fontSize: 11.5, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--accent)", fontWeight: 700 }}>
          {post.type === "CASE_STUDY" ? "Case Study" : "Article"}
        </div>
        <h1 className="serif" style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, lineHeight: 1.2, marginTop: 10 }}>
          {post.title}
        </h1>
        <div style={{ marginTop: 12, fontSize: 13.5, color: "var(--ink-faint)" }}>
          {post.author?.name && <span>{post.author.name} · </span>}
          {post.publishedAt &&
            new Date(post.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
        </div>

        {post.coverImageType && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/post-covers/${post.id}`}
            alt=""
            style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", marginTop: 28, borderRadius: 2 }}
          />
        )}

        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 18 }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: 16, lineHeight: 1.75, color: "var(--ink-soft)" }}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
