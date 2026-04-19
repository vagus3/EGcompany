import Link from "next/link";

const departments = [
  { icon: "👥", label: "HR",        slug: "hr"        },
  { icon: "💰", label: "FINANCE",   slug: "finance"   },
  { icon: "🔬", label: "RESEARCH",  slug: "research"  },
  { icon: "🚚", label: "TRANSPORT", slug: "transport" },
  { icon: "🔒", label: "SECURITY",  slug: "security"  },
];

export default function DepartmentSidebar() {
  return (
    <aside className="space-y-6">
      <div className="border border-gray-200 p-5">
        <p className="text-sm font-bold text-black mb-0.5">Department Portals</p>
        <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-5">Internal Access Only</p>
        <ul className="space-y-1">
          {departments.map(({ icon, label, slug }) => (
            <li key={label}>
              <Link
                href={`/portals/${slug}`}
                className="flex items-center gap-3 py-2 px-3 text-xs tracking-widest uppercase text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
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
