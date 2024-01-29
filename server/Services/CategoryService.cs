using Microsoft.EntityFrameworkCore;

using server.Data;
using server.Data.Models;
using server.Services.Interfaces;

namespace server.Services
{
    public class CategoryService(ApplicationDbContext context) : ICategoryService
    {
        public async Task<List<Category>?> GetCategoriesByUserAsync(string userId) => await context.Categories
                .Where(c => c.UserId == userId)
                .ToListAsync();

        public async Task<Category>? AddCategoryAsync(string userId, string categoryName)
        {
            Category? category = new Category
            {
                UserId = userId,
                Name = categoryName
            };

            context.Categories.Add(category);
            await context.SaveChangesAsync();

            return category;
        }

        public async Task<Category?> EditCategoryAsync(string userId, int categoryId, string newName)
        {
            Category? category = await context.Categories
                .Where(c => c.Id == categoryId && c.UserId == userId)
                .FirstOrDefaultAsync();

            if (category is not null)
            {
                category.Name = newName;
                await context.SaveChangesAsync();
            }

            return category;
        }

        public async Task<bool> DeleteCategoryAsync(string userId, int categoryId)
        {
            Category? category = await context.Categories
                .Where(c => c.Id == categoryId && c.UserId == userId)
                .FirstOrDefaultAsync();

            if (category is not null)
            {
                context.Categories.Remove(category);
                await context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> CategoryExistsForUserAsync(string userId, int categoryId) => await context.Categories
                .AnyAsync(c => c.Id == categoryId && c.UserId == userId);
    }
}