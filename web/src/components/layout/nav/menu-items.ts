import {
  ChatBubbleIcon,
  CheckCircle,
  EditIcon,
  FilePlus,
  Globe,
  MicIcon,
  Play,
  ReviewIcon,
  ShareIcon,
  TranscribeIcon,
  TrendingUp,
} from '../../ui/icons'
import URLS from '../../../urls'
import { NavItem } from './nav'
import { MenuConfig } from './contribute-menu'

export const menuItems: Record<NavItem, MenuConfig> = {
  speak: {
    items: [
      { icon: MicIcon, href: URLS.SPEAK, localizedId: 'read-sentences' },
      {
        icon: ChatBubbleIcon,
        localizedId: 'answer-questions',
        requiresAuth: true,
      },
    ],
    renderContributableLocaleLock: true,
  },
  listen: {
    items: [
      { icon: Play, href: URLS.LISTEN, localizedId: 'validate-readings' },
      {
        icon: CheckCircle,
        localizedId: 'review-transcriptions',
        requiresAuth: true,
      },
    ],
    renderContributableLocaleLock: true,
  },
  write: {
    items: [
      { icon: EditIcon, href: URLS.WRITE, localizedId: 'add-sentences' },
      {
        icon: ReviewIcon,
        href: URLS.REVIEW,
        localizedId: 'review-sentences',
        requiresAuth: true,
      },
      { icon: FilePlus, localizedId: 'add-questions', requiresAuth: true },
      {
        icon: TranscribeIcon,
        localizedId: 'transcribe-audio',
        requiresAuth: true,
      },
    ],
  },
  download: {
    items: [],
  },
  about: {
    items: [
      { icon: TrendingUp, localizedId: 'partners', href: URLS.PARTNER },
      { icon: ShareIcon, localizedId: 'press-and-stories', requiresAuth: true },
      {
        icon: Globe,
        href: URLS.LANGUAGES,
        localizedId: 'community-and-languages',
      },
    ],
  },
}
