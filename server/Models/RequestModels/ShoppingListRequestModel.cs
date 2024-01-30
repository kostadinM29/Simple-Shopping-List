
using System.ComponentModel.DataAnnotations;

namespace server.Models.RequestModels
{
    public class ShoppingListRequestModel
    {
        [Required]
        public string Name { get; set; }

        public DateTime Date { get; set; }
    }
}