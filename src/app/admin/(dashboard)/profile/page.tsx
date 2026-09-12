import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/admin/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  const existing = await prisma.teamMember.findUnique({ where: { userId: session!.user.id } });

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>My Profile</h1>
      <p style={{ fontSize: 13.5, color: "#5b6472", marginBottom: 20, maxWidth: 480 }}>
        This photo and bio appear on the public website&apos;s &quot;Our Team&quot; section. Untick &quot;Show on public site&quot; if you&apos;d rather keep it hidden for now.
      </p>
      <ProfileForm
        existing={
          existing
            ? { title: existing.title, bio: existing.bio, visible: existing.visible, hasPhoto: !!existing.photo, id: existing.id }
            : null
        }
      />
    </div>
  );
}
