export interface Tellonym {
  avatarFileName: string;
  follwerCount: number;
  anonymousFollowerCount: number;
  followingCount: number;
  id: number;
  displayName: string;
  username: string;
  aboutMe: string | null;
  likesCount: number;
  answerCount: number;
  tellCount: number;
  answers: {
    type: string;
    postType: number;
    id: number;
    answer: string;
    likesCount: number;
    createdAt: string;
    tell: string;
    isLiked: boolean;
    userId: number;
    senderStatus: number;
    sender: {
      id: number;
      username: string;
      avatarFileName: string;
      isVerified: boolean;
    };
    isCurrentUserTellSender: boolean;
    likes: {
      count: number;
      isLiked: boolean;
      isLikedBySender: boolean;
      previewUsers: string[];
    };
    media: unknown[];
    pointsKarma: number;
    rtType: unknown;
    rtVariance: unknown;
  }[];
  adExpId: string;
  isAbleToChat: boolean;
  pinnedPosts: unknown[];
  tintColor: number;
  badge: number;
  statusEmoji: number;
  isFollowed: boolean;
  followNotificationType: number;
  isVerified: boolean;
  isBlocked: boolean;
  isBlockedBy: boolean;
  linkData: {
    id: number;
    status: number;
    type: number;
    link: string;
  }[];
  countryCode: string;
  isActive: boolean;
  avatars: {
    avatarFileName: string;
    position: number;
  }[];
}
