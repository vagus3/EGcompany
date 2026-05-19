import Link from "next/link";

const departments = [
  { icon: "👥", label: "HR", slug: "hr" },
  { icon: "💰", label: "FINANCE", slug: "finance" },
  { icon: "🔬", label: "RESEARCH", slug: "research" },
  { icon: "🚚", label: "TRANSPORT", slug: "transport" },
  { icon: "🔒", label: "SECURITY", slug: "security" },
];

export default function DepartmentSidebar() {
  return (
    <aside className="space-y-6">
      <div className="border border-gray-200 p-5">
        <p className="mb-0.5 text-sm font-bold text-black">Department Portals</p>
        <p className="mb-5 text-[10px] tracking-widest text-gray-400 uppercase">
          Internal Access Only
        </p>
        <ul className="space-y-1">
          {departments.map(({ icon, label, slug }) => (
            <li key={label}>
              <Link
                href={`/portals/${slug}`}
                className="flex items-center gap-3 px-3 py-2 text-xs tracking-widest text-gray-600 uppercase transition-colors hover:bg-gray-50 hover:text-black"
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
