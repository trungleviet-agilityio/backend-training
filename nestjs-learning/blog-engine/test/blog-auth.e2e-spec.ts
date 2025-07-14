import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { User } from '../src/modules/user/entities/user.entity';
import { Blog } from '../src/modules/blog/entities/blog.entity';
import { createTestUser, generateTestEmail, generateSecureTestPassword } from './jest-test-setup';
import { DatabaseCleanupHelper } from './helpers/database-cleanup.helper';

/**
 * Blog Authentication E2E Tests
 * Tests JWT authentication and authorization for blog endpoints
 * Uses secure, non-hard-coded test data for better security practices
 */
describe('Blog Authentication & Authorization (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;
  let blogRepository: Repository<Blog>;
  let dataSource: DataSource;
  let cleanupHelper: DatabaseCleanupHelper;

  // Test users and tokens - generated dynamically
  let regularUser: any;
  let regularUserToken: string;
  let regularUserCredentials: any;
  let adminUser: any;
  let adminUserToken: string;
  let adminUserCredentials: any;
  let otherUser: any;
  let otherUserToken: string;
  let otherUserCredentials: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api/v1');

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    blogRepository = moduleFixture.get<Repository<Blog>>(getRepositoryToken(Blog));
    dataSource = moduleFixture.get<DataSource>(DataSource);
    cleanupHelper = new DatabaseCleanupHelper(dataSource);

    await app.init();

    // Create test users with secure, randomized data
    await setupTestUsers();
  });

  beforeEach(async () => {
    await cleanupHelper.quickClean();
    await setupTestUsers();
  });

  afterAll(async () => {
    await cleanupHelper.cleanDatabase();
    await app.close();
  });

  async function setupTestUsers() {
    // Create regular user with randomized secure data
    regularUserCredentials = createTestUser({
      email: generateTestEmail('regular'),
      firstName: 'Regular',
      lastName: 'User',
    });

    const regularResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(regularUserCredentials);

    regularUser = regularResponse.body.user;
    regularUserToken = regularResponse.body.access_token;

    // Create admin user with randomized secure data
    adminUserCredentials = createTestUser({
      email: generateTestEmail('admin'),
      firstName: 'Admin',
      lastName: 'User',
    });

    const adminResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(adminUserCredentials);

    adminUser = adminResponse.body.user;
    adminUserToken = adminResponse.body.access_token;

    // Update admin user role in database
    await userRepository.update(adminUser.id, { role: 'admin' });

    // Create another regular user with randomized secure data
    otherUserCredentials = createTestUser({
      email: generateTestEmail('other'),
      firstName: 'Other',
      lastName: 'User',
    });

    const otherResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(otherUserCredentials);

    otherUser = otherResponse.body.user;
    otherUserToken = otherResponse.body.access_token;
  }

  describe('Blog Creation - POST /blogs', () => {
    const createBlogData = {
      title: 'Test Blog Post',
      content: 'This is test content for the blog post with enough characters to pass validation.',
      excerpt: 'Test excerpt',
    };

    it('should create blog when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/blogs')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(createBlogData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(createBlogData.title);
      expect(response.body.authorId).toBe(regularUser.id);
    });

    it('should reject blog creation without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/blogs')
        .send(createBlogData)
        .expect(401);
    });

    it('should reject blog creation with invalid token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/blogs')
        .set('Authorization', 'Bearer invalid-token')
        .send(createBlogData)
        .expect(401);
    });
  });

  describe('My Blogs - GET /blogs/my-blogs', () => {
    let userBlogs: any[] = [];

    beforeEach(async () => {
      // Clear previous blogs array
      userBlogs = [];
      
      // Create some blogs for the regular user
      const blog1Response = await request(app.getHttpServer())
        .post('/api/v1/blogs')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({
          title: 'My First Blog',
          content: 'This is the content for my first blog post with enough characters.',
          excerpt: 'Excerpt 1',
        });
      
      if (blog1Response.status === 201) {
        userBlogs.push(blog1Response.body);
      }

      const blog2Response = await request(app.getHttpServer())
        .post('/api/v1/blogs')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({
          title: 'My Second Blog',
          content: 'This is the content for my second blog post with enough characters.',
          excerpt: 'Excerpt 2',
        });
      
      if (blog2Response.status === 201) {
        userBlogs.push(blog2Response.body);
      }
    });

    it('should return user own blogs when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/blogs/my-blogs')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body.every((blog: any) => blog.authorId === regularUser.id)).toBe(true);
      
      // Verify we have our test blogs
      const blogTitles = response.body.map((blog: any) => blog.title);
      expect(blogTitles).toContain('My First Blog');
      expect(blogTitles).toContain('My Second Blog');
    });

    it('should reject access without authentication', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/blogs/my-blogs')
        .expect(401);
    });
  });

  describe('Blog Ownership Protection', () => {
    let testBlog: any;

    beforeEach(async () => {
      // Create a blog owned by regular user
      const response = await request(app.getHttpServer())
        .post('/api/v1/blogs')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({
          title: 'Ownership Test Blog',
          content: 'This is test content for blog ownership testing with enough characters.',
          excerpt: 'Test excerpt',
        });

      testBlog = response.body;
    });

    describe('Blog Update - PATCH /blogs/:id', () => {
      const updateData = { title: 'Updated Title' };

      it('should allow owner to update own blog', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/v1/blogs/${testBlog.id}`)
          .set('Authorization', `Bearer ${regularUserToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body.title).toBe(updateData.title);
      });

      it('should allow admin to update any blog', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/v1/blogs/${testBlog.id}`)
          .set('Authorization', `Bearer ${adminUserToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body.title).toBe(updateData.title);
      });

      it('should reject non-owner from updating blog', async () => {
        await request(app.getHttpServer())
          .patch(`/api/v1/blogs/${testBlog.id}`)
          .set('Authorization', `Bearer ${otherUserToken}`)
          .send(updateData)
          .expect(403);
      });

      it('should reject unauthenticated update', async () => {
        await request(app.getHttpServer())
          .patch(`/api/v1/blogs/${testBlog.id}`)
          .send(updateData)
          .expect(401);
      });
    });

    describe('Blog Publish - POST /blogs/:id/publish', () => {
      it('should allow owner to publish own blog', async () => {
        await request(app.getHttpServer())
          .post(`/api/v1/blogs/${testBlog.id}/publish`)
          .set('Authorization', `Bearer ${regularUserToken}`)
          .expect(201);
      });

      it('should allow admin to publish any blog', async () => {
        await request(app.getHttpServer())
          .post(`/api/v1/blogs/${testBlog.id}/publish`)
          .set('Authorization', `Bearer ${adminUserToken}`)
          .expect(201);
      });

      it('should reject non-owner from publishing blog', async () => {
        await request(app.getHttpServer())
          .post(`/api/v1/blogs/${testBlog.id}/publish`)
          .set('Authorization', `Bearer ${otherUserToken}`)
          .expect(403);
      });

      it('should reject unauthenticated publish', async () => {
        await request(app.getHttpServer())
          .post(`/api/v1/blogs/${testBlog.id}/publish`)
          .expect(401);
      });
    });

    describe('Blog Delete - DELETE /blogs/:id', () => {
      it('should allow owner to delete own blog', async () => {
        await request(app.getHttpServer())
          .delete(`/api/v1/blogs/${testBlog.id}`)
          .set('Authorization', `Bearer ${regularUserToken}`)
          .expect(200);
      });

      it('should allow admin to delete any blog', async () => {
        await request(app.getHttpServer())
          .delete(`/api/v1/blogs/${testBlog.id}`)
          .set('Authorization', `Bearer ${adminUserToken}`)
          .expect(200);
      });

      it('should reject non-owner from deleting blog', async () => {
        await request(app.getHttpServer())
          .delete(`/api/v1/blogs/${testBlog.id}`)
          .set('Authorization', `Bearer ${otherUserToken}`)
          .expect(403);
      });

      it('should reject unauthenticated delete', async () => {
        await request(app.getHttpServer())
          .delete(`/api/v1/blogs/${testBlog.id}`)
          .expect(401);
      });
    });
  });

  describe('Blog Like - POST /blogs/:id/like', () => {
    let testBlog: any;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/blogs')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({
          title: 'Likeable Blog',
          content: 'This is content for testing blog liking functionality with enough characters.',
          excerpt: 'Excerpt',
        });

      testBlog = response.body;
    });

    it('should allow authenticated user to like blog', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/blogs/${testBlog.id}/like`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(201);
    });

    it('should reject unauthenticated like', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/blogs/${testBlog.id}/like`)
        .expect(401);
    });
  });

  describe('Public Blog Access (No Authentication Required)', () => {
    beforeEach(async () => {
      // Create some public blogs
      await request(app.getHttpServer())
        .post('/api/v1/blogs')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({
          title: 'Public Blog 1',
          content: 'This is public content for testing public blog access with enough characters.',
          excerpt: 'Public excerpt 1',
        });
    });

    it('should allow public access to blog list', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/blogs')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should allow public access to individual blog', async () => {
      // First get the blogs to find an ID
      const blogsResponse = await request(app.getHttpServer())
        .get('/api/v1/blogs');

      if (blogsResponse.body.length > 0) {
        const blogId = blogsResponse.body[0].id;
        
        await request(app.getHttpServer())
          .get(`/api/v1/blogs/${blogId}`)
          .expect(200);
      }
    });
  });

  describe('Error Handling for Non-existent Blogs', () => {
    const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return 404 for updating non-existent blog', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/blogs/${nonExistentId}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });

    it('should return 404 for deleting non-existent blog', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/blogs/${nonExistentId}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .expect(404);
    });
  });
});
