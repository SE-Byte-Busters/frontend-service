import Image from "next/image";

interface UserAvatarProps {
  picture: string | null;
  username: string;
  className?: string;
  width?: number;
  height?: number;
}

const DEFAULT_PROFILE_IMAGE = "/images/avatars/default-profile.png";

export default function UserAvatar({
  picture,
  username,
  className = "",
  width = 64,
  height = 64,
}: UserAvatarProps) {
  const imageSrc = picture || DEFAULT_PROFILE_IMAGE;

  return (
    <Image
      src={imageSrc}
      width={width}
      height={height}
      alt={`${username}'s profile picture`}
      className={`bg-white rounded-full border border-gray-300 ${className}`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = DEFAULT_PROFILE_IMAGE;
      }}
    />
  );
}
