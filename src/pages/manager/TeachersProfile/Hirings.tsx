import ProfileHeader from "./ProfileHeader";
import AboutMe from "./AboutMe";
import Skills from "./Skills";
import TabsSection from "./TabsSection";
import { useFetch } from "../../../api";
import { useParams } from "react-router-dom";

import SocialLinks from "./SocialLinks"; // adjust relative path
// export the same SocialLink type your Hirings expects
export type SocialLink = {
  id: string;
  type: "email" | "phone" | "instagram" | "twitter" | "website" | "custom";
  label?: string;
  value: string;
};

const DEFAULT_LINKS: SocialLink[] = [
  { id: "1", type: "email", label: "Email", value: "jakegyll@email.com" },
  { id: "2", type: "phone", label: "Phone", value: "+44 1245 572 135" },
  { id: "3", type: "instagram", label: "Instagram", value: "instagram.com/jakegyll" },
  { id: "4", type: "twitter", label: "Twitter", value: "twitter.com/jakegyll" },
  { id: "5", type: "website", label: "Website", value: "www.jakegyll.com" },
];

const normalizePlatformToType = (platform?: string): SocialLink["type"] => {
  if (!platform) return "custom";
  const p = platform.toLowerCase().trim();
  if (p.includes("email") || p === "mailto") return "email";
  if (p.includes("phone") || p === "tel") return "phone";
  if (p.includes("instagram")) return "instagram";
  if (p.includes("twitter")) return "twitter";
  // backend has "Linkedin" — map to website (or to "custom" if you prefer)
  if (p.includes("linkedin")) return "website";
  if (p.includes("site") || p.includes("website") || p.includes("web")) return "website";
  return "custom";
};

const makeLabelFromPlatform = (platform?: string, url?: string) => {
  if (platform) {
    // Capitalize first letter
    const p = platform.charAt(0).toUpperCase() + platform.slice(1);
    return p;
  }
  if (url) {
    // fallback: hostname
    try {
      const u = url.startsWith("http") ? new URL(url) : new URL(`https://${url}`);
      return u.hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  }
  return "Link";
};

const Hirings = () => {
  const params = useParams < { id?: string } > ();
  const id = params.id;

  console.log("route params:", params);

  const shouldFetch = Boolean(id);
  const { data: profile, isLoading, error } = useFetch(
    ["profile", id],
    shouldFetch ? `/profile/${id}` : null,
    true,
    { requiresAuth: true }
  );

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center text-yellow-600">
        Missing profile id in route. Check that the route is defined as <code>/profile/:id</code> and that you're navigating with an id.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading profile.
      </div>
    );
  }

  // Build social links canonical array (email, phone, then backend socialLinks)
  const buildSocialLinks = (): SocialLink[] => {
    if (!profile) return DEFAULT_LINKS;

    const seen = new Set < string > ();
    const out: SocialLink[] = [];
    let counter = 1;

    // 1) Email from userId.email
    const email = profile?.userId?.email;
    if (email && typeof email === "string" && email.trim()) {
      const value = email.trim();
      if (!seen.has(value)) {
        out.push({ id: String(counter++), type: "email", label: "Email", value });
        seen.add(value);
      }
    }

    // 2) Phone / mobile
    const phone = profile?.mobile;
    if (phone && typeof phone === "string" && phone.trim()) {
      const value = phone.trim();
      if (!seen.has(value)) {
        out.push({ id: String(counter++), type: "phone", label: "Phone", value });
        seen.add(value);
      }
    }

    // 3) backend provided socialLinks array (platform + url)
    if (Array.isArray(profile?.socialLinks)) {
      profile.socialLinks.forEach((s: any) => {
        const platform = (s?.platform ?? s?.name ?? s?.label ?? "").toString();
        const rawUrl = (s?.url ?? s?.value ?? "").toString().trim();
        if (!rawUrl) return;
        if (seen.has(rawUrl)) return;

        const type = normalizePlatformToType(platform);
        const label = s?.label ? s.label : makeLabelFromPlatform(platform, rawUrl);

        out.push({
          id: String(counter++),
          type,
          label,
          value: rawUrl,
        });
        seen.add(rawUrl);
      });
    }

    // If we ended up with no links at all, fall back to DEFAULT_LINKS
    if (!out.length) return DEFAULT_LINKS;

    return out;
  };

  const socialLinks: SocialLink[] = buildSocialLinks();

  console.log("", socialLinks);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="w-full mb-6">
          <ProfileHeader profile={profile} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <AboutMe profile={profile || {}} />
            <Skills skills={profile?.skills || []} />
            <SocialLinks links={socialLinks} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <TabsSection profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hirings;
