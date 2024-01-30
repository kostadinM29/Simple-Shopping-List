namespace server.Models.ResponseModels
{
    public class ShoppingListItemResponseModel
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public int Count { get; set; }
        public bool Purchased { get; set; }
    }

    public class ShoppingListDetailsResponseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public List<ShoppingListItemResponseModel> Items { get; set; }
    }
}
