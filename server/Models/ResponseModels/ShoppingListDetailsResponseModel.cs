namespace server.Models.ResponseModels
{
    public class ShoppingListDetailsResponseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public List<ShoppingListItemResponseModel> Items { get; set; }
    }
}
