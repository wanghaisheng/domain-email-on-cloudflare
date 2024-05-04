import type {Paging, Scroll, ScrollRo} from "@hocgin/nextjs-kit";

export interface IMail {
  address: string;
  name?: string;
  icon?: string;

  [key: string]: any
}

export interface Mail {
  id: string,
  headers: Record<string, string>[],
  fromAddress: IMail,
  sender: IMail,
  replyTo: IMail[],
  toAddress: IMail[],
  cc: IMail[],
  bcc: IMail[],
  returnPath: string,
  deliveredTo: string,
  subject: string,
  messageId: string,
  inReplyTo: string,
  reference: string,
  date: string,
  html: string,
  text: string,
  attachments: string[],
  isRead: boolean,
  isTrash: boolean,
  isArchive: boolean,
  createdAt: string,
  lastUpdatedAt: string,
  unreadCount: number;
  labels?: string[];
}


export type ListAccountVo = IMail[];

export interface ChatUserScrollRo extends ScrollRo {
  owner: string;
  keyword?: string;
  onlyUnread?: boolean;
}

export interface ChatHistoryScrollRo extends ScrollRo {
  keyword?: string;
  fromAddress?: string;
}

export interface MailScrollRo extends ScrollRo {
  owner: string;
  keyword?: string;
  onlyUnread?: boolean;
  isTrash?: boolean;
  isArchive?: boolean;
}

export interface SendMailRo {
  from: IMail
  to: IMail[];
  cc?: IMail[];
  bcc?: IMail[];
  subject: string
  html?: string
  attachments?: string
}
