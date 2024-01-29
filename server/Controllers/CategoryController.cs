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
    public class CategoryController(ICategoryService categoryService) : ControllerBase
    {
        [HttpGet("all-categories")]
        public async Task<IActionResult> GetCategoriesByUser()
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            List<Category>? categories = await categoryService.GetCategoriesByUserAsync(userId);

            return Ok(categories);
        }

        [HttpPost("add-category")]
        public async Task<IActionResult> AddCategory(CategoryRequestModel model)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                return BadRequest("Category name cannot be empty");
            }

            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            Category? category = await categoryService.AddCategoryAsync(userId, model.Name);

            return Ok(category);
        }

        [HttpPut("edit-category/{categoryId}")]
        public async Task<IActionResult> EditCategory(int categoryId, CategoryRequestModel request)
        {
            if (categoryId <= 0)
            {
                return BadRequest("Invalid category ID");
            }

            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            bool categoryExists = await categoryService.CategoryExistsForUserAsync(userId, categoryId);

            if (!categoryExists)
            {
                return NotFound("Category not found");
            }

            Category? updatedCategory = await categoryService.EditCategoryAsync(userId, categoryId, request.Name);

            return Ok(updatedCategory);
        }

        [HttpDelete("delete-category/{categoryId}")]
        public async Task<IActionResult> DeleteCategory(int categoryId)
        {
            if (categoryId <= 0)
            {
                return BadRequest("Invalid category ID");
            }

            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            bool categoryExists = await categoryService.CategoryExistsForUserAsync(userId, categoryId);

            if (!categoryExists)
            {
                return NotFound("Category not found");
            }

            bool deleted = await categoryService.DeleteCategoryAsync(userId, categoryId);

            if (deleted)
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500, "Failed to delete category");
            }
        }

    }
}