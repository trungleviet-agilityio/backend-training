/**
 * Observer Pattern - Blog/Subscriber Example
 *
 * Blog acts as the Publisher/Subject.
 * Subscribers register to receive updates when a new post is published.
 */

// Observer interface
interface Subscriber {
  update(blog: Blog): void;
}

// Publisher/Subject
class Blog {
  private subscribers: Subscriber[] = [];
  private latestPost: string | null = null;

  subscribe(sub: Subscriber) {
    this.subscribers.push(sub);
  }

  unsubscribe(sub: Subscriber) {
    this.subscribers = this.subscribers.filter(s => s !== sub);
  }

  publish(post: string) {
    this.latestPost = post;
    this.notify();
  }

  getState(): string | null {
    return this.latestPost;
  }

  private notify() {
    for (const sub of this.subscribers) {
      sub.update(this);
    }
  }
}

// Concrete Subscriber
class EmailSubscriber implements Subscriber {
  constructor(private email: string) {}
  update(blog: Blog): void {
    console.log(`📧 Email to ${this.email}: New blog post - "${blog.getState()}"`);
  }
}

class SmsSubscriber implements Subscriber {
  constructor(private phone: string) {}
  update(blog: Blog): void {
    console.log(`📱 SMS to ${this.phone}: New blog post - "${blog.getState()}"`);
  }
}

// Demo
export function demonstrateBlogObserver() {
  const blog = new Blog();
  const alice = new EmailSubscriber('alice@example.com');
  const bob = new SmsSubscriber('123-456-7890');

  blog.subscribe(alice);
  blog.subscribe(bob);

  console.log('\n--- Publishing first post ---');
  blog.publish('Observer Pattern in TypeScript');

  // Bob unsubscribes
  blog.unsubscribe(bob);

  console.log('\n--- Publishing second post ---');
  blog.publish('Understanding the Mediator Pattern');
}

demonstrateBlogObserver();
