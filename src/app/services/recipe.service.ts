import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.module';
import { ShoppingListService } from './shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Array<Recipe> = [];

  // private recipes: Recipe[] = [
  //   new Recipe('A Test Recipe', 'This is simply a test', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgq1r-4pKpa_zmhuCL05RM8JYw_53tbKEiXQ&usqp=CAU', [new Ingredient('Meat', 1),
  //   new Ingredient('chicken', 3)]),
  //   new Recipe('Another Test Recipe', 'This is another test', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgq1r-4pKpa_zmhuCL05RM8JYw_53tbKEiXQ&usqp=CAU', [new Ingredient('Buns', 6),
  //   new Ingredient('Brad', 2)])
  // ];
  constructor(private shoppingListService: ShoppingListService) { }

  setRecipes(recipes: Array<Recipe>) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipeById(index: number): Recipe {
    return this.recipes[index];
  }

  addIngredientsToShoppinList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice())
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice())
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice())
  }
}
