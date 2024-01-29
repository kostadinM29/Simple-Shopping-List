using server.Data.Models;

namespace server.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<List<Category>?> GetCategoriesByUserAsync(string userId);
        Task<Category>? AddCategoryAsync(string userId, string categoryName);
        Task<Category?> EditCategoryAsync(string userId, int categoryId, string newName);
        Task<bool> DeleteCategoryAsync(string userId, int categoryId);
        Task<bool> CategoryExistsForUserAsync(string userId, int categoryId);
    }
}