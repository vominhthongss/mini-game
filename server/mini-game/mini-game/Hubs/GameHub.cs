using Microsoft.AspNetCore.SignalR;

namespace Hubs
{
    public class GameHub : Hub
    {
        // Bảng cờ 3x3
        private static string[] board = new string[9];
        private static string currentPlayer = "X";

        public async Task JoinGame(string gameId)
        {
            Console.WriteLine("gameId ", gameId);
            // Gửi trạng thái ban đầu của game đến người chơi
            await Clients.Caller.SendAsync("ReceiveBoard", board);
            await Clients.Caller.SendAsync("ReceivePlayer", currentPlayer);
        }

        public async Task Log(string date)
        {
            await Clients.All.SendAsync("Log", date);

        }

        public async Task MakeMove(int index, string player)
        {
            // Kiểm tra người chơi có đúng lượt không
            if (player != currentPlayer)
                return;

            // Cập nhật bảng cờ
            board[index] = player;
            currentPlayer = (player == "X") ? "O" : "X";

            // Gửi trạng thái game đến tất cả người chơi
            await Clients.All.SendAsync("ReceiveBoard", board);
            await Clients.All.SendAsync("ReceivePlayer", currentPlayer);
        }
    }
}