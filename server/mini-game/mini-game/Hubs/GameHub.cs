using Microsoft.AspNetCore.SignalR;

namespace Hubs
{
    public class GameHub : Hub
    {
        private static Dictionary<string, string> player = new Dictionary<string, string> { { "X", "" }, { "O", "" } };

        public async Task JoinGame()
        {
            if (player["X"] == "")
            {
                player["X"] = Context.ConnectionId;
                await Clients.Caller.SendAsync("YourPlayer", "X");

            }
            else if (player["O"] == "")
            {
                player["O"] = Context.ConnectionId;
                await Clients.Caller.SendAsync("YourPlayer", "O");
            }
            else
            {
                await Clients.All.SendAsync("Log", "Kết nối thành công !");
                await Clients.All.SendAsync("Log", "Đủ 2 người rồi :D");
            }
            await Clients.All.SendAsync("Log", "player X " + player["X"] + " và " + "player O " + player["O"]);

        }

        public async Task Log(string message)
        {
            await Clients.All.SendAsync("Log", message);
        }
        public async Task MakeMove(string board)
        {
            await Clients.All.SendAsync("MakeMove", board);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Client {Context.ConnectionId} disconnected!");

            if (exception != null)
            {
                Console.WriteLine($"Error: {exception.Message}");
            }
            if (player["X"] == Context.ConnectionId)
            {
                player["X"] = "";
            }
            if (player["O"] == Context.ConnectionId)
            {
                player["O"] = "";
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}