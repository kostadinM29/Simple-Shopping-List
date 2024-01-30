using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using server.Data.Models;
using server.Models.RequestModels;
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize]
    public class ProductController(IProductService productService) : ControllerBase
    {
        [HttpGet("all-products")]
        public async Task<IActionResult> GetAllProducts()
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            List<Product>? products = await productService.GetAllProductsAsync(userId);

            return Ok(products);
        }

        [HttpPost("add-product")]
        public async Task<IActionResult> AddProduct(ProductRequestModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Product? product = new Product
            {
                Name = request.Name,
                CategoryId = request.CategoryId
            };

            Product? createdProduct = await productService.CreateProductAsync(product);
            return Ok(createdProduct);
        }


        [HttpPut("edit-product/{productId}")]
        public async Task<IActionResult> EditProduct(int productId, ProductRequestModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Product? updatedProduct = new Product
            {
                Name = request.Name,
                CategoryId = request.CategoryId
            };

            Product? editedProduct = await productService.EditProductAsync(productId, updatedProduct);

            if (editedProduct is not null)
            {
                return Ok(editedProduct);
            }

            return NotFound();
        }

        [HttpDelete("delete-product/{productId}")]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            bool result = await productService.DeleteProductAsync(productId);

            if (result)
            {
                return NoContent();
            }

            return StatusCode(500, "Failed to delete product");
        }
    }
}
