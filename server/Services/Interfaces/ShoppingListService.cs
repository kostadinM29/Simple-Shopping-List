using Microsoft.EntityFrameworkCore;

using server.Data;
using server.Data.Models;
using server.Models.RequestModels;
using server.Models.ResponseModels;
using server.Services.Interfaces;

namespace server.Services
{
    public class ShoppingListService(ApplicationDbContext context) : IShoppingListService
    {
        public async Task<List<ShoppingListDetailsResponseModel>?> GetShoppingListsByUserAsync(string userId)
        {
            List<ShoppingList>? shoppingLists = await context.ShoppingLists
                .Include(sl => sl.Items)
                .ThenInclude(item => item.Product)
                .Where(sl => sl.UserId == userId)
                .ToListAsync();

            if (shoppingLists is null)
            {
                return null;
            }

            var shoppingListDtos = shoppingLists.Select(shoppingList => new ShoppingListDetailsResponseModel
            {
                Id = shoppingList.Id,
                Name = shoppingList.Name,
                Date = shoppingList.Date,
                Items = shoppingList.Items.Select(item => new ShoppingListItemResponseModel
                {
                    Id = item.Id,
                    ProductName = item.Product.Name,
                    Count = item.Count,
                    Purchased = item.Purchased
                }).ToList()
            }).ToList();

            return shoppingListDtos;
        }

        public async Task<ShoppingListDetailsResponseModel?> GetShoppingListDetailsAsync(int listId)
        {
            ShoppingList? shoppingList = await context.ShoppingLists
                .Include(sl => sl.Items)
                .ThenInclude(item => item.Product)
                .FirstOrDefaultAsync(sl => sl.Id == listId);

            if (shoppingList is null)
            {
                return null;
            }

            ShoppingListDetailsResponseModel? responseModel = new ShoppingListDetailsResponseModel
            {
                Id = shoppingList.Id,
                Name = shoppingList.Name,
                Date = shoppingList.Date,
                Items = shoppingList.Items
                    .Select(item => new ShoppingListItemResponseModel
                    {
                        Id = item.Id,
                        ProductName = item.Product.Name,
                        Count = item.Count,
                        Purchased = item.Purchased
                    })
                    .ToList()
            };

            return responseModel;
        }

        public async Task<ShoppingList> CreateShoppingListAsync(string userId, ShoppingListRequestModel request)
        {
            ShoppingList shoppingList = new ShoppingList
            {
                Name = request.Name,
                Date = request.Date,
                UserId = userId
            };

            context.ShoppingLists.Add(shoppingList);
            await context.SaveChangesAsync();

            return shoppingList;
        }

        public async Task<ShoppingList?> EditShoppingListAsync(string userId, int shoppingListId, ShoppingListRequestModel request)
        {
            ShoppingList? existingShoppingList = await context.ShoppingLists.FindAsync(shoppingListId);

            if (existingShoppingList is not null && existingShoppingList.UserId == userId)
            {
                existingShoppingList.Name = request.Name;
                existingShoppingList.Date = request.Date;
                await context.SaveChangesAsync();
            }

            return existingShoppingList;
        }

        public async Task<bool> DeleteShoppingListAsync(string userId, int shoppingListId)
        {
            ShoppingList? shoppingList = await context.ShoppingLists.FindAsync(shoppingListId);

            if (shoppingList is not null && shoppingList.UserId == userId)
            {
                context.ShoppingLists.Remove(shoppingList);
                await context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> ShoppingListExistsForUserAsync(string userId, int shoppingListId) => await context.ShoppingLists
            .AnyAsync(sl => sl.UserId == userId && sl.Id == shoppingListId);

        public async Task<ShoppingListItem?> AddProductToShoppingListAsync(string userId, int shoppingListId, int productId, int count)
        {
            if (!await ShoppingListExistsForUserAsync(userId, shoppingListId))
            {
                return null;
            }

            bool productOwnedByUser = await context.Products.AnyAsync(p => p.Id == productId && p.Category.UserId == userId);

            if (!productOwnedByUser)
            {
                return null;
            }

            bool productAlreadyAdded = await context.ShoppingListItems
                .AnyAsync(item => item.ProductId == productId && item.ShoppingListId == shoppingListId);

            if (productAlreadyAdded)
            {
                return null;
            }

            ShoppingListItem shoppingListItem = new ShoppingListItem
            {
                Purchased = false,
                Count = count,
                ProductId = productId,
                ShoppingListId = shoppingListId
            };

            context.ShoppingListItems.Add(shoppingListItem);
            await context.SaveChangesAsync();

            return shoppingListItem;
        }

        public async Task<bool> RemoveProductFromShoppingListAsync(string userId, int shoppingListId, int shoppingListItemId)
        {
            if (!await ShoppingListExistsForUserAsync(userId, shoppingListId))
            {
                return false;
            }

            ShoppingListItem? shoppingListItem = await context.ShoppingListItems
                .Where(item => item.Id == shoppingListItemId && item.ShoppingList.UserId == userId)
                .FirstOrDefaultAsync();

            if (shoppingListItem != null)
            {
                context.ShoppingListItems.Remove(shoppingListItem);
                await context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> ToggleProductPurchasedAsync(string userId, int shoppingListId, int shoppingListItemId)
        {
            if (!await ShoppingListExistsForUserAsync(userId, shoppingListId))
            {
                return false;
            }

            ShoppingListItem? shoppingListItem = await context.ShoppingListItems
                .Where(item => item.Id == shoppingListItemId && item.ShoppingList.UserId == userId)
                .FirstOrDefaultAsync();

            if (shoppingListItem is not null)
            {
                shoppingListItem.Purchased = !shoppingListItem.Purchased; // Toggle the state
                await context.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }
}