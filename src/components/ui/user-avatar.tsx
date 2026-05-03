import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  name?: string | null
  image?: string | null
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UserAvatar({ name, image, className, size = 'default' }: UserAvatarProps) {
  return (
    <Avatar size={size} className={cn(className)}>
      {image && <AvatarImage src={image} alt={name ?? 'User'} />}
      <AvatarFallback className="bg-[var(--autoapply-primary)] text-white text-xs font-medium">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
