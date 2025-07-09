import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('blogs')
export class Blog extends BaseEntity {
  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  excerpt?: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ nullable: true })
  publishedAt?: Date;

  @Column('simple-array', { default: [] })
  tags: string[];

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @ManyToOne(() => User, user => user.blogs)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  get isPublic(): boolean {
    return this.isPublished && this.publishedAt !== undefined;
  }

  publish(): void {
    this.isPublished = true;
    this.publishedAt = new Date();
  }

  unpublish(): void {
    this.isPublished = false;
    this.publishedAt = undefined;
  }
} 