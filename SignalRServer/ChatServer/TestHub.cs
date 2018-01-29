using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ChatServer
{
    public class TestHub : Hub
    {
        bool start = false;

        public async Task GetRandomData()
        {   
            if(!start)
            do
            {
                start = true;
                var r = new Random();
                await Clients.All.InvokeAsync("getRandomData", r.Next(1, 10));
                await Task.Delay(1000);
            } while (start);
        }


        // chat
        public void SendToAll(string name, string message)
        {
            Clients.All.InvokeAsync("sendToAll", name, message);
        }
    }
}
