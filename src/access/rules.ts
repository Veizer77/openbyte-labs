export type AdminRole = "owner" | "editor";
export type Action =
  "read" | "create" | "update" | "delete" | "publish" | "restore";
export type Resource =
  | "site-settings"
  | "pages"
  | "services"
  | "testimonials"
  | "faqs"
  | "categories"
  | "technologies"
  | "projects"
  | "service-packages"
  | "service-addons"
  | "media"
  | "calculator-groups"
  | "calculator-items"
  | "inquiries"
  | "quote-requests"
  | "consultation-bookings"
  | "availability-rules"
  | "blocked-dates"
  | "users"
  | "audit-logs"
  | "client-projects"
  | "digital-products"
  | "digital-orders"
  | "digital-coupons"
  | "digital-reviews";

export interface AdminPrincipal {
  id: string;
  role: AdminRole;
  twoFactorVerified: boolean;
}

const contentResources: ReadonlySet<string> = new Set([
  "pages",
  "services",
  "testimonials",
  "faqs",
  "categories",
  "technologies",
  "projects",
  "service-packages",
  "service-addons",
  "media",
  "calculator-groups",
  "calculator-items",
  "digital-products",
  "digital-reviews",
]);
const ownerResources: ReadonlySet<string> = new Set([
  ...contentResources,
  "site-settings",
  "digital-orders",
  "digital-coupons",
  "inquiries",
  "quote-requests",
  "consultation-bookings",
  "availability-rules",
  "blocked-dates",
  "users",
  "audit-logs",
  "client-projects",
]);
const settingsFields = new Set([
  "general",
  "hero",
  "navigation",
  "seo",
  "whatsapp",
  "calculator",
  "booking",
  "tracking",
  "legal",
]);
const actions = new Set([
  "read",
  "create",
  "update",
  "delete",
  "publish",
  "restore",
]);
const resourceActions: Record<string, readonly string[]> = {
  "client-projects": ["read", "create", "update"],
  pages: ["read", "create", "update", "delete", "publish", "restore"],
  projects: ["read", "create", "update", "delete", "publish", "restore"],
  "service-packages": ["read", "create", "update", "delete", "restore"],
  services: ["read", "create", "update", "delete"],
  testimonials: ["read", "create", "update", "delete"],
  faqs: ["read", "create", "update", "delete"],
  categories: ["read", "create", "update", "delete"],
  technologies: ["read", "create", "update", "delete"],
  "service-addons": ["read", "create", "update", "delete"],
  media: ["read", "create", "update", "delete"],
  "calculator-groups": ["read", "create", "update", "delete"],
  "calculator-items": ["read", "create", "update", "delete"],
  "digital-products": ["read", "create", "update", "delete", "publish", "restore"],
  "digital-orders": ["read", "create", "update", "delete"],
  "digital-coupons": ["read", "create", "update", "delete"],
  "digital-reviews": ["read", "update"],
  inquiries: ["read", "update"],
  "quote-requests": ["read", "update"],
  "consultation-bookings": ["read", "update"],
  "availability-rules": ["read", "create", "update", "delete"],
  "blocked-dates": ["read", "create", "update", "delete"],
  users: ["read", "create", "update"],
};

/** Default deny; this policy does not replace server-side session verification. */
export function canAccess(
  principal: AdminPrincipal | null,
  resource: string,
  action: string,
  fields: readonly string[] = [],
): boolean {
  if (
    !principal?.id ||
    principal.twoFactorVerified !== true ||
    !actions.has(action)
  )
    return false;
  if (principal.role !== "owner" && principal.role !== "editor") return false;
  if (!ownerResources.has(resource)) return false;
  if (resource === "audit-logs")
    return (
      principal.role === "owner" && action === "read" && fields.length === 0
    );
  if (resource === "site-settings") {
    if (action !== "read" && action !== "update") return false;
    if (!fields.length || fields.some((field) => !settingsFields.has(field)))
      return false;
    return (
      principal.role === "owner" ||
      fields.every(
        (field) =>
          field !== "whatsapp" &&
          field !== "tracking" &&
          !(field === "booking" && action === "update"),
      )
    );
  }
  if (fields.length) return false;
  if (!resourceActions[resource]?.includes(action)) return false;
  if (principal.role === "owner") return true;
  return contentResources.has(resource);
}

export class AccessDeniedError extends Error {
  constructor() {
    super("Akses ditolak.");
    this.name = "AccessDeniedError";
  }
}

export function authorize(
  principal: AdminPrincipal | null,
  resource: string,
  action: string,
  fields: readonly string[] = [],
): asserts principal is AdminPrincipal {
  if (!canAccess(principal, resource, action, fields))
    throw new AccessDeniedError();
}
