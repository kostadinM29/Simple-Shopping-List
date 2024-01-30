using server.Data.Models;
using server.Models.RequestModels;
using server.Models.ResponseModels;

namespace server.Services.Interfaces
{
    public interface IShoppingListService
    {
        Task<List<ShoppingListDetailsResponseModel>?> GetShoppingListsByUserAsync(string userId);

        Task<ShoppingListDetailsResponseModel?> GetShoppingListDetailsAsync(int listId);

        Task<ShoppingList> CreateShoppingListAsync(string userId, ShoppingListRequestModel request);

        Task<ShoppingList> EditShoppingListAsync(string userId, int shoppingListId, ShoppingListRequestModel request);

        Task<bool> DeleteShoppingListAsync(string userId, int shoppingListId);

        Task<bool> ShoppingListExistsForUserAsync(string userId, int shoppingListId);

        Task<ShoppingListItem?> AddProductToShoppingListAsync(string userId, int shoppingListId, int productId, int count);

        Task<bool> RemoveProductFromShoppingListAsync(string userId, int shoppingListId, int shoppingListItemId);

        Task<bool> ToggleProductPurchasedAsync(string userId, int shoppingListId, int shoppingListItemId);
    }
}