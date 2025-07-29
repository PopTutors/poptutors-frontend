type MilestoneBadgeProps = {
  text: string;
};

export default function MilestoneBadge({ text }: MilestoneBadgeProps) {
  return <span className="text-xs text-sky-500 font-medium ml-2">{text}</span>;
}
