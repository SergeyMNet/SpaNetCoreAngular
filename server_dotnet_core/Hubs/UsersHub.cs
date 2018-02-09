using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatServer.Db;
using ChatServer.Models;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace ChatServer.Hubs
{   
    public class UsersHub : Hub
    {
        /// <summary>
        /// Geting new Avatar
        ///     - share between all
        ///     - TODO: save avatar to db
        /// </summary>
        public void add(object newAvatar)
        {
            var json = JsonConvert.SerializeObject(newAvatar);
            Avatar a = JsonConvert.DeserializeObject<Avatar>(json);

            FakeStorage.Avatars.Add(a);
            Clients.All.InvokeAsync("avatars", FakeStorage.Avatars);
        }

        public void remove(object avatar)
        {
            var json = JsonConvert.SerializeObject(avatar);
            Avatar a = JsonConvert.DeserializeObject<Avatar>(json);
            FakeStorage.Avatars.Remove(FakeStorage.Avatars.FirstOrDefault(ava => ava.id == a.id));

            Clients.All.InvokeAsync("avatars", FakeStorage.Avatars);
        }
    }
}
