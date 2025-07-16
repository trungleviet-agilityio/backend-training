/**
 * This file contains the entity for the post.
 */

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity('posts')
export class Post extends AbstractEntity<Post> {
  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'author_uuid' })
  authorUuid: string;

  @Column({ name: 'likes_count', default: 0 })
  likesCount: number;

  @Column({ name: 'comments_count', default: 0 })
  commentsCount: number;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  // Relations
  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'author_uuid' })
  author: User;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];
}
