import { Discord, Facebook, IG, Snapchat, Whatsapp } from "../../assets";


const socialLinks = [
  {
    icon:Whatsapp,
    url: "https://www.whatsapp.com",
  },
  {
    icon: Facebook,
    url: "https://www.facebook.com",
  },

  {
    icon: Snapchat,
    url: "https://www.snapchat.com",
  },
  {
    icon: IG,
    url: "https://www.instagram.com",
  },
  {
    icon: Discord,
    url: "https://www.discord.gg",
  },
];
const SocialLinks = () => {
  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform duration-300 hover:scale-110"
        >
          <img
            src={link.icon}
            alt={`Social icon ${index + 1}`}
            width={100}
            height={100}
            className="size-8"
          />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
