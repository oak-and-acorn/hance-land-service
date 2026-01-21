'use client'

import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

interface SocialMediaIconProps {
  platform: string
  url: string
  className?: string
}

export default function SocialMediaIcon({ platform, url, className = "w-8 h-8" }: SocialMediaIconProps) {
  const iconMap = {
    facebook: FaFacebook,
    instagram: FaInstagram,
    twitter: FaXTwitter,
    linkedin: FaLinkedin,
    youtube: FaYoutube,
    tiktok: FaTiktok,
  }

  const Icon = iconMap[platform.toLowerCase() as keyof typeof iconMap]

  if (!Icon) {
    return null
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform}
      className="text-white hover:text-orange-500 transition-colors duration-200"
    >
      <Icon className={className} />
    </a>
  )
}
