using Microsoft.AspNetCore.SignalR;

namespace Hubs
{
    public class GameHub : Hub
    {
        private static int playerCount = 0;
        public async Task JoinGame()
        {
            if (playerCount < 2)
            {
                if (playerCount == 0)
                {
                    await Clients.Caller.SendAsync("YourPlayer", "X");

                }
                else if (playerCount == 1)
                {
                    await Clients.Caller.SendAsync("YourPlayer", "O");

                }
                await Clients.All.SendAsync("Log", new DateTime());
            }
            else
            {
                await Clients.All.SendAsync("Log", "Full users over 2 players");
            }
            playerCount++;

        }

        public async Task Log(string message)
        {
            await Clients.All.SendAsync("Log", message);

        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Client {Context.ConnectionId} disconnected!");

            if (exception != null)
            {
                Console.WriteLine($"Error: {exception.Message}");
            }
            playerCount--;
            await Clients.All.SendAsync("Log", "Player count " + playerCount);

            await base.OnDisconnectedAsync(exception);
        }
    }
}