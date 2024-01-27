using Microsoft.AspNetCore.Identity;

namespace server.Data.Models
{
    public class ApplicationUser : IdentityUser
    {
        public virtual ICollection<Category> Categories { get; set; } = [];
        public virtual ICollection<ShoppingList> ShoppingLists { get; set; } = [];
    }
}