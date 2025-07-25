# Permissions and Role Logic

This document describes how permissions and roles are enforced for **users**, **posts**, and **comments** in the system.

---

## Roles

- **Admin**: Full permissions on all resources.
- **Moderator**: Elevated permissions, can moderate content but not users.
- **Regular User**: Standard permissions, can manage their own content.

---

## Permission Matrix

| Entity   | Operation   | Regular User                | Moderator                | Admin                    |
|----------|-------------|----------------------------|--------------------------|--------------------------|
| **Post** | Create      | Yes (published only)        | Yes                      | Yes                      |
|          | View        | Published/own              | Any                      | Any                      |
|          | Update      | Own only                   | Any                      | Any                      |
|          | Delete      | Own only                   | Any                      | Any                      |
| **Comment** | Create   | Yes                        | Yes                      | Yes                      |
|          | Update      | Own only                   | Any                      | Any                      |
|          | Delete      | Own only                   | Any                      | Any                      |
| **User** | Update      | Own only, limited fields   | Own only, limited fields | Any, any field           |
|          | View        | Any                        | Any                      | Any                      |
|          | Delete      | No                         | No                       | Any (not self)           |

---

## Detailed Logic

### Post Permissions

- **Admin**
  - Can create, view, update, and delete any post.
  - No restrictions on post data.
- **Moderator**
  - Can create, view, update, and delete any post.
  - No restrictions on post data.
- **Regular User**
  - Can create posts (only if `isPublished !== false`).
  - Can view published posts or their own posts.
  - Can update/delete only their own posts.
  - Can update content and publishing status.

### Comment Permissions

- **Admin & Moderator**
  - Can create, update, and delete any comment.
  - No restrictions on comment data.
- **Regular User**
  - Can create comments on any post.
  - Can update/delete only their own comments.
  - Can only create if content is present.
  - Can only update if they are the author and content is present.

### User Permissions

- **Admin**
  - Can update any user (including self), any field.
  - Can view any user.
  - Can delete any user (except self).
- **Moderator & Regular User**
  - Can update only their own profile, and only allowed fields (`firstName`, `lastName`, `bio`, `avatarUrl`).
  - Can view any user.
  - Cannot delete users.

---

## Implementation Notes

- **Strategy Pattern** is used for permission checks. Each role has a strategy class for posts, comments, and users.
- **Guards** (e.g., `RolesGuard`) enforce route-level access based on role.
- **Service Layer** enforces business logic using the strategy classes.

---

## How to Change Permissions

- To change what a role can do, edit the relevant strategy class for that role and entity (e.g., `RegularPostStrategy` for regular users and posts).
- To add new permissions, add new methods to the strategy interfaces and implement them in each strategy class.

---
