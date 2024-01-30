using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using server.Data.Models;
using server.Models.RequestModels;
using server.Models.ResponseModels;
using server.Services.Interfaces;

namespace server.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize]
    public class ShoppingListController(IShoppingListService shoppingListService) : ControllerBase
    {
        [HttpGet("all-shopping-lists")]
        public async Task<IActionResult> GetShoppingListsByUser()
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            List<ShoppingListDetailsResponseModel>? shoppingLists = await shoppingListService.GetShoppingListsByUserAsync(userId);

            return Ok(shoppingLists);
        }

        [HttpGet("one-shopping-list/{listId}")]
        public async Task<IActionResult> GetShoppingListDetails(int listId)
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            bool shoppingListExists = await shoppingListService.ShoppingListExistsForUserAsync(userId, listId);

            if (!shoppingListExists)
            {
                return NotFound("Shopping list not found");
            }

            ShoppingListDetailsResponseModel? shoppingListDetails = await shoppingListService.GetShoppingListDetailsAsync(listId);

            if (shoppingListDetails is null)
            {
                return NotFound("Shopping list not found");
            }

            return Ok(shoppingListDetails);
        }

        [HttpPost("add-shopping-list")]
        public async Task<IActionResult> AddShoppingList(ShoppingListRequestModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            ShoppingList? shoppingList = await shoppingListService.CreateShoppingListAsync(userId, request);

            return Ok(shoppingList);
        }

        [HttpPut("edit-shopping-list/{shoppingListId}")]
        public async Task<IActionResult> EditShoppingList(int shoppingListId, ShoppingListRequestModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            bool shoppingListExists = await shoppingListService.ShoppingListExistsForUserAsync(userId, shoppingListId);

            if (!shoppingListExists)
            {
                return NotFound("Shopping list not found");
            }

            ShoppingList? updatedShoppingList = await shoppingListService.EditShoppingListAsync(userId, shoppingListId, request);

            return Ok(updatedShoppingList);
        }

        [HttpDelete("delete-shopping-list/{shoppingListId}")]
        public async Task<IActionResult> DeleteShoppingList(int shoppingListId)
        {
            if (shoppingListId <= 0)
            {
                return BadRequest("Invalid shopping list ID");
            }

            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            bool shoppingListExists = await shoppingListService.ShoppingListExistsForUserAsync(userId, shoppingListId);

            if (!shoppingListExists)
            {
                return NotFound("Shopping list not found");
            }

            bool deleted = await shoppingListService.DeleteShoppingListAsync(userId, shoppingListId);

            if (deleted)
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500, "Failed to delete shopping list");
            }
        }

        [HttpPost("add-product-to-shopping-list/{shoppingListId}")]
        public async Task<IActionResult> AddProductToShoppingList(int shoppingListId, ShoppingListItemRequestModel model)
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            ShoppingListItem? shoppingListItem = await shoppingListService.AddProductToShoppingListAsync(userId, shoppingListId, model.ProductId, model.Count);

            if (shoppingListItem is not null)
            {
                return Ok(shoppingListItem);
            }

            return BadRequest("Failed to add product to shopping list");
        }

        [HttpDelete("remove-product-from-shopping-list/{shoppingListId}/{shoppingListItemId}")]
        public async Task<IActionResult> RemoveProductFromShoppingList(int shoppingListId, int shoppingListItemId)
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            bool removed = await shoppingListService.RemoveProductFromShoppingListAsync(userId, shoppingListId, shoppingListItemId);

            if (removed)
            {
                return NoContent();
            }

            return BadRequest("Failed to remove product from shopping list");
        }

        [HttpPut("toggle-item-purchased/{shoppingListId}/{shoppingListItemId}")]
        public async Task<IActionResult> ToggleItemPurchased(int shoppingListId, int shoppingListItemId)
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            bool toggled = await shoppingListService.ToggleProductPurchasedAsync(userId, shoppingListId, shoppingListItemId);

            return Ok(toggled);
        }
    }
}