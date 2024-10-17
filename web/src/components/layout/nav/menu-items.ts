import {
  ChatBubbleIcon,
  CheckCircle,
  EditIcon,
  FilePlus,
  FilledStarIcon,
  Globe,
  MicIcon,
  Play,
  ReviewIcon,
  ShareLinkIcon,
  TranscribeIcon,
} from '../../ui/icons'
import URLS from '../../../urls'
import { NavItem } from './nav'
import { MenuConfig } from './contribute-menu'

export const menuItems: Record<NavItem, MenuConfig> = {
  speak: {
    items: [
      {
        icon: MicIcon,
        internalHref: URLS.SPEAK,
        localizedId: 'read-sentences',
      },
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
      {
        icon: Play,
        internalHref: URLS.LISTEN,
        localizedId: 'validate-readings',
      },
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
      {
        icon: EditIcon,
        internalHref: URLS.WRITE,
        localizedId: 'add-sentences',
      },
      {
        icon: ReviewIcon,
        internalHref: URLS.REVIEW,
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
      {
        icon: FilledStarIcon,
        localizedId: 'partners',
        internalHref: URLS.PARTNER,
      },
      {
        icon: ShareLinkIcon,
        localizedId: 'press-and-stories',
        externalHref:
          'https://foundation.mozilla.org/en/blog/topic/common-voice/',
      },
      {
        icon: Globe,
        internalHref: URLS.LANGUAGES,
        localizedId: 'community-and-languages',
      },
    ],
  },
}
