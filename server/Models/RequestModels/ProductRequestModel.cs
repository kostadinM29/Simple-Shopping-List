using System.ComponentModel.DataAnnotations;

namespace server.Models.RequestModels
{
    public class ProductRequestModel
    {
        public string Name { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}