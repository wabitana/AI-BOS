import { Users, Mail, MoreHorizontal, ChevronDown } from 'lucide-react';

/**
 * Members settings page — manage organization members and roles.
 * Data table with invite flow.
 */
export default function MembersPage() {
  // Placeholder members for UI scaffolding
  const members = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'OWNER', avatar: null },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'ADMIN', avatar: null },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'MEMBER', avatar: null },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Members</h2>
            <p className="text-sm text-muted-foreground">Manage who has access to this organization.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110">
          <Mail className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {/* Members Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Joined
              </th>
              <th className="w-12 px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((member) => (
              <tr key={member.id} className="transition-colors hover:bg-muted/20">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent">
                    {member.role}
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">2 days ago</td>
                <td className="px-6 py-4">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label="Member options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pending Invitations */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-medium text-foreground">Pending Invitations</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No pending invitations.
        </p>
      </div>
    </div>
  );
}
