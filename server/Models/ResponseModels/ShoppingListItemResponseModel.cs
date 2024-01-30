namespace server.Models.ResponseModels
{
    public class ShoppingListItemResponseModel
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public int Count { get; set; }
        public bool Purchased { get; set; }
    }
}