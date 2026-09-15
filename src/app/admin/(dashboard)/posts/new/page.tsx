import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>New Post</h1>
      <PostForm mode="create" />
    </div>
  );
}
