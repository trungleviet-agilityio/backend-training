/**
 * This file contains the entity for the comment.
 */

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('comments')
export class Comment extends AbstractEntity<Comment> {
  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'author_uuid' })
  authorUuid: string;

  @Column({ name: 'post_uuid' })
  postUuid: string;

  @Column({ name: 'parent_uuid', nullable: true })
  parentUuid?: string;

  @Column({ name: 'depth_level', default: 0 })
  depthLevel: number;

  @Column({ name: 'likes_count', default: 0 })
  likesCount: number;

  // Relations
  @ManyToOne(() => User, user => user.comments)
  @JoinColumn({ name: 'author_uuid' })
  author: User;

  @ManyToOne(() => Post, post => post.comments)
  @JoinColumn({ name: 'post_uuid' })
  post: Post;

  // Self-referencing relationship for comment threading
  @ManyToOne(() => Comment, comment => comment.replies, { nullable: true })
  @JoinColumn({ name: 'parent_uuid' })
  parent?: Comment;

  @OneToMany(() => Comment, comment => comment.parent)
  replies: Comment[];
}
