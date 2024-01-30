using Microsoft.EntityFrameworkCore;

using server.Data;
using server.Data.Models;
using server.Services.Interfaces;

namespace server.Services
{
    public class ProductService(ApplicationDbContext context) : IProductService
    {
        public async Task<List<Product>?> GetAllProductsAsync(string userId) => await context.Products
                .Include(p => p.Category)
                .Where(p => p.Category.UserId == userId)
                .ToListAsync();

        public async Task<Product> CreateProductAsync(Product product)
        {
            context.Products.Add(product);
            await context.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> EditProductAsync(int productId, Product updatedProduct)
        {
            Product? existingProduct = await context.Products.FindAsync(productId);

            if (existingProduct is not null)
            {
                existingProduct.Name = updatedProduct.Name;
                existingProduct.CategoryId = updatedProduct.CategoryId;

                await context.SaveChangesAsync();
            }

            return existingProduct;
        }

        public async Task<bool> DeleteProductAsync(int productId)
        {
            Product? product = await context.Products.FindAsync(productId);

            if (product is not null)
            {
                context.Products.Remove(product);
                await context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<List<Product>?> GetProductsByCategoryAsync(int categoryId) => await context.Products
                .Where(p => p.CategoryId == categoryId)
                .ToListAsync();
    }
}