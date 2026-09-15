import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      type: true,
      title: true,
      slug: true,
      excerpt: true,
      body: true,
      metaTitle: true,
      metaDescription: true,
      status: true,
      coverImageType: true,
    },
  });

  if (!post) notFound();

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Edit Post</h1>
      <PostForm
        mode="edit"
        postId={id}
        hasCover={!!post.coverImageType}
        initial={{
          type: post.type,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          body: post.body,
          metaTitle: post.metaTitle || "",
          metaDescription: post.metaDescription || "",
          status: post.status,
        }}
      />
    </div>
  );
}
