/**
 * Template Method Pattern - Cooking Recipe Example
 *
 * This example demonstrates how to use the Template Method pattern
 * to create different types of recipes while sharing common cooking steps.
 */

// Abstract class defining the cooking template
abstract class Recipe {
  /**
   * Template method - defines the cooking algorithm structure
   * This method cannot be overridden by subclasses
   */
  public cook(): void {
    console.log(`\n🍳 Cooking ${this.getRecipeName()} 🍳`);
    console.log('=' .repeat(40));

    // Step 1: Prepare ingredients
    this.prepareIngredients();

    // Step 2: Preheat equipment (hook - optional)
    if (this.shouldPreheat()) {
      this.preheatEquipment();
    }

    // Step 3: Cook (abstract - must be implemented by subclasses)
    this.cookMainDish();

    // Step 4: Add seasoning (concrete - can be overridden)
    this.addSeasoning();

    // Step 5: Garnish (hook - optional)
    if (this.shouldGarnish()) {
      this.garnish();
    }

    // Step 6: Serve
    this.serve();

    console.log('=' .repeat(40));
    console.log(`✅ ${this.getRecipeName()} is ready!\n`);
  }

  // Abstract methods - must be implemented by subclasses
  protected abstract getRecipeName(): string;
  protected abstract cookMainDish(): void;

  // Concrete methods - default implementation, can be overridden
  protected prepareIngredients(): void {
    console.log('📋 Preparing ingredients...');
    console.log('  - Washing vegetables');
    console.log('  - Measuring ingredients');
    console.log('  - Chopping vegetables');
    console.log('✅ Ingredients prepared');
  }

  protected addSeasoning(): void {
    console.log('🧂 Adding seasoning...');
    console.log('  - Salt and pepper');
    console.log('  - Basic herbs');
    console.log('✅ Seasoning added');
  }

  protected serve(): void {
    console.log('🍽️  Serving dish...');
    console.log('  - Plating the food');
    console.log('  - Adding final touches');
    console.log('✅ Dish served');
  }

  // Hook methods - optional override
  protected shouldPreheat(): boolean {
    return false; // Default: no preheating needed
  }

  protected preheatEquipment(): void {
    console.log('🔥 Preheating equipment...');
    console.log('✅ Equipment preheated');
  }

  protected shouldGarnish(): boolean {
    return true; // Default: garnish the dish
  }

  protected garnish(): void {
    console.log('🌿 Adding garnish...');
    console.log('  - Fresh herbs');
    console.log('  - Lemon wedge');
    console.log('✅ Garnish added');
  }
}

// Concrete implementation for Pasta recipe
class PastaRecipe extends Recipe {
  protected getRecipeName(): string {
    return 'Spaghetti Carbonara';
  }

  protected cookMainDish(): void {
    console.log('🍝 Cooking pasta...');
    console.log('  - Boiling water');
    console.log('  - Adding pasta to boiling water');
    console.log('  - Cooking for 8-10 minutes');
    console.log('  - Preparing carbonara sauce');
    console.log('  - Mixing pasta with sauce');
    console.log('✅ Pasta cooked');
  }

  // Override hook method
  protected shouldPreheat(): boolean {
    return false; // No preheating for pasta
  }

  // Override concrete method
  protected addSeasoning(): void {
    console.log('🧂 Adding pasta seasoning...');
    console.log('  - Salt in boiling water');
    console.log('  - Black pepper');
    console.log('  - Parmesan cheese');
    console.log('✅ Pasta seasoning added');
  }

  // Override hook method
  protected garnish(): void {
    console.log('🌿 Adding pasta garnish...');
    console.log('  - Fresh parsley');
    console.log('  - Extra parmesan');
    console.log('  - Black pepper');
    console.log('✅ Pasta garnish added');
  }
}

// Concrete implementation for Cake recipe
class CakeRecipe extends Recipe {
  protected getRecipeName(): string {
    return 'Chocolate Cake';
  }

  protected cookMainDish(): void {
    console.log('🍰 Baking cake...');
    console.log('  - Mixing dry ingredients');
    console.log('  - Mixing wet ingredients');
    console.log('  - Combining mixtures');
    console.log('  - Pouring into cake pan');
    console.log('  - Baking at 350°F for 30 minutes');
    console.log('✅ Cake baked');
  }

  // Override hook method
  protected shouldPreheat(): boolean {
    return true; // Oven needs preheating for cake
  }

  protected preheatEquipment(): void {
    console.log('🔥 Preheating oven...');
    console.log('  - Setting temperature to 350°F');
    console.log('  - Waiting for oven to heat up');
    console.log('✅ Oven preheated');
  }

  // Override concrete method
  protected addSeasoning(): void {
    console.log('🍫 Adding cake flavoring...');
    console.log('  - Vanilla extract');
    console.log('  - Chocolate chips');
    console.log('✅ Cake flavoring added');
  }

  // Override hook method
  protected garnish(): void {
    console.log('🍓 Adding cake decoration...');
    console.log('  - Chocolate frosting');
    console.log('  - Fresh strawberries');
    console.log('  - Sprinkles');
    console.log('✅ Cake decorated');
  }
}

// Concrete implementation for Salad recipe
class SaladRecipe extends Recipe {
  protected getRecipeName(): string {
    return 'Greek Salad';
  }

  protected cookMainDish(): void {
    console.log('🥗 Preparing salad...');
    console.log('  - Chopping vegetables');
    console.log('  - Mixing ingredients');
    console.log('  - Adding feta cheese');
    console.log('  - Drizzling olive oil');
    console.log('✅ Salad prepared');
  }

  // Override hook method
  protected shouldPreheat(): boolean {
    return false; // No preheating for salad
  }

  // Override concrete method
  protected addSeasoning(): void {
    console.log('🧂 Adding salad seasoning...');
    console.log('  - Olive oil');
    console.log('  - Balsamic vinegar');
    console.log('  - Oregano');
    console.log('  - Salt and pepper');
    console.log('✅ Salad seasoning added');
  }

  // Override hook method
  protected shouldGarnish(): boolean {
    return false; // No garnish for simple salad
  }
}

// Standalone demonstration function
export function demonstrateCookingTemplateMethod() {
  console.log('👨‍🍳 Template Method Pattern - Cooking Recipe Example\n');

  try {
    // Cook different recipes
    const pastaRecipe = new PastaRecipe();
    pastaRecipe.cook();

    const cakeRecipe = new CakeRecipe();
    cakeRecipe.cook();

    const saladRecipe = new SaladRecipe();
    saladRecipe.cook();

  } catch (error) {
    console.error('Error during cooking:', (error as Error).message);
  }
}

// Run the demonstration
demonstrateCookingTemplateMethod();
