import type {D1Database} from "@cloudflare/workers-types";
import {DBKit} from "../../_utils/db";
import {QueryChatScrollRo, QueryMailScrollRo, SendMailRo} from "../../types/http";
import {PrismaKit} from "../../_utils/prisma";
import sql, {raw} from "sql-template-tag";
import {Mail} from "@prisma/client";

export enum Schema {
  Mail = 'mail'
}

export class MailService {

  /**
   * 查询用户列表(根据最新沟通记录排序)
   * @param client
   * @param ro
   */
  static async scrollByChat(client: D1Database, ro: QueryChatScrollRo) {
    let [cli, x] = DBKit.getCli(client);
    let keyword = ro.keyword;
    let rawSql = PrismaKit.Raw.sql(
      sql`WITH LatestMail AS (SELECT M.*,
                                   MAX(M.date) AS latest_reply_time
                            FROM Mail M
                            WHERE M.owner = ${ro.owner}
                            GROUP BY M.from_address),
             UnreadCounts AS (SELECT M.*,
                                     COUNT(*) FILTER (WHERE M.is_read = 0) AS unread_count
                              FROM Mail M
                              WHERE M.owner = ${ro.owner}
                              GROUP BY M.from_address)
        SELECT LM.*,
               UC.unread_count
        FROM LatestMail LM
               JOIN UnreadCounts UC ON LM.from_address = UC.from_address`,
      PrismaKit.Raw.where([
        PrismaKit.Raw.if(sql`AND (LM.subject LIKE ${keyword} OR LM.text LIKE ${keyword})`, keyword),
        PrismaKit.Raw.if(sql`AND (LM.is_read = false)`, ro?.onlyUnread),
      ]),
      PrismaKit.Raw.orderBy(['LM.date DESC']));
    return (await cli.scrollRaw(rawSql, ro)).convert(this.asMail);
  }

  /**
   * 查询与某用户的沟通记录
   * @param client
   * @param ro
   */
  static async scrollByMail(client: D1Database, ro: QueryMailScrollRo) {
    let [cli] = DBKit.getCli(client);
    let keyword = ro.keyword;
    let rawSql = PrismaKit.Raw.sql(
      'SELECT M.* FROM Mail M',
      PrismaKit.Raw.where([
        PrismaKit.Raw.if(sql`AND (M.subject LIKE ${keyword} OR M.text LIKE ${keyword})`, keyword),
      ]),
      PrismaKit.Raw.orderBy(['M.id'])
    );
    return (await cli.scrollRaw(rawSql, ro)).convert(this.asMail);
  }

  /**
   * 发送邮件
   * @param client
   * @param ro
   */
  static async sendMail(client: D1Database, ro: SendMailRo) {
    let [cli, prisma] = DBKit.getCli(client);
    // await Email.send(payload);
  }

  static asMail(entity: (Mail | any)) {
    return {
      id: entity.id,
      headers: JSON.parse(entity.headers),
      fromAddress: JSON.parse(entity.from_address),
      sender: JSON.parse(entity.sender),
      replyTo: JSON.parse(entity.reply_to),
      toAddress: JSON.parse(entity.to_address),
      cc: JSON.parse(entity.cc),
      bcc: JSON.parse(entity.bcc),
      returnPath: JSON.parse(entity.return_path),
      deliveredTo: entity.delivered_to,
      subject: entity.subject,
      messageId: entity.message_id,
      inReplyTo: entity.in_reply_to,
      reference: entity.reference,
      date: entity.date,
      html: entity.html,
      text: entity.text,
      attachments: entity.attachments,
      isRead: entity.is_read,
      isImportant: entity.is_important,
      createdAt: entity.created_at,
      lastUpdatedAt: entity.last_updated_at,
      unreadCount: entity?.unread_count,
    }
  }
}