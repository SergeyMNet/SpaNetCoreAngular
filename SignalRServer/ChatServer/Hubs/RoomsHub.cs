using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatServer.Db;
using Microsoft.AspNetCore.SignalR;

namespace ChatServer.Hubs
{
    public class RoomsHub : Hub
    {
        /// <summary>
        /// Geting new Room
        ///     - share between all
        ///     - TODO: save room to db
        /// </summary>
        public void add(string newRoom)
        {
            Console.WriteLine("-- newRoom = " + newRoom);
            string name = newRoom.Split("/chat_rooms/", StringSplitOptions.None)[1];
            if(!FakeStorage.Rooms.Any(r => r == name))
                FakeStorage.Rooms.Add(name);
            Clients.All.InvokeAsync("rooms", FakeStorage.Rooms);
        }

        public void remove(string room)
        {
            FakeStorage.Rooms.Remove(room);
            Clients.All.InvokeAsync("rooms", FakeStorage.Rooms);
        }
    }
}
