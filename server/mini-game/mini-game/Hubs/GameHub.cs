using Microsoft.AspNetCore.SignalR;

namespace Hubs
{
    public class GameHub : Hub
    {
        private static Dictionary<string, string> player = new Dictionary<string, string> { { "X", "" }, { "O", "" } };

        private static Dictionary<string, string> game = new Dictionary<string, string> { { "board", "" }, { "playerTurn", "X" }, { "winner", "" } };

        public async Task JoinGame()
        {
            if (player["X"] == "")
            {
                player["X"] = Context.ConnectionId;
                await Clients.Caller.SendAsync("YourPlayer", "X");

                await Clients.All.SendAsync("MakeMove", game["board"], game["playerTurn"], game["winner"]);

            }
            else if (player["O"] == "")
            {
                player["O"] = Context.ConnectionId;
                await Clients.Caller.SendAsync("YourPlayer", "O");
                await Clients.All.SendAsync("MakeMove", game["board"], game["playerTurn"], game["winner"]);
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
        public async Task MakeMove(string board, string playerTurn, string winner)
        {
            game["board"] = board;
            game["playerTurn"] = playerTurn == "X" ? "O" : "X";
            game["winner"] = winner;
            await Clients.All.SendAsync("MakeMove", game["board"], game["playerTurn"], game["winner"]);
        }

        public async Task NewGame()
        {
            game["board"] = "";
            game["playerTurn"] = "X";
            game["winner"] = "";
            await Clients.All.SendAsync("NewGame");
        }
        public async Task PlayerTurn(string player)
        {
            await Clients.All.SendAsync("PlayerTurn", player);
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