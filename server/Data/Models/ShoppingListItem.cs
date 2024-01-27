using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace server.Data.Models
{
    public class ShoppingListItem
    {
        [Key]
        public int Id { get; set; }

        public int Count { get; set; }

        public bool Purchased { get; set; }

        [ForeignKey(nameof(Product))]
        public int ProductId { get; set; }
        public virtual Product Product { get; set; }

        [ForeignKey(nameof(ShoppingList))]
        public int ShoppingListId { get; set; }
        public virtual ShoppingList ShoppingList { get; set; }
    }
}