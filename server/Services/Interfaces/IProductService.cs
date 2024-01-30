using server.Data.Models;

namespace server.Services.Interfaces
{
    public interface IProductService
    {
        Task<List<Product>?> GetAllProductsAsync(string userId);
        Task<Product> CreateProductAsync(Product product);
        Task<Product?> EditProductAsync(int productId, Product updatedProduct);
        Task<bool> DeleteProductAsync(int productId);
        Task<List<Product>?> GetProductsByCategoryAsync(int categoryId);
    }
}