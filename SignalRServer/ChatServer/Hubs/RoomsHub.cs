using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ChatServer.Hubs
{
    public class RoomsHub : Hub
    {
        // todo: fake Db
        public static List<string> allRooms = new List<string>();


        /// <summary>
        /// Geting new Room
        ///     - share between all
        ///     - TODO: save room to db
        /// </summary>
        public void add(string newRoom)
        {
            Console.WriteLine("-- newRoom = " + newRoom);
            string name = newRoom.Split("/chat_rooms/", StringSplitOptions.None)[1];
            if(!allRooms.Any(r => r == name))
            allRooms.Add(name);
            Clients.All.InvokeAsync("rooms", allRooms);
        }

        public void remove(string room)
        {
            allRooms.Remove(room);
            Clients.All.InvokeAsync("rooms", allRooms);
        }
    }
}
